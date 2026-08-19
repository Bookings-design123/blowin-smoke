if (process.env.NODE_ENV !== "test") {
  throw new Error("TEST_COMMERCE_STORE_FORBIDDEN_OUTSIDE_TEST");
}

const EXPECTED_CAPABILITY = Object.freeze({
  CreateProduct: "catalog.edit",
  SetRetailPrice: "price.retail.edit",
  ReceiveInventory: "inventory.receive",
  PublishProduct: "catalog.publish",
  UnpublishProduct: "catalog.unpublish",
});

function rejection(status, code) {
  const error = new Error(code);
  error.status = status;
  error.code = code;
  error.safe = true;
  return error;
}

function hasCapability(actor, capability) {
  return (
    actor &&
    Array.isArray(actor.capabilities) &&
    actor.capabilities.includes(capability)
  );
}

function commandFingerprint(command) {
  return JSON.stringify({ type: command.type, payload: command.payload });
}

function inventoryFor(state, productId) {
  return state.inventoryLedger.filter((entry) => entry.productId === productId);
}

function availableQuantity(state, productId) {
  return inventoryFor(state, productId).reduce((total, entry) => {
    if (entry.disposition !== "SELLABLE") return total;
    return total + entry.quantityDelta;
  }, 0);
}

function currentQuantity(state, productId) {
  return inventoryFor(state, productId).reduce(
    (total, entry) => total + entry.quantityDelta,
    0,
  );
}

function adminProjection(state, product) {
  const price = state.retailPrices.get(product.variantId) ?? null;
  return Object.freeze({
    id: product.id,
    variantId: product.variantId,
    skuId: product.skuId,
    name: product.name,
    sku: product.sku,
    publicationState: product.publicationState,
    version: state.versionsByProductId.get(product.id) ?? 0,
    retailPrice: price,
    currentQuantity: currentQuantity(state, product.id),
    availableQuantity: availableQuantity(state, product.id),
    inventoryHistory: Object.freeze([...inventoryFor(state, product.id)]),
  });
}

export function createTestCommerceStore() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("TEST_COMMERCE_STORE_FORBIDDEN_OUTSIDE_TEST");
  }

  let state = Object.freeze({
    productsBySku: new Map(),
    retailPrices: new Map(),
    inventoryLedger: Object.freeze([]),
    auditRecords: Object.freeze([]),
    commandOutcomes: new Map(),
    versionsByProductId: new Map(),
    ledgerSequence: 0,
    auditSequence: 0,
  });

  function requireProduct(sku) {
    const product = state.productsBySku.get(sku);
    if (!product) throw rejection(404, "PRODUCT_NOT_FOUND");
    return product;
  }

  function commitWithAudit(next, command, product, before, after) {
    const auditSequence = state.auditSequence + 1;
    const priorVersion = state.versionsByProductId.get(product.id) ?? 0;
    const resultVersion = priorVersion + 1;
    const occurredAt = new Date().toISOString();
    const versionsByProductId = new Map(next.versionsByProductId);
    versionsByProductId.set(product.id, resultVersion);
    const auditRecord = Object.freeze({
      id: `audit-${auditSequence}`,
      sequence: auditSequence,
      commandId: command.idempotencyKey,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
      occurredAt,
      action: command.type,
      actorId: command.actor.id,
      capability: command.capability,
      reason: command.reason,
      target: Object.freeze({ productId: product.id, sku: product.sku }),
      priorVersion,
      resultVersion,
      before,
      after,
      result: "COMMITTED",
    });

    const committed = Object.freeze({
      ...next,
      auditSequence,
      versionsByProductId,
      auditRecords: Object.freeze([...next.auditRecords, auditRecord]),
    });
    const result = Object.freeze({
      product: adminProjection(
        committed,
        committed.productsBySku.get(product.sku),
      ),
      auditRecord,
    });
    const outcomeKey = `${command.actor.id}:${command.idempotencyKey}`;
    const commandOutcomes = new Map(committed.commandOutcomes);
    commandOutcomes.set(
      outcomeKey,
      Object.freeze({
        fingerprint: commandFingerprint(command),
        result,
      }),
    );
    state = Object.freeze({ ...committed, commandOutcomes });

    return result;
  }

  return Object.freeze({
    async executeAdminCommand(command = {}) {
      const expectedCapability = EXPECTED_CAPABILITY[command.type];
      if (
        !expectedCapability ||
        command.capability !== expectedCapability ||
        !hasCapability(command.actor, expectedCapability)
      ) {
        throw rejection(403, "FORBIDDEN");
      }

      if (
        typeof command.idempotencyKey !== "string" ||
        command.idempotencyKey.length < 8 ||
        command.idempotencyKey.length > 128
      ) {
        throw rejection(400, "IDEMPOTENCY_KEY_REQUIRED");
      }
      if (
        typeof command.correlationId !== "string" ||
        command.correlationId.trim() === "" ||
        command.reason !== "ADMIN_SLICE_01"
      ) {
        throw rejection(400, "COMMAND_CONTEXT_REQUIRED");
      }

      const outcomeKey = `${command.actor.id}:${command.idempotencyKey}`;
      const existingOutcome = state.commandOutcomes.get(outcomeKey);
      if (existingOutcome) {
        if (existingOutcome.fingerprint !== commandFingerprint(command)) {
          throw rejection(409, "IDEMPOTENCY_KEY_REUSED");
        }
        return existingOutcome.result;
      }

      const payload = command.payload ?? {};

      if (command.type === "CreateProduct") {
        if (
          payload.name !== "SEC-IMPL TEST PRODUCT" ||
          payload.sku !== "TEST-SKU-001"
        ) {
          throw rejection(400, "SYNTHETIC_PRODUCT_REQUIRED");
        }
        if (state.productsBySku.has(payload.sku)) {
          throw rejection(409, "PRODUCT_ALREADY_EXISTS");
        }

        const product = Object.freeze({
          id: "product-test-001",
          variantId: "variant-test-001",
          skuId: "sku-test-001",
          name: payload.name,
          sku: payload.sku,
          publicationState: "UNPUBLISHED",
        });
        const productsBySku = new Map(state.productsBySku);
        productsBySku.set(product.sku, product);

        return commitWithAudit(
          Object.freeze({ ...state, productsBySku }),
          command,
          product,
          null,
          Object.freeze({ publicationState: "UNPUBLISHED" }),
        );
      }

      const product = requireProduct(payload.sku);

      if (command.type === "SetRetailPrice") {
        if (
          payload.amountCents !== 1999 ||
          !Number.isSafeInteger(payload.amountCents) ||
          payload.currency !== "USD"
        ) {
          throw rejection(400, "INVALID_RETAIL_PRICE");
        }

        const retailPrices = new Map(state.retailPrices);
        const previous = retailPrices.get(product.variantId) ?? null;
        const price = Object.freeze({
          amountCents: payload.amountCents,
          currency: payload.currency,
        });
        retailPrices.set(product.variantId, price);

        return commitWithAudit(
          Object.freeze({ ...state, retailPrices }),
          command,
          product,
          previous,
          price,
        );
      }

      if (command.type === "ReceiveInventory") {
        if (
          payload.quantityDelta !== 10 ||
          !Number.isSafeInteger(payload.quantityDelta) ||
          payload.disposition !== "SELLABLE"
        ) {
          throw rejection(400, "INVALID_RECEIPT_QUANTITY");
        }

        const ledgerSequence = state.ledgerSequence + 1;
        const ledgerEntry = Object.freeze({
          id: `ledger-${ledgerSequence}`,
          sequence: ledgerSequence,
          productId: product.id,
          sku: product.sku,
          eventType: "RECEIPT",
          quantityDelta: payload.quantityDelta,
          disposition: payload.disposition,
          actorId: command.actor.id,
          occurredAt: new Date().toISOString(),
        });

        return commitWithAudit(
          Object.freeze({
            ...state,
            ledgerSequence,
            inventoryLedger: Object.freeze([
              ...state.inventoryLedger,
              ledgerEntry,
            ]),
          }),
          command,
          product,
          Object.freeze({ availableQuantity: availableQuantity(state, product.id) }),
          Object.freeze({
            availableQuantity:
              availableQuantity(state, product.id) + payload.quantityDelta,
            ledgerEntryId: ledgerEntry.id,
          }),
        );
      }

      const productsBySku = new Map(state.productsBySku);
      if (command.type === "PublishProduct") {
        if (!state.retailPrices.has(product.variantId)) {
          throw rejection(409, "RETAIL_PRICE_REQUIRED");
        }
        if (availableQuantity(state, product.id) < 1) {
          throw rejection(409, "AVAILABLE_INVENTORY_REQUIRED");
        }
        const published = Object.freeze({
          ...product,
          publicationState: "PUBLISHED",
        });
        productsBySku.set(product.sku, published);
        return commitWithAudit(
          Object.freeze({ ...state, productsBySku }),
          command,
          published,
          Object.freeze({ publicationState: product.publicationState }),
          Object.freeze({ publicationState: "PUBLISHED" }),
        );
      }

      if (command.type === "UnpublishProduct") {
        const unpublished = Object.freeze({
          ...product,
          publicationState: "UNPUBLISHED",
        });
        productsBySku.set(product.sku, unpublished);
        return commitWithAudit(
          Object.freeze({ ...state, productsBySku }),
          command,
          unpublished,
          Object.freeze({ publicationState: product.publicationState }),
          Object.freeze({ publicationState: "UNPUBLISHED" }),
        );
      }

      throw rejection(400, "UNKNOWN_COMMAND");
    },

    async readAdminProduct({ sku } = {}) {
      const product = state.productsBySku.get(sku);
      return product ? adminProjection(state, product) : null;
    },

    async readPublishedProducts() {
      return Object.freeze(
        [...state.productsBySku.values()]
          .filter((product) => product.publicationState === "PUBLISHED")
          .map((product) => {
            const price = state.retailPrices.get(product.variantId);
            return Object.freeze({
              id: product.id,
              name: product.name,
              sku: product.sku,
              retailPrice: price,
              availableQuantity: availableQuantity(state, product.id),
            });
          }),
      );
    },

    async readAuditRecords() {
      return Object.freeze([...state.auditRecords]);
    },
  });
}

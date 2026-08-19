if (process.env.NODE_ENV !== "test") {
  throw new Error("TEST_COMMERCE_STORE_FORBIDDEN_OUTSIDE_TEST");
}

const EXPECTED_CAPABILITY = Object.freeze({
  CreateProduct: "catalog.edit",
  UpdateProduct: "catalog.edit",
  ArchiveProduct: "catalog.edit",
  CreateSku: "catalog.edit",
  UpdateSku: "catalog.edit",
  ArchiveSku: "catalog.edit",
  SetRetailPrice: "price.retail.edit",
  CreateSupplier: "supplier.manage",
  UpdateSupplier: "supplier.manage",
  ReceiveInventory: "inventory.receive",
  AdjustInventory: "inventory.adjust",
  AttachProductImage: "media.manage",
  ReplaceProductImage: "media.manage",
  RemoveProductImage: "media.manage",
  AttachEvidence: "evidence.manage",
  CreateReservation: "reservation.manage",
  CommitReservation: "reservation.manage",
  ReleaseReservation: "reservation.manage",
  PublishProduct: "catalog.publish",
  UnpublishProduct: "catalog.unpublish",
});

const TEST_OWNER_CAPABILITIES = Object.freeze([
  "catalog.read",
  "audit.read",
  "catalog.edit",
  "supplier.manage",
  "price.retail.edit",
  "inventory.receive",
  "inventory.adjust",
  "media.manage",
  "evidence.manage",
  "reservation.manage",
  "catalog.publish",
  "catalog.unpublish",
]);

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

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function commandFingerprint(command) {
  return JSON.stringify(
    canonicalize({ type: command.type, payload: command.payload }),
  );
}

function frozenArray(values) {
  return Object.freeze([...values]);
}

function frozenRecord(value) {
  return Object.freeze({ ...value });
}

function nonemptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function positiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}

function integerCents(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function safeAdd(left, right) {
  const value = left + right;
  if (!Number.isSafeInteger(value)) throw rejection(400, "INTEGER_RANGE_EXCEEDED");
  return value;
}

function safeMultiply(left, right) {
  const value = left * right;
  if (!Number.isSafeInteger(value)) throw rejection(400, "INTEGER_RANGE_EXCEEDED");
  return value;
}

function nextSequence(state, name) {
  const value = (state.sequences[name] ?? 0) + 1;
  return Object.freeze({
    value,
    sequences: Object.freeze({ ...state.sequences, [name]: value }),
  });
}

function skuRecordFor(state, sku) {
  return state.skusByCode.get(sku) ?? null;
}

function requireSku(state, sku) {
  const skuRecord = skuRecordFor(state, sku);
  if (!skuRecord || skuRecord.lifecycleState === "ARCHIVED") {
    throw rejection(404, "SKU_NOT_FOUND");
  }
  return skuRecord;
}

function productFor(state, { productId, sku } = {}) {
  if (nonemptyString(productId)) return state.productsById.get(productId) ?? null;
  if (nonemptyString(sku)) {
    const skuRecord = state.skusByCode.get(sku);
    return skuRecord ? state.productsById.get(skuRecord.productId) ?? null : null;
  }
  return null;
}

function requireProduct(state, selector) {
  const product = productFor(state, selector);
  if (!product || product.lifecycleState === "ARCHIVED") {
    throw rejection(404, "PRODUCT_NOT_FOUND");
  }
  return product;
}

function productSkus(state, productId, { includeArchived = false } = {}) {
  return [...state.skusById.values()].filter(
    (skuRecord) =>
      skuRecord.productId === productId &&
      (includeArchived || skuRecord.lifecycleState !== "ARCHIVED"),
  );
}

function productVariants(state, productId, { includeArchived = false } = {}) {
  return [...state.variantsById.values()].filter(
    (variant) =>
      variant.productId === productId &&
      (includeArchived || variant.lifecycleState !== "ARCHIVED"),
  );
}

function inventoryForSku(state, skuId) {
  return state.inventoryLedger.filter((entry) => entry.skuId === skuId);
}

function currentQuantityForSku(state, skuId) {
  return inventoryForSku(state, skuId).reduce(
    (total, entry) =>
      entry.disposition === "SELLABLE" ? safeAdd(total, entry.quantityDelta) : total,
    0,
  );
}

function reservedQuantityForSku(state, skuId) {
  return inventoryForSku(state, skuId).reduce(
    (total, entry) => safeAdd(total, entry.reservedDelta),
    0,
  );
}

function availableQuantityForSku(state, skuId) {
  return safeAdd(currentQuantityForSku(state, skuId), -reservedQuantityForSku(state, skuId));
}

function inventoryForProduct(state, productId) {
  const skuIds = new Set(productSkus(state, productId, { includeArchived: true }).map((sku) => sku.id));
  return state.inventoryLedger.filter((entry) => skuIds.has(entry.skuId));
}

function productQuantity(state, productId, field) {
  return productSkus(state, productId, { includeArchived: true }).reduce(
    (total, skuRecord) => safeAdd(total, field(state, skuRecord.id)),
    0,
  );
}

function publicMediaProjection(media) {
  return Object.freeze({
    id: media.id,
    filename: media.filename,
    contentType: media.contentType,
    byteLength: media.byteLength,
    checksum: media.checksum,
    url: `/api/media/${encodeURIComponent(media.id)}`,
  });
}

function adminMediaProjection(media) {
  return Object.freeze({
    ...media,
    url: `/api/media/${encodeURIComponent(media.id)}`,
  });
}

function productMedia(state, productId, { activeOnly = true } = {}) {
  const ids = state.productMediaByProductId.get(productId) ?? [];
  return ids
    .map((id) => state.mediaById.get(id))
    .filter(Boolean)
    .filter((media) => !activeOnly || media.lifecycleState === "ACTIVE");
}

function evidenceForProduct(state, productId) {
  const lotIds = new Set(
    [...state.lotsById.values()]
      .filter((lot) => lot.productId === productId)
      .map((lot) => lot.id),
  );
  return [...state.evidenceById.values()].filter(
    (evidence) => evidence.productId === productId || lotIds.has(evidence.lotId),
  );
}

function cogsForSku(state, skuId) {
  return state.cogsRecords
    .filter((record) => record.skuId === skuId)
    .reduce((total, record) => safeAdd(total, record.amountCents), 0);
}

function inventoryValueForSku(state, skuId) {
  return (state.costLayersBySkuId.get(skuId) ?? []).reduce(
    (total, layer) =>
      safeAdd(total, safeMultiply(layer.remainingQuantity, layer.unitCostCents)),
    0,
  );
}

function skuAdminProjection(state, skuRecord) {
  const variant = state.variantsById.get(skuRecord.variantId) ?? null;
  return Object.freeze({
    id: skuRecord.id,
    sku: skuRecord.sku,
    productId: skuRecord.productId,
    variantId: skuRecord.variantId,
    variantName: variant?.name ?? "Default",
    attributes: variant?.attributes ?? Object.freeze({}),
    lifecycleState: skuRecord.lifecycleState,
    retailPrice: state.retailPricesBySkuId.get(skuRecord.id) ?? null,
    currentQuantity: currentQuantityForSku(state, skuRecord.id),
    reservedQuantity: reservedQuantityForSku(state, skuRecord.id),
    availableQuantity: availableQuantityForSku(state, skuRecord.id),
    cogsAmountCents: cogsForSku(state, skuRecord.id),
    inventoryHistory: frozenArray(inventoryForSku(state, skuRecord.id)),
  });
}

function adminProjection(state, product) {
  const skus = productSkus(state, product.id, { includeArchived: true });
  const legacySku = skus.length === 1 ? skus[0] : null;
  const price = legacySku
    ? state.retailPricesBySkuId.get(legacySku.id) ?? null
    : null;
  const version = state.versionsByTarget.get(`product:${product.id}`) ?? 0;

  return Object.freeze({
    id: product.id,
    variantId: legacySku?.variantId ?? null,
    skuId: legacySku?.id ?? null,
    name: product.name,
    description: product.description,
    division: product.division,
    sku: legacySku?.sku ?? null,
    status: product.lifecycleState,
    lifecycleState: product.lifecycleState,
    publicationState: product.publicationState,
    version,
    retailPrice: price,
    currentQuantity: productQuantity(state, product.id, currentQuantityForSku),
    reservedQuantity: productQuantity(state, product.id, reservedQuantityForSku),
    availableQuantity: productQuantity(state, product.id, availableQuantityForSku),
    inventoryHistory: frozenArray(inventoryForProduct(state, product.id)),
    variants: frozenArray(
      productVariants(state, product.id, { includeArchived: true }).map((variant) =>
        Object.freeze({
          ...variant,
          skus: frozenArray(
            skus
              .filter((skuRecord) => skuRecord.variantId === variant.id)
              .map((skuRecord) => skuAdminProjection(state, skuRecord)),
          ),
        }),
      ),
    ),
    skus: frozenArray(skus.map((skuRecord) => skuAdminProjection(state, skuRecord))),
    images: frozenArray(productMedia(state, product.id).map(publicMediaProjection)),
    media: frozenArray(productMedia(state, product.id).map(publicMediaProjection)),
    evidence: frozenArray(
      evidenceForProduct(state, product.id).map((record) =>
        Object.freeze({
          ...record,
          media: publicMediaProjection(state.mediaById.get(record.mediaId)),
        }),
      ),
    ),
    lots: frozenArray(
      [...state.lotsById.values()].filter((lot) => lot.productId === product.id),
    ),
    cogsAmountCents: skus.reduce(
      (total, skuRecord) => safeAdd(total, cogsForSku(state, skuRecord.id)),
      0,
    ),
    cogs: Object.freeze({
      amountCents: skus.reduce(
        (total, skuRecord) => safeAdd(total, cogsForSku(state, skuRecord.id)),
        0,
      ),
    }),
    inventoryValueCents: skus.reduce(
      (total, skuRecord) => safeAdd(total, inventoryValueForSku(state, skuRecord.id)),
      0,
    ),
  });
}

function publicProjection(state, product) {
  const skus = productSkus(state, product.id).filter(
    (skuRecord) => skuRecord.lifecycleState === "ACTIVE",
  );

  if (product.legacyProjection === true && skus.length === 1) {
    const skuRecord = skus[0];
    return Object.freeze({
      id: product.id,
      name: product.name,
      sku: skuRecord.sku,
      retailPrice: state.retailPricesBySkuId.get(skuRecord.id) ?? null,
      availableQuantity: availableQuantityForSku(state, skuRecord.id),
      images: frozenArray(productMedia(state, product.id).map(publicMediaProjection)),
    });
  }

  const variants = productVariants(state, product.id)
    .map((variant) => {
      const variantSkus = skus.filter((skuRecord) => skuRecord.variantId === variant.id);
      if (variantSkus.length === 0) return null;
      return Object.freeze({
        id: variant.id,
        name: variant.name,
        attributes: variant.attributes,
        skus: frozenArray(
          variantSkus.map((skuRecord) =>
            Object.freeze({
              id: skuRecord.id,
              sku: skuRecord.sku,
              retailPrice: state.retailPricesBySkuId.get(skuRecord.id) ?? null,
              availableQuantity: availableQuantityForSku(state, skuRecord.id),
            }),
          ),
        ),
      });
    })
    .filter(Boolean);

  return Object.freeze({
    id: product.id,
    name: product.name,
    description: product.description,
    division: product.division,
    publicationState: product.publicationState,
    variants: frozenArray(variants),
    images: frozenArray(productMedia(state, product.id).map(publicMediaProjection)),
  });
}

function targetKey(target) {
  if (target.productId) return `product:${target.productId}`;
  if (target.supplierId) return `supplier:${target.supplierId}`;
  if (target.reservationId) return `reservation:${target.reservationId}`;
  if (target.evidenceId) return `evidence:${target.evidenceId}`;
  if (target.mediaId) return `media:${target.mediaId}`;
  return "commerce:root";
}

function resultProjection(state, target) {
  const product = target.productId ? state.productsById.get(target.productId) : null;
  const supplier = target.supplierId
    ? state.suppliersById.get(target.supplierId) ?? null
    : null;
  const reservation = target.reservationId
    ? state.reservationsById.get(target.reservationId) ?? null
    : null;
  const media = target.mediaId ? state.mediaById.get(target.mediaId) ?? null : null;
  const evidence = target.evidenceId
    ? state.evidenceById.get(target.evidenceId) ?? null
    : null;

  return Object.freeze({
    ...(product ? { product: adminProjection(state, product) } : {}),
    ...(supplier ? { supplier: Object.freeze({ ...supplier }) } : {}),
    ...(reservation ? { reservation: Object.freeze({ ...reservation }) } : {}),
    ...(media ? { media: publicMediaProjection(media) } : {}),
    ...(evidence ? { evidence: Object.freeze({ ...evidence }) } : {}),
  });
}

function immutableLedgerEntry(state, command, skuRecord, values) {
  const sequence = nextSequence(state, "ledger");
  return Object.freeze({
    sequences: sequence.sequences,
    entry: Object.freeze({
      id: `ledger-${sequence.value}`,
      sequence: sequence.value,
      productId: skuRecord.productId,
      variantId: skuRecord.variantId,
      skuId: skuRecord.id,
      sku: skuRecord.sku,
      quantityDelta: 0,
      reservedDelta: 0,
      disposition: "SELLABLE",
      actorId: command.actor.id,
      commandId: command.idempotencyKey,
      occurredAt: new Date().toISOString(),
      ...values,
    }),
  });
}

function consumeCostLayers(state, skuId, quantity) {
  let remaining = quantity;
  let amountCents = 0;
  const sourceLayers = state.costLayersBySkuId.get(skuId) ?? [];
  const layers = sourceLayers.map((layer) => ({ ...layer }));

  for (const layer of layers) {
    if (remaining === 0) break;
    const consumed = Math.min(layer.remainingQuantity, remaining);
    layer.remainingQuantity -= consumed;
    remaining -= consumed;
    amountCents = safeAdd(
      amountCents,
      safeMultiply(consumed, layer.unitCostCents),
    );
  }

  if (remaining !== 0) throw rejection(409, "COST_LAYER_QUANTITY_UNAVAILABLE");

  return Object.freeze({
    amountCents,
    layers: frozenArray(layers.map((layer) => Object.freeze(layer))),
  });
}

export function createTestCommerceStore() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("TEST_COMMERCE_STORE_FORBIDDEN_OUTSIDE_TEST");
  }

  let state = Object.freeze({
    productsById: new Map(),
    variantsById: new Map(),
    skusById: new Map(),
    skusByCode: new Map(),
    retailPricesBySkuId: new Map(),
    suppliersById: new Map(),
    supplierIdByCode: new Map(),
    lotsById: new Map(),
    inventoryLedger: frozenArray([]),
    costLayersBySkuId: new Map(),
    cogsRecords: frozenArray([]),
    mediaById: new Map(),
    productMediaByProductId: new Map(),
    evidenceById: new Map(),
    reservationsById: new Map(),
    auditRecords: frozenArray([]),
    commandOutcomes: new Map(),
    versionsByTarget: new Map(),
    sessionsById: new Map(),
    sequences: Object.freeze({}),
  });

  function commitWithAudit(next, command, target, before, after) {
    const auditSequence = nextSequence(next, "audit");
    const key = targetKey(target);
    const priorVersion = next.versionsByTarget.get(key) ?? 0;
    const resultVersion = priorVersion + 1;
    const versionsByTarget = new Map(next.versionsByTarget);
    versionsByTarget.set(key, resultVersion);
    const auditRecord = Object.freeze({
      id: `audit-${auditSequence.value}`,
      sequence: auditSequence.value,
      commandId: command.idempotencyKey,
      idempotencyKey: command.idempotencyKey,
      correlationId: command.correlationId,
      occurredAt: new Date().toISOString(),
      action: command.type,
      actorId: command.actor.id,
      capability: command.capability,
      reason: command.reason,
      target: Object.freeze({ ...target }),
      priorVersion,
      resultVersion,
      before,
      after,
      result: "COMMITTED",
    });
    const committed = Object.freeze({
      ...next,
      sequences: auditSequence.sequences,
      versionsByTarget,
      auditRecords: frozenArray([...next.auditRecords, auditRecord]),
    });
    const result = Object.freeze({
      ...resultProjection(committed, target),
      auditRecord,
    });
    const outcomeKey = `${command.actor.id}:${command.idempotencyKey}`;
    const commandOutcomes = new Map(committed.commandOutcomes);
    commandOutcomes.set(
      outcomeKey,
      Object.freeze({ fingerprint: commandFingerprint(command), result }),
    );
    state = Object.freeze({ ...committed, commandOutcomes });
    return result;
  }

  async function executeAdminCommand(command = {}) {
    const expectedCapability = EXPECTED_CAPABILITY[command.type];
    if (
      !expectedCapability ||
      command.capability !== expectedCapability ||
      !hasCapability(command.actor, expectedCapability)
    ) {
      throw rejection(403, "FORBIDDEN");
    }
    if (
      !nonemptyString(command.idempotencyKey) ||
      command.idempotencyKey.length < 8 ||
      command.idempotencyKey.length > 128
    ) {
      throw rejection(400, "IDEMPOTENCY_KEY_REQUIRED");
    }
    if (!nonemptyString(command.correlationId) || !nonemptyString(command.reason)) {
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
      if (!nonemptyString(payload.name)) throw rejection(400, "INVALID_PRODUCT");
      if (payload.sku !== undefined && !nonemptyString(payload.sku)) {
        throw rejection(400, "INVALID_SKU");
      }
      if (payload.sku && state.skusByCode.has(payload.sku)) {
        throw rejection(409, "SKU_ALREADY_EXISTS");
      }
      const productSequence = nextSequence(state, "product");
      const legacySynthetic =
        payload.name === "SEC-IMPL TEST PRODUCT" &&
        payload.sku === "TEST-SKU-001" &&
        payload.productId === undefined &&
        payload.description === undefined &&
        payload.division === undefined;
      const productId =
        payload.productId ??
        (legacySynthetic ? "product-test-001" : `product-${productSequence.value}`);
      if (state.productsById.has(productId)) {
        throw rejection(409, "PRODUCT_ALREADY_EXISTS");
      }
      const product = Object.freeze({
        id: productId,
        name: payload.name.trim(),
        description: nonemptyString(payload.description) ? payload.description.trim() : "",
        division: nonemptyString(payload.division) ? payload.division.trim() : "UNASSIGNED",
        lifecycleState: "ACTIVE",
        publicationState: "UNPUBLISHED",
        legacyProjection: legacySynthetic,
      });
      const productsById = new Map(state.productsById);
      productsById.set(product.id, product);
      let next = Object.freeze({
        ...state,
        sequences: productSequence.sequences,
        productsById,
      });

      if (payload.sku) {
        const variantSequence = nextSequence(next, "variant");
        const skuSequence = nextSequence(
          Object.freeze({ ...next, sequences: variantSequence.sequences }),
          "sku",
        );
        const variant = Object.freeze({
          id: legacySynthetic ? "variant-test-001" : `variant-${variantSequence.value}`,
          productId: product.id,
          name: "Default",
          attributes: Object.freeze({}),
          lifecycleState: "ACTIVE",
        });
        const skuRecord = Object.freeze({
          id: legacySynthetic ? "sku-test-001" : `sku-${skuSequence.value}`,
          productId: product.id,
          variantId: variant.id,
          sku: payload.sku.trim(),
          lifecycleState: "ACTIVE",
        });
        const variantsById = new Map(next.variantsById);
        variantsById.set(variant.id, variant);
        const skusById = new Map(next.skusById);
        const skusByCode = new Map(next.skusByCode);
        skusById.set(skuRecord.id, skuRecord);
        skusByCode.set(skuRecord.sku, skuRecord);
        next = Object.freeze({
          ...next,
          sequences: skuSequence.sequences,
          variantsById,
          skusById,
          skusByCode,
        });
      }

      return commitWithAudit(
        next,
        command,
        Object.freeze({ productId: product.id, ...(payload.sku ? { sku: payload.sku } : {}) }),
        null,
        Object.freeze({ lifecycleState: "ACTIVE", publicationState: "UNPUBLISHED" }),
      );
    }

    if (command.type === "UpdateProduct") {
      const product = requireProduct(state, payload);
      if (payload.name !== undefined && !nonemptyString(payload.name)) {
        throw rejection(400, "INVALID_PRODUCT");
      }
      const updated = Object.freeze({
        ...product,
        ...(payload.name !== undefined ? { name: payload.name.trim() } : {}),
        ...(payload.description !== undefined
          ? { description: String(payload.description) }
          : {}),
        ...(payload.division !== undefined && nonemptyString(payload.division)
          ? { division: payload.division.trim() }
          : {}),
      });
      const productsById = new Map(state.productsById);
      productsById.set(product.id, updated);
      return commitWithAudit(
        Object.freeze({ ...state, productsById }),
        command,
        Object.freeze({ productId: product.id }),
        product,
        updated,
      );
    }

    if (command.type === "ArchiveProduct") {
      const product = requireProduct(state, payload);
      const archived = Object.freeze({
        ...product,
        lifecycleState: "ARCHIVED",
        publicationState: "UNPUBLISHED",
      });
      const productsById = new Map(state.productsById);
      productsById.set(product.id, archived);
      return commitWithAudit(
        Object.freeze({ ...state, productsById }),
        command,
        Object.freeze({ productId: product.id }),
        Object.freeze({ lifecycleState: product.lifecycleState }),
        Object.freeze({ lifecycleState: "ARCHIVED" }),
      );
    }

    if (command.type === "CreateSku") {
      const product = requireProduct(state, payload);
      if (!nonemptyString(payload.sku)) throw rejection(400, "INVALID_SKU");
      if (state.skusByCode.has(payload.sku)) throw rejection(409, "SKU_ALREADY_EXISTS");
      const variantSequence = nextSequence(state, "variant");
      const variantId = payload.variantId ?? `variant-${variantSequence.value}`;
      const existingVariant = state.variantsById.get(variantId);
      if (existingVariant && existingVariant.productId !== product.id) {
        throw rejection(409, "VARIANT_PRODUCT_MISMATCH");
      }
      const withVariantSequence = Object.freeze({ ...state, sequences: variantSequence.sequences });
      const skuSequence = nextSequence(withVariantSequence, "sku");
      const skuId = payload.skuId ?? `sku-${skuSequence.value}`;
      if (state.skusById.has(skuId)) throw rejection(409, "SKU_ALREADY_EXISTS");
      const attributes =
        payload.attributes && typeof payload.attributes === "object" && !Array.isArray(payload.attributes)
          ? Object.freeze({ ...payload.attributes })
          : Object.freeze({});
      const variant =
        existingVariant ??
        Object.freeze({
          id: variantId,
          productId: product.id,
          name: nonemptyString(payload.variantName) ? payload.variantName.trim() : "Default",
          attributes,
          lifecycleState: "ACTIVE",
        });
      const skuRecord = Object.freeze({
        id: skuId,
        productId: product.id,
        variantId: variant.id,
        sku: payload.sku.trim(),
        lifecycleState: "ACTIVE",
      });
      const variantsById = new Map(state.variantsById);
      const skusById = new Map(state.skusById);
      const skusByCode = new Map(state.skusByCode);
      variantsById.set(variant.id, variant);
      skusById.set(skuRecord.id, skuRecord);
      skusByCode.set(skuRecord.sku, skuRecord);
      return commitWithAudit(
        Object.freeze({
          ...state,
          sequences: skuSequence.sequences,
          variantsById,
          skusById,
          skusByCode,
        }),
        command,
        Object.freeze({ productId: product.id, sku: skuRecord.sku }),
        null,
        Object.freeze({ skuId: skuRecord.id, variantId: variant.id }),
      );
    }

    if (command.type === "UpdateSku") {
      const skuRecord = requireSku(state, payload.sku);
      const variant = state.variantsById.get(skuRecord.variantId);
      if (payload.newSku !== undefined && !nonemptyString(payload.newSku)) {
        throw rejection(400, "INVALID_SKU");
      }
      if (
        payload.newSku &&
        payload.newSku !== skuRecord.sku &&
        state.skusByCode.has(payload.newSku)
      ) {
        throw rejection(409, "SKU_ALREADY_EXISTS");
      }
      const updatedVariant = Object.freeze({
        ...variant,
        ...(payload.variantName !== undefined && nonemptyString(payload.variantName)
          ? { name: payload.variantName.trim() }
          : {}),
        ...(payload.attributes && typeof payload.attributes === "object" && !Array.isArray(payload.attributes)
          ? { attributes: Object.freeze({ ...payload.attributes }) }
          : {}),
      });
      const updatedSku = Object.freeze({
        ...skuRecord,
        ...(payload.newSku ? { sku: payload.newSku.trim() } : {}),
      });
      const variantsById = new Map(state.variantsById);
      const skusById = new Map(state.skusById);
      const skusByCode = new Map(state.skusByCode);
      variantsById.set(updatedVariant.id, updatedVariant);
      skusById.set(updatedSku.id, updatedSku);
      skusByCode.delete(skuRecord.sku);
      skusByCode.set(updatedSku.sku, updatedSku);
      return commitWithAudit(
        Object.freeze({ ...state, variantsById, skusById, skusByCode }),
        command,
        Object.freeze({ productId: skuRecord.productId, sku: updatedSku.sku }),
        Object.freeze({ sku: skuRecord.sku, variant }),
        Object.freeze({ sku: updatedSku.sku, variant: updatedVariant }),
      );
    }

    if (command.type === "ArchiveSku") {
      const skuRecord = requireSku(state, payload.sku);
      if (reservedQuantityForSku(state, skuRecord.id) > 0) {
        throw rejection(409, "ACTIVE_RESERVATION_EXISTS");
      }
      const archived = Object.freeze({ ...skuRecord, lifecycleState: "ARCHIVED" });
      const variant = state.variantsById.get(skuRecord.variantId);
      const archivedVariant = Object.freeze({ ...variant, lifecycleState: "ARCHIVED" });
      const skusById = new Map(state.skusById);
      const skusByCode = new Map(state.skusByCode);
      const variantsById = new Map(state.variantsById);
      skusById.set(archived.id, archived);
      skusByCode.set(archived.sku, archived);
      variantsById.set(archivedVariant.id, archivedVariant);
      return commitWithAudit(
        Object.freeze({ ...state, skusById, skusByCode, variantsById }),
        command,
        Object.freeze({ productId: skuRecord.productId, sku: skuRecord.sku }),
        Object.freeze({ lifecycleState: "ACTIVE" }),
        Object.freeze({ lifecycleState: "ARCHIVED" }),
      );
    }

    if (command.type === "SetRetailPrice") {
      const skuRecord = requireSku(state, payload.sku);
      if (!integerCents(payload.amountCents) || payload.currency !== "USD") {
        throw rejection(400, "INVALID_RETAIL_PRICE");
      }
      const previous = state.retailPricesBySkuId.get(skuRecord.id) ?? null;
      const price = Object.freeze({ amountCents: payload.amountCents, currency: "USD" });
      const retailPricesBySkuId = new Map(state.retailPricesBySkuId);
      retailPricesBySkuId.set(skuRecord.id, price);
      return commitWithAudit(
        Object.freeze({ ...state, retailPricesBySkuId }),
        command,
        Object.freeze({ productId: skuRecord.productId, sku: skuRecord.sku }),
        previous,
        price,
      );
    }

    if (command.type === "CreateSupplier") {
      if (!nonemptyString(payload.name) || !nonemptyString(payload.code)) {
        throw rejection(400, "INVALID_SUPPLIER");
      }
      if (state.supplierIdByCode.has(payload.code)) {
        throw rejection(409, "SUPPLIER_ALREADY_EXISTS");
      }
      const sequence = nextSequence(state, "supplier");
      const supplier = Object.freeze({
        id: payload.supplierId ?? `supplier-${sequence.value}`,
        name: payload.name.trim(),
        code: payload.code.trim(),
        lifecycleState: "ACTIVE",
      });
      if (state.suppliersById.has(supplier.id)) {
        throw rejection(409, "SUPPLIER_ALREADY_EXISTS");
      }
      const suppliersById = new Map(state.suppliersById);
      const supplierIdByCode = new Map(state.supplierIdByCode);
      suppliersById.set(supplier.id, supplier);
      supplierIdByCode.set(supplier.code, supplier.id);
      return commitWithAudit(
        Object.freeze({
          ...state,
          sequences: sequence.sequences,
          suppliersById,
          supplierIdByCode,
        }),
        command,
        Object.freeze({ supplierId: supplier.id }),
        null,
        supplier,
      );
    }

    if (command.type === "UpdateSupplier") {
      const supplier = state.suppliersById.get(payload.supplierId);
      if (!supplier) throw rejection(404, "SUPPLIER_NOT_FOUND");
      if (payload.name !== undefined && !nonemptyString(payload.name)) {
        throw rejection(400, "INVALID_SUPPLIER");
      }
      if (payload.code !== undefined && !nonemptyString(payload.code)) {
        throw rejection(400, "INVALID_SUPPLIER");
      }
      if (
        payload.code &&
        payload.code !== supplier.code &&
        state.supplierIdByCode.has(payload.code)
      ) {
        throw rejection(409, "SUPPLIER_ALREADY_EXISTS");
      }
      const updated = Object.freeze({
        ...supplier,
        ...(payload.name ? { name: payload.name.trim() } : {}),
        ...(payload.code ? { code: payload.code.trim() } : {}),
      });
      const suppliersById = new Map(state.suppliersById);
      const supplierIdByCode = new Map(state.supplierIdByCode);
      suppliersById.set(updated.id, updated);
      supplierIdByCode.delete(supplier.code);
      supplierIdByCode.set(updated.code, updated.id);
      return commitWithAudit(
        Object.freeze({ ...state, suppliersById, supplierIdByCode }),
        command,
        Object.freeze({ supplierId: supplier.id }),
        supplier,
        updated,
      );
    }

    if (command.type === "ReceiveInventory") {
      const skuRecord = requireSku(state, payload.sku);
      const supplier = state.suppliersById.get(payload.supplierId);
      const legacyReceipt =
        payload.supplierId === undefined &&
        payload.unitCostCents === undefined &&
        payload.currency === undefined;
      if (payload.supplierId && !supplier) throw rejection(404, "SUPPLIER_NOT_FOUND");
      const disposition = payload.disposition ?? "SELLABLE";
      if (!positiveInteger(payload.quantityDelta) || disposition !== "SELLABLE") {
        throw rejection(400, "INVALID_RECEIPT_QUANTITY");
      }
      const unitCostCents = legacyReceipt && payload.unitCostCents === undefined
        ? 0
        : payload.unitCostCents;
      const currency = legacyReceipt && payload.currency === undefined ? "USD" : payload.currency;
      if (!integerCents(unitCostCents) || currency !== "USD") {
        throw rejection(400, "INVALID_RECEIVING_COST");
      }
      const lotSequence = nextSequence(state, "lot");
      const lotId = payload.lotId ?? `lot-${lotSequence.value}`;
      if (state.lotsById.has(lotId)) throw rejection(409, "LOT_ALREADY_EXISTS");
      const lot = Object.freeze({
        id: lotId,
        lotCode: nonemptyString(payload.lotCode) ? payload.lotCode.trim() : lotId,
        productId: skuRecord.productId,
        skuId: skuRecord.id,
        sku: skuRecord.sku,
        supplierId: supplier?.id ?? null,
        receivedQuantity: payload.quantityDelta,
        unitCostCents,
        currency,
      });
      const withLotSequence = Object.freeze({ ...state, sequences: lotSequence.sequences });
      const ledger = immutableLedgerEntry(withLotSequence, command, skuRecord, {
        eventType: "RECEIPT",
        quantityDelta: payload.quantityDelta,
        reservedDelta: 0,
        disposition,
        lotId,
        supplierId: supplier?.id ?? null,
        unitCostCents,
        currency,
      });
      const lotsById = new Map(state.lotsById);
      lotsById.set(lot.id, lot);
      const layers = state.costLayersBySkuId.get(skuRecord.id) ?? [];
      const costLayer = Object.freeze({
        id: `cost-layer-${lot.id}`,
        lotId: lot.id,
        receivedQuantity: payload.quantityDelta,
        remainingQuantity: payload.quantityDelta,
        unitCostCents,
        currency,
      });
      const costLayersBySkuId = new Map(state.costLayersBySkuId);
      costLayersBySkuId.set(skuRecord.id, frozenArray([...layers, costLayer]));
      const next = Object.freeze({
        ...state,
        sequences: ledger.sequences,
        lotsById,
        costLayersBySkuId,
        inventoryLedger: frozenArray([...state.inventoryLedger, ledger.entry]),
      });
      return commitWithAudit(
        next,
        command,
        Object.freeze({ productId: skuRecord.productId, sku: skuRecord.sku, lotId }),
        Object.freeze({ availableQuantity: availableQuantityForSku(state, skuRecord.id) }),
        Object.freeze({
          availableQuantity: availableQuantityForSku(state, skuRecord.id) + payload.quantityDelta,
          ledgerEntryId: ledger.entry.id,
          unitCostCents,
        }),
      );
    }

    if (command.type === "AdjustInventory") {
      const skuRecord = requireSku(state, payload.sku);
      if (!Number.isSafeInteger(payload.quantityDelta) || payload.quantityDelta === 0) {
        throw rejection(400, "INVALID_ADJUSTMENT_QUANTITY");
      }
      if (!nonemptyString(payload.reason)) throw rejection(400, "ADJUSTMENT_REASON_REQUIRED");
      const resultingQuantity = currentQuantityForSku(state, skuRecord.id) + payload.quantityDelta;
      const resultingAvailable = availableQuantityForSku(state, skuRecord.id) + payload.quantityDelta;
      if (resultingQuantity < 0 || resultingAvailable < 0) {
        throw rejection(409, "INSUFFICIENT_AVAILABLE_INVENTORY");
      }
      let costLayersBySkuId = new Map(state.costLayersBySkuId);
      if (payload.quantityDelta > 0) {
        const unitCostCents = payload.unitCostCents ?? 0;
        const currency = payload.currency ?? "USD";
        if (!integerCents(unitCostCents) || currency !== "USD") {
          throw rejection(400, "INVALID_ADJUSTMENT_COST");
        }
        costLayersBySkuId.set(
          skuRecord.id,
          frozenArray([
            ...(state.costLayersBySkuId.get(skuRecord.id) ?? []),
            Object.freeze({
              id: `cost-layer-adjustment-${command.idempotencyKey}`,
              lotId: null,
              receivedQuantity: payload.quantityDelta,
              remainingQuantity: payload.quantityDelta,
              unitCostCents,
              currency: "USD",
            }),
          ]),
        );
      } else {
        const consumed = consumeCostLayers(state, skuRecord.id, Math.abs(payload.quantityDelta));
        costLayersBySkuId.set(skuRecord.id, consumed.layers);
      }
      const ledger = immutableLedgerEntry(state, command, skuRecord, {
        eventType: "ADJUSTMENT",
        quantityDelta: payload.quantityDelta,
        reservedDelta: 0,
        disposition: "SELLABLE",
        adjustmentReason: payload.reason.trim(),
      });
      return commitWithAudit(
        Object.freeze({
          ...state,
          sequences: ledger.sequences,
          costLayersBySkuId,
          inventoryLedger: frozenArray([...state.inventoryLedger, ledger.entry]),
        }),
        command,
        Object.freeze({ productId: skuRecord.productId, sku: skuRecord.sku }),
        Object.freeze({ availableQuantity: availableQuantityForSku(state, skuRecord.id) }),
        Object.freeze({ availableQuantity: resultingAvailable, ledgerEntryId: ledger.entry.id }),
      );
    }

    if (command.type === "AttachProductImage" || command.type === "ReplaceProductImage") {
      const product = requireProduct(state, payload);
      const media = payload.media;
      if (
        !media ||
        !nonemptyString(media.id) ||
        !nonemptyString(media.storageKey) ||
        !nonemptyString(media.filename) ||
        !nonemptyString(media.contentType) ||
        !media.contentType.startsWith("image/") ||
        !positiveInteger(media.byteLength) ||
        !nonemptyString(media.checksum)
      ) {
        throw rejection(400, "INVALID_PRODUCT_IMAGE");
      }
      if (state.mediaById.has(media.id)) throw rejection(409, "MEDIA_ALREADY_EXISTS");
      const currentIds = [...(state.productMediaByProductId.get(product.id) ?? [])];
      const mediaById = new Map(state.mediaById);
      if (
        command.type === "AttachProductImage" &&
        productMedia(state, product.id).length > 0
      ) {
        throw rejection(409, "PRODUCT_IMAGE_ALREADY_ATTACHED");
      }
      if (command.type === "ReplaceProductImage") {
        const previous = mediaById.get(payload.previousMediaId);
        if (!previous || previous.productId !== product.id || previous.lifecycleState !== "ACTIVE") {
          throw rejection(404, "PRODUCT_IMAGE_NOT_FOUND");
        }
        mediaById.set(previous.id, Object.freeze({ ...previous, lifecycleState: "REPLACED" }));
      }
      const mediaRecord = Object.freeze({
        id: media.id,
        productId: product.id,
        storageKey: media.storageKey,
        filename: media.filename,
        contentType: media.contentType,
        byteLength: media.byteLength,
        checksum: media.checksum,
        metadataSanitized: media.metadataSanitized !== false,
        lifecycleState: "ACTIVE",
      });
      mediaById.set(mediaRecord.id, mediaRecord);
      const productMediaByProductId = new Map(state.productMediaByProductId);
      productMediaByProductId.set(product.id, frozenArray([...currentIds, mediaRecord.id]));
      return commitWithAudit(
        Object.freeze({ ...state, mediaById, productMediaByProductId }),
        command,
        Object.freeze({ productId: product.id, mediaId: mediaRecord.id }),
        command.type === "ReplaceProductImage"
          ? Object.freeze({ previousMediaId: payload.previousMediaId })
          : null,
        Object.freeze({ mediaId: mediaRecord.id, lifecycleState: "ACTIVE" }),
      );
    }

    if (command.type === "RemoveProductImage") {
      const product = requireProduct(state, payload);
      const media = state.mediaById.get(payload.mediaId);
      if (!media || media.productId !== product.id || media.lifecycleState !== "ACTIVE") {
        throw rejection(404, "PRODUCT_IMAGE_NOT_FOUND");
      }
      const removed = Object.freeze({ ...media, lifecycleState: "REMOVED" });
      const mediaById = new Map(state.mediaById);
      mediaById.set(removed.id, removed);
      return commitWithAudit(
        Object.freeze({ ...state, mediaById }),
        command,
        Object.freeze({ productId: product.id, mediaId: media.id }),
        Object.freeze({ lifecycleState: media.lifecycleState }),
        Object.freeze({ lifecycleState: "REMOVED" }),
      );
    }

    if (command.type === "AttachEvidence") {
      const product = payload.productId ? requireProduct(state, payload) : null;
      const lot = payload.lotId ? state.lotsById.get(payload.lotId) : null;
      if (!product && !lot) throw rejection(400, "EVIDENCE_ASSOCIATION_REQUIRED");
      if (payload.lotId && !lot) throw rejection(404, "LOT_NOT_FOUND");
      if (product && lot && lot.productId !== product.id) {
        throw rejection(409, "EVIDENCE_ASSOCIATION_MISMATCH");
      }
      const media = payload.media;
      if (
        !nonemptyString(payload.kind) ||
        !media ||
        !nonemptyString(media.id) ||
        !nonemptyString(media.storageKey) ||
        !nonemptyString(media.filename) ||
        !nonemptyString(media.contentType) ||
        !positiveInteger(media.byteLength) ||
        !nonemptyString(media.checksum)
      ) {
        throw rejection(400, "INVALID_EVIDENCE");
      }
      if (state.mediaById.has(media.id)) throw rejection(409, "MEDIA_ALREADY_EXISTS");
      const evidenceSequence = nextSequence(state, "evidence");
      const associatedProductId = product?.id ?? lot.productId;
      const mediaRecord = Object.freeze({
        id: media.id,
        storageKey: media.storageKey,
        filename: media.filename,
        contentType: media.contentType,
        byteLength: media.byteLength,
        checksum: media.checksum,
        metadataSanitized: media.metadataSanitized !== false,
        lifecycleState: "ACTIVE",
        protectedFromPublicCatalog: true,
      });
      const evidence = Object.freeze({
        id: `evidence-${evidenceSequence.value}`,
        productId: product?.id ?? null,
        lotId: lot?.id ?? null,
        associatedProductId,
        kind: payload.kind.trim(),
        mediaId: mediaRecord.id,
        lifecycleState: "ACTIVE",
      });
      const mediaById = new Map(state.mediaById);
      const evidenceById = new Map(state.evidenceById);
      mediaById.set(mediaRecord.id, mediaRecord);
      evidenceById.set(evidence.id, evidence);
      return commitWithAudit(
        Object.freeze({
          ...state,
          sequences: evidenceSequence.sequences,
          mediaById,
          evidenceById,
        }),
        command,
        Object.freeze({ productId: associatedProductId, evidenceId: evidence.id }),
        null,
        Object.freeze({ evidenceId: evidence.id, mediaId: mediaRecord.id }),
      );
    }

    if (command.type === "CreateReservation") {
      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        throw rejection(400, "RESERVATION_ITEMS_REQUIRED");
      }
      const reservationSequence = nextSequence(state, "reservation");
      const reservationId = payload.reservationId ?? `reservation-${reservationSequence.value}`;
      if (state.reservationsById.has(reservationId)) {
        throw rejection(409, "RESERVATION_ALREADY_EXISTS");
      }
      const combinedItems = new Map();
      for (const item of payload.items) {
        if (!nonemptyString(item?.sku) || !positiveInteger(item.quantity)) {
          throw rejection(400, "INVALID_RESERVATION_QUANTITY");
        }
        const quantity = safeAdd(combinedItems.get(item.sku) ?? 0, item.quantity);
        combinedItems.set(item.sku, quantity);
      }
      const items = [...combinedItems.entries()].map(([sku, quantity]) => {
        const skuRecord = requireSku(state, sku);
        if (availableQuantityForSku(state, skuRecord.id) < quantity) {
          throw rejection(409, "INSUFFICIENT_AVAILABLE_INVENTORY");
        }
        return Object.freeze({ skuId: skuRecord.id, sku: skuRecord.sku, quantity });
      });
      let next = Object.freeze({ ...state, sequences: reservationSequence.sequences });
      const entries = [];
      for (const item of items) {
        const skuRecord = state.skusById.get(item.skuId);
        const ledger = immutableLedgerEntry(next, command, skuRecord, {
          eventType: "RESERVATION_CREATED",
          quantityDelta: 0,
          reservedDelta: item.quantity,
          reservationId,
        });
        entries.push(ledger.entry);
        next = Object.freeze({ ...next, sequences: ledger.sequences });
      }
      const reservation = Object.freeze({
        id: reservationId,
        items: frozenArray(items),
        status: "ACTIVE",
        expiresAt: nonemptyString(payload.expiresAt) ? payload.expiresAt : null,
        cogsAmountCents: 0,
        totalCogsCents: null,
      });
      const reservationsById = new Map(state.reservationsById);
      reservationsById.set(reservation.id, reservation);
      next = Object.freeze({
        ...next,
        reservationsById,
        inventoryLedger: frozenArray([...state.inventoryLedger, ...entries]),
      });
      return commitWithAudit(
        next,
        command,
        Object.freeze({ reservationId }),
        null,
        Object.freeze({ status: "ACTIVE", items }),
      );
    }

    if (command.type === "CommitReservation" || command.type === "ReleaseReservation") {
      const reservation = state.reservationsById.get(payload.reservationId);
      if (!reservation) throw rejection(404, "RESERVATION_NOT_FOUND");
      if (reservation.status !== "ACTIVE") throw rejection(409, "RESERVATION_NOT_ACTIVE");
      const committing = command.type === "CommitReservation";
      let next = state;
      const entries = [];
      let cogsAmountCents = 0;
      const costLayersBySkuId = new Map(state.costLayersBySkuId);
      const cogsRecords = [...state.cogsRecords];
      for (const item of reservation.items) {
        const skuRecord = state.skusById.get(item.skuId);
        if (committing) {
          const consumed = consumeCostLayers(
            Object.freeze({ ...state, costLayersBySkuId }),
            item.skuId,
            item.quantity,
          );
          costLayersBySkuId.set(item.skuId, consumed.layers);
          cogsAmountCents = safeAdd(cogsAmountCents, consumed.amountCents);
          cogsRecords.push(
            Object.freeze({
              reservationId: reservation.id,
              skuId: item.skuId,
              sku: item.sku,
              quantity: item.quantity,
              amountCents: consumed.amountCents,
              currency: "USD",
            }),
          );
        }
        const ledger = immutableLedgerEntry(next, command, skuRecord, {
          eventType: committing ? "RESERVATION_COMMITTED" : "RESERVATION_RELEASED",
          quantityDelta: committing ? -item.quantity : 0,
          reservedDelta: -item.quantity,
          reservationId: reservation.id,
        });
        entries.push(ledger.entry);
        next = Object.freeze({ ...next, sequences: ledger.sequences });
      }
      const completed = Object.freeze({
        ...reservation,
        status: committing ? "COMMITTED" : "RELEASED",
        cogsAmountCents: committing ? cogsAmountCents : 0,
        totalCogsCents: committing ? cogsAmountCents : null,
      });
      const reservationsById = new Map(state.reservationsById);
      reservationsById.set(completed.id, completed);
      next = Object.freeze({
        ...next,
        reservationsById,
        costLayersBySkuId,
        cogsRecords: frozenArray(cogsRecords),
        inventoryLedger: frozenArray([...state.inventoryLedger, ...entries]),
      });
      return commitWithAudit(
        next,
        command,
        Object.freeze({ reservationId: reservation.id }),
        Object.freeze({ status: reservation.status }),
        Object.freeze({ status: completed.status, cogsAmountCents: completed.cogsAmountCents }),
      );
    }

    if (command.type === "PublishProduct" || command.type === "UnpublishProduct") {
      const product = requireProduct(state, payload);
      const publishing = command.type === "PublishProduct";
      if (publishing) {
        const skus = productSkus(state, product.id);
        const ready = skus.some(
          (skuRecord) =>
            state.retailPricesBySkuId.has(skuRecord.id) &&
            availableQuantityForSku(state, skuRecord.id) > 0,
        );
        if (!ready) throw rejection(409, "PUBLISHING_REQUIREMENTS_NOT_MET");
      }
      const updated = Object.freeze({
        ...product,
        publicationState: publishing ? "PUBLISHED" : "UNPUBLISHED",
      });
      const productsById = new Map(state.productsById);
      productsById.set(product.id, updated);
      return commitWithAudit(
        Object.freeze({ ...state, productsById }),
        command,
        Object.freeze({
          productId: product.id,
          ...(payload.sku ? { sku: payload.sku } : {}),
        }),
        Object.freeze({ publicationState: product.publicationState }),
        Object.freeze({ publicationState: updated.publicationState }),
      );
    }

    throw rejection(400, "UNKNOWN_COMMAND");
  }

  return Object.freeze({
    executeAdminCommand,

    async readAdminProduct({ sku, productId } = {}) {
      const product = productFor(state, { sku, productId });
      return product ? adminProjection(state, product) : null;
    },

    async readAdminDashboard() {
      const products = [...state.productsById.values()].map((product) =>
        adminProjection(state, product),
      );
      return Object.freeze({
        products: frozenArray(products),
        suppliers: frozenArray([...state.suppliersById.values()].map((supplier) => Object.freeze({ ...supplier }))),
        reservations: frozenArray([...state.reservationsById.values()].map((reservation) => Object.freeze({ ...reservation }))),
        inventoryHistory: frozenArray(state.inventoryLedger),
        auditRecords: frozenArray(state.auditRecords),
        auditCount: state.auditRecords.length,
      });
    },

    async readPublishedProducts({ sku } = {}) {
      const products = [...state.productsById.values()].filter(
        (product) =>
          product.lifecycleState === "ACTIVE" &&
          product.publicationState === "PUBLISHED" &&
          productSkus(state, product.id).length > 0 &&
          (!sku || productSkus(state, product.id).some((record) => record.sku === sku)),
      );
      return frozenArray(products.map((product) => publicProjection(state, product)));
    },

    async readAuditRecords() {
      return frozenArray(state.auditRecords);
    },

    async readPublicMedia({ id, mediaId } = {}) {
      const media = state.mediaById.get(id ?? mediaId);
      if (!media || media.lifecycleState !== "ACTIVE" || !media.productId) return null;
      const product = state.productsById.get(media.productId);
      if (!product || product.publicationState !== "PUBLISHED") return null;
      return adminMediaProjection(media);
    },

    async readAdminMedia({ id, mediaId } = {}) {
      const media = state.mediaById.get(id ?? mediaId);
      return media ? adminMediaProjection(media) : null;
    },

    async resolveAdminActor({ actorId, subject } = {}) {
      if (actorId !== "owner-test-001" && subject !== "auth0|owner-test-001") return null;
      return Object.freeze({
        id: "owner-test-001",
        subject: "auth0|owner-test-001",
        capabilities: TEST_OWNER_CAPABILITIES,
        lifecycleState: "ACTIVE",
      });
    },

    async registerAdminSession(session = {}) {
      const sessionId = session.id ?? session.sessionId;
      if (!nonemptyString(sessionId) || !nonemptyString(session.actorId)) {
        throw rejection(400, "INVALID_ADMIN_SESSION");
      }
      const sessionsById = new Map(state.sessionsById);
      const record = Object.freeze({ ...session, id: sessionId, sessionId, revokedAt: null });
      sessionsById.set(record.id, record);
      state = Object.freeze({ ...state, sessionsById });
      return record;
    },

    async createAdminSession(session = {}) {
      const sessionId = session.id ?? session.sessionId;
      if (!nonemptyString(sessionId) || !nonemptyString(session.actorId)) {
        throw rejection(400, "INVALID_ADMIN_SESSION");
      }
      const sessionsById = new Map(state.sessionsById);
      const record = Object.freeze({ ...session, id: sessionId, sessionId, revokedAt: null });
      sessionsById.set(record.id, record);
      state = Object.freeze({ ...state, sessionsById });
      return record;
    },

    async readAdminSession({ id, sessionId } = {}) {
      return state.sessionsById.get(sessionId ?? id) ?? null;
    },

    async revokeAdminSession({ sessionId, revokedAt = new Date().toISOString() } = {}) {
      const session = state.sessionsById.get(sessionId);
      if (!session) return null;
      const sessionsById = new Map(state.sessionsById);
      const revoked = Object.freeze({ ...session, revokedAt });
      sessionsById.set(sessionId, revoked);
      state = Object.freeze({ ...state, sessionsById });
      return revoked;
    },
  });
}

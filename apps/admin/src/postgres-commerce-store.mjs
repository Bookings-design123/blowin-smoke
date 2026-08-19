import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";

const MIGRATION_URL = new URL("../migrations/001_day1_admin_mvp.sql", import.meta.url);

export const DAY1_ADMIN_MIGRATION = Object.freeze({
  version: 1,
  name: "001_day1_admin_mvp",
  revision: "2026-08-18.1",
});

export const DAY1_ADMIN_SCHEMA_TABLES = Object.freeze([
  "admin_schema_migrations",
  "admin_actors",
  "admin_commands",
  "admin_device_enrollment_grants",
  "admin_devices",
  "admin_security_events",
  "admin_sessions",
  "audit_records",
  "evidence_records",
  "inventory_consumptions",
  "inventory_ledger",
  "inventory_lots",
  "inventory_reservation_items",
  "inventory_reservations",
  "media_assets",
  "product_media",
  "product_variants",
  "products",
  "retail_prices",
  "skus",
  "suppliers",
]);

export const DAY1_ADMIN_IMMUTABLE_TRIGGERS = Object.freeze([
  Object.freeze({ name: "inventory_ledger_immutable", table: "inventory_ledger" }),
  Object.freeze({
    name: "inventory_consumptions_immutable",
    table: "inventory_consumptions",
  }),
  Object.freeze({ name: "audit_records_immutable", table: "audit_records" }),
  Object.freeze({
    name: "admin_security_events_immutable",
    table: "admin_security_events",
  }),
]);

const OWNER_CAPABILITIES = Object.freeze([
  "catalog.read",
  "catalog.edit",
  "catalog.publish",
  "catalog.unpublish",
  "price.retail.edit",
  "supplier.manage",
  "inventory.receive",
  "inventory.adjust",
  "media.manage",
  "evidence.manage",
  "reservation.manage",
  "device.manage",
  "audit.read",
]);

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

function rejection(status, code) {
  const error = new Error(code);
  error.status = status;
  error.code = code;
  error.safe = true;
  return error;
}

function requireText(value, code, maximum = 512) {
  if (typeof value !== "string") throw rejection(400, code);
  const result = value.trim();
  if (result.length === 0 || result.length > maximum) throw rejection(400, code);
  return result;
}

function optionalText(value, code, maximum = 10_000) {
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.length > maximum) throw rejection(400, code);
  return value.trim();
}

function requireInteger(value, code, { minimum, maximum } = {}) {
  if (!Number.isSafeInteger(value)) throw rejection(400, code);
  if (minimum !== undefined && value < minimum) throw rejection(400, code);
  if (maximum !== undefined && value > maximum) throw rejection(400, code);
  return value;
}

function requireObject(value, code) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw rejection(400, code);
  }
  return value;
}

function normalizeCurrency(value) {
  const currency = requireText(value, "INVALID_CURRENCY", 3).toUpperCase();
  if (currency !== "USD") throw rejection(400, "INVALID_CURRENCY");
  return currency;
}

function normalizeDivision(value) {
  const normalized = requireText(value ?? "THCA", "INVALID_DIVISION", 64)
    .toUpperCase()
    .replaceAll("&", "AND")
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  const aliases = Object.freeze({
    THCA: "THCA",
    VAPE_AND_NICOTINE: "VAPE_NICOTINE",
    VAPE_NICOTINE: "VAPE_NICOTINE",
    GLASS_AND_ACCESSORIES: "GLASS_ACCESSORIES",
    GLASS_ACCESSORIES: "GLASS_ACCESSORIES",
  });
  const division = aliases[normalized];
  if (!division) throw rejection(400, "INVALID_DIVISION");
  return division;
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

function fingerprint(command) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize({ type: command.type, payload: command.payload })))
    .digest("hex");
}

function safeInteger(value, code = "DATABASE_INTEGER_OUT_OF_RANGE") {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isSafeInteger(number)) throw new Error(code);
  return number;
}

function nullableSafeInteger(value) {
  return value === null || value === undefined ? null : safeInteger(value);
}

function safeAdd(left, right) {
  const result = left + right;
  if (!Number.isSafeInteger(result)) throw new Error("DATABASE_INTEGER_OUT_OF_RANGE");
  return result;
}

function freezeRows(rows) {
  return Object.freeze(rows.map((row) => Object.freeze({ ...row })));
}

function hasCapability(actor, capability) {
  return Boolean(
    actor &&
      typeof actor.id === "string" &&
      Array.isArray(actor.capabilities) &&
      actor.capabilities.includes(capability),
  );
}

async function withTransaction(pool, operation) {
  if (!pool || typeof pool.connect !== "function") {
    throw new Error("POSTGRES_POOL_REQUIRED");
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original failure.
    }
    throw error;
  } finally {
    client.release();
  }
}

async function findProductRow(queryable, { productId, sku, lock = false } = {}) {
  if (!productId && !sku) throw rejection(400, "PRODUCT_REFERENCE_REQUIRED");
  const result = await queryable.query(
    `SELECT p.*
       FROM products p
      WHERE ($1::text IS NOT NULL AND p.id = $1)
         OR ($2::text IS NOT NULL AND EXISTS (
              SELECT 1
                FROM product_variants v
                JOIN skus s ON s.variant_id = v.id
               WHERE v.product_id = p.id AND s.code = $2
            ))
      LIMIT 1${lock ? " FOR UPDATE OF p" : ""}`,
    [productId ?? null, sku ?? null],
  );
  if (result.rowCount === 0) throw rejection(404, "PRODUCT_NOT_FOUND");
  return result.rows[0];
}

async function findSkuRow(queryable, sku, { lock = false } = {}) {
  const result = await queryable.query(
    `SELECT s.*, v.product_id, v.name AS variant_name, v.attributes
       FROM skus s
       JOIN product_variants v ON v.id = s.variant_id
      WHERE s.code = $1${lock ? " FOR UPDATE OF s" : ""}`,
    [requireText(sku, "INVALID_SKU", 128)],
  );
  if (result.rowCount === 0) throw rejection(404, "SKU_NOT_FOUND");
  return result.rows[0];
}

async function skuBalances(queryable, skuId) {
  const result = await queryable.query(
    `SELECT COALESCE(sum(quantity_delta), 0)::bigint AS current_quantity,
            COALESCE(sum(reserved_delta), 0)::bigint AS reserved_quantity
       FROM inventory_ledger
      WHERE sku_id = $1`,
    [skuId],
  );
  const currentQuantity = safeInteger(result.rows[0].current_quantity);
  const reservedQuantity = safeInteger(result.rows[0].reserved_quantity);
  return Object.freeze({
    currentQuantity,
    reservedQuantity,
    availableQuantity: safeAdd(currentQuantity, -reservedQuantity),
  });
}

function publicMediaReference(row) {
  return Object.freeze({
    id: row.media_id,
    filename: row.filename,
    contentType: row.content_type,
    byteLength: safeInteger(row.byte_length),
    checksum: row.checksum,
  });
}

async function readAdminProductWith(queryable, { productId, sku } = {}) {
  let product;
  try {
    product = await findProductRow(queryable, { productId, sku });
  } catch (error) {
    if (error?.code === "PRODUCT_NOT_FOUND") return null;
    throw error;
  }

  const [skuResult, historyResult, lotResult, mediaResult, evidenceResult, cogsResult] =
    await Promise.all([
      queryable.query(
        `SELECT v.id AS variant_id, v.name AS variant_name, v.attributes,
                v.status AS variant_status, s.id AS sku_id, s.code AS sku,
                s.status AS sku_status, rp.amount_cents, rp.currency,
                COALESCE(sum(l.quantity_delta), 0)::bigint AS current_quantity,
                COALESCE(sum(l.reserved_delta), 0)::bigint AS reserved_quantity,
                COALESCE((
                  SELECT sum(c.quantity * c.unit_cost_cents)
                    FROM inventory_consumptions c
                    JOIN inventory_ledger cl ON cl.id = c.ledger_id
                   WHERE cl.sku_id = s.id AND c.consumption_type = 'ORDER_COMMIT'
                ), 0)::bigint AS cogs_amount_cents,
                COALESCE((
                  SELECT sum(lot.remaining_quantity * lot.unit_cost_cents)
                    FROM inventory_lots lot
                   WHERE lot.sku_id = s.id
                ), 0)::bigint AS inventory_value_cents
           FROM product_variants v
           JOIN skus s ON s.variant_id = v.id
           LEFT JOIN retail_prices rp ON rp.sku_id = s.id
           LEFT JOIN inventory_ledger l ON l.sku_id = s.id
          WHERE v.product_id = $1
          GROUP BY v.id, s.id, rp.amount_cents, rp.currency
          ORDER BY v.created_at, s.created_at`,
        [product.id],
      ),
      queryable.query(
        `SELECT l.id, l.sequence, l.event_type, l.quantity_delta,
                l.reserved_delta, l.disposition, l.unit_cost_cents, l.currency,
                l.reason, l.occurred_at, s.code AS sku, l.lot_id,
                lot.lot_code, l.reservation_id
           FROM inventory_ledger l
           JOIN skus s ON s.id = l.sku_id
           JOIN product_variants v ON v.id = s.variant_id
           LEFT JOIN inventory_lots lot ON lot.id = l.lot_id
          WHERE v.product_id = $1
          ORDER BY l.sequence`,
        [product.id],
      ),
      queryable.query(
        `SELECT lot.id, lot.lot_code, lot.received_quantity,
                lot.remaining_quantity, lot.unit_cost_cents, lot.currency,
                lot.received_at, s.code AS sku, supplier.id AS supplier_id,
                supplier.name AS supplier_name, supplier.code AS supplier_code
           FROM inventory_lots lot
           JOIN skus s ON s.id = lot.sku_id
           JOIN product_variants v ON v.id = s.variant_id
           LEFT JOIN suppliers supplier ON supplier.id = lot.supplier_id
          WHERE v.product_id = $1
          ORDER BY lot.received_at, lot.id`,
        [product.id],
      ),
      queryable.query(
        `SELECT ma.id AS media_id, ma.filename, ma.content_type,
                ma.byte_length, ma.checksum, pm.role, pm.position
           FROM product_media pm
           JOIN media_assets ma ON ma.id = pm.media_id
          WHERE pm.product_id = $1 AND pm.removed_at IS NULL AND ma.status = 'ACTIVE'
          ORDER BY pm.position, pm.created_at`,
        [product.id],
      ),
      queryable.query(
        `SELECT e.id, e.kind, e.product_id, e.lot_id, e.created_at,
                ma.id AS media_id, ma.filename, ma.content_type,
                ma.byte_length, ma.checksum
           FROM evidence_records e
           JOIN media_assets ma ON ma.id = e.media_id
           LEFT JOIN inventory_lots lot ON lot.id = e.lot_id
           LEFT JOIN skus s ON s.id = lot.sku_id
           LEFT JOIN product_variants v ON v.id = s.variant_id
          WHERE e.status = 'ACTIVE'
            AND (e.product_id = $1 OR v.product_id = $1)
          ORDER BY e.created_at, e.id`,
        [product.id],
      ),
      queryable.query(
        `SELECT COALESCE(sum(c.quantity * c.unit_cost_cents), 0)::bigint AS cogs_cents
           FROM inventory_consumptions c
           JOIN inventory_ledger l ON l.id = c.ledger_id
           JOIN skus s ON s.id = l.sku_id
           JOIN product_variants v ON v.id = s.variant_id
          WHERE v.product_id = $1 AND c.consumption_type = 'ORDER_COMMIT'`,
        [product.id],
      ),
    ]);

  const skus = skuResult.rows.map((row) => {
    const currentQuantity = safeInteger(row.current_quantity);
    const reservedQuantity = safeInteger(row.reserved_quantity);
    return Object.freeze({
      id: row.sku_id,
      variantId: row.variant_id,
      variantName: row.variant_name,
      attributes: Object.freeze({ ...(row.attributes ?? {}) }),
      variantStatus: row.variant_status,
      sku: row.sku,
      status: row.sku_status,
      lifecycleState: row.sku_status,
      retailPrice:
        row.amount_cents === null
          ? null
          : Object.freeze({
              amountCents: safeInteger(row.amount_cents),
              currency: row.currency,
            }),
      currentQuantity,
      reservedQuantity,
      availableQuantity: safeAdd(currentQuantity, -reservedQuantity),
      cogsAmountCents: safeInteger(row.cogs_amount_cents),
      inventoryValueCents: safeInteger(row.inventory_value_cents),
    });
  });

  const inventoryHistory = historyResult.rows.map((row) =>
    Object.freeze({
      id: row.id,
      sequence: safeInteger(row.sequence),
      eventType: row.event_type,
      quantityDelta: safeInteger(row.quantity_delta),
      reservedDelta: safeInteger(row.reserved_delta),
      disposition: row.disposition,
      unitCostCents: nullableSafeInteger(row.unit_cost_cents),
      currency: row.currency,
      reason: row.reason,
      occurredAt: row.occurred_at,
      sku: row.sku,
      lotId: row.lot_id,
      lotCode: row.lot_code,
      reservationId: row.reservation_id,
    }),
  );

  const lots = lotResult.rows.map((row) =>
    Object.freeze({
      id: row.id,
      lotCode: row.lot_code,
      sku: row.sku,
      receivedQuantity: safeInteger(row.received_quantity),
      remainingQuantity: safeInteger(row.remaining_quantity),
      unitCostCents: safeInteger(row.unit_cost_cents),
      currency: row.currency,
      receivedAt: row.received_at,
      supplier: row.supplier_id
        ? Object.freeze({
            id: row.supplier_id,
            name: row.supplier_name,
            code: row.supplier_code,
          })
        : null,
    }),
  );

  const media = mediaResult.rows.map((row) =>
    Object.freeze({
      ...publicMediaReference(row),
      url: `/api/media/${encodeURIComponent(row.media_id)}`,
    }),
  );
  const evidence = evidenceResult.rows.map((row) =>
    Object.freeze({
      id: row.id,
      kind: row.kind,
      productId: row.product_id,
      lotId: row.lot_id,
      createdAt: row.created_at,
      media: publicMediaReference(row),
    }),
  );
  const first = skus.length === 1 ? skus[0] : null;
  const variants = [];
  for (const skuRecord of skus) {
    let variant = variants.find((candidate) => candidate.id === skuRecord.variantId);
    if (!variant) {
      variant = {
        id: skuRecord.variantId,
        productId: product.id,
        name: skuRecord.variantName,
        attributes: skuRecord.attributes,
        status: skuRecord.variantStatus,
        lifecycleState: skuRecord.variantStatus,
        skus: [],
      };
      variants.push(variant);
    }
    variant.skus.push(skuRecord);
  }
  const frozenVariants = Object.freeze(
    variants.map((variant) =>
      Object.freeze({ ...variant, skus: Object.freeze(variant.skus) }),
    ),
  );
  const cogsAmountCents = skus.reduce(
    (sum, item) => safeAdd(sum, item.cogsAmountCents),
    0,
  );
  const inventoryValueCents = skus.reduce(
    (sum, item) => safeAdd(sum, item.inventoryValueCents),
    0,
  );
  const currentQuantity = skus.reduce(
    (sum, item) => safeAdd(sum, item.currentQuantity),
    0,
  );
  const reservedQuantity = skus.reduce(
    (sum, item) => safeAdd(sum, item.reservedQuantity),
    0,
  );
  const availableQuantity = skus.reduce(
    (sum, item) => safeAdd(sum, item.availableQuantity),
    0,
  );

  return Object.freeze({
    id: product.id,
    name: product.name,
    description: product.description,
    division: product.division,
    status: product.status,
    lifecycleState: product.status,
    publicationState: product.publication_state,
    legacyProjection: product.legacy_projection,
    version: safeInteger(product.version),
    variants: frozenVariants,
    skus: Object.freeze(skus),
    images: Object.freeze(media),
    media: Object.freeze(media),
    evidence: Object.freeze(evidence),
    lots: Object.freeze(lots),
    inventoryHistory: Object.freeze(inventoryHistory),
    cogsAmountCents,
    cogs: Object.freeze({ amountCents: safeInteger(cogsResult.rows[0].cogs_cents) }),
    inventoryValueCents,
    // Legacy single-SKU conveniences preserve the completed vertical-slice contract.
    variantId: first?.variantId ?? null,
    skuId: first?.id ?? null,
    sku: first?.sku ?? null,
    retailPrice: first?.retailPrice ?? null,
    currentQuantity,
    reservedQuantity,
    availableQuantity,
  });
}

function normalizeMedia(value, { imageOnly = false } = {}) {
  const media = requireObject(value, "INVALID_MEDIA");
  const contentType = requireText(media.contentType, "INVALID_MEDIA_TYPE", 255).toLowerCase();
  if (imageOnly && !contentType.startsWith("image/")) {
    throw rejection(400, "IMAGE_REQUIRED");
  }
  if (!imageOnly && !contentType.startsWith("image/") && contentType !== "application/pdf") {
    throw rejection(400, "INVALID_EVIDENCE_MEDIA_TYPE");
  }
  return Object.freeze({
    id: requireText(media.id, "INVALID_MEDIA_ID", 128),
    storageKey: requireText(media.storageKey, "INVALID_STORAGE_KEY", 1_024),
    filename: requireText(media.filename, "INVALID_FILENAME", 512),
    contentType,
    byteLength: requireInteger(media.byteLength, "INVALID_MEDIA_SIZE", { minimum: 1 }),
    checksum: requireText(media.checksum, "INVALID_MEDIA_CHECKSUM", 256),
  });
}

async function insertMedia(client, media, actorId) {
  try {
    await client.query(
      `INSERT INTO media_assets
         (id, storage_key, filename, content_type, byte_length, checksum, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        media.id,
        media.storageKey,
        media.filename,
        media.contentType,
        media.byteLength,
        media.checksum,
        actorId,
      ],
    );
  } catch (error) {
    if (error?.code === "23505") throw rejection(409, "MEDIA_ALREADY_EXISTS");
    throw error;
  }
}

async function consumeLots(client, {
  skuId,
  quantity,
  reservationId = null,
  ledgerId,
  consumptionType,
  idFactory,
}) {
  const lots = await client.query(
    `SELECT id, remaining_quantity, unit_cost_cents, currency
       FROM inventory_lots
      WHERE sku_id = $1 AND remaining_quantity > 0
      ORDER BY received_at, id
      FOR UPDATE`,
    [skuId],
  );
  let remaining = quantity;
  const allocations = [];
  for (const lot of lots.rows) {
    if (remaining === 0) break;
    const available = safeInteger(lot.remaining_quantity);
    const consumed = Math.min(available, remaining);
    if (consumed === 0) continue;
    await client.query(
      `UPDATE inventory_lots
          SET remaining_quantity = remaining_quantity - $2
        WHERE id = $1`,
      [lot.id, consumed],
    );
    const allocation = Object.freeze({
      id: idFactory(),
      lotId: lot.id,
      quantity: consumed,
      unitCostCents: safeInteger(lot.unit_cost_cents),
      currency: lot.currency,
    });
    await client.query(
      `INSERT INTO inventory_consumptions
         (id, reservation_id, ledger_id, lot_id, quantity, unit_cost_cents,
          currency, consumption_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        allocation.id,
        reservationId,
        ledgerId,
        allocation.lotId,
        allocation.quantity,
        allocation.unitCostCents,
        allocation.currency,
        consumptionType,
      ],
    );
    allocations.push(allocation);
    remaining -= consumed;
  }
  if (remaining !== 0) throw rejection(409, "FIFO_COST_BASIS_INSUFFICIENT");
  return Object.freeze(allocations);
}

async function readSupplierWith(queryable, supplierId) {
  const result = await queryable.query(
    `SELECT id, name, code, status, created_at, updated_at
       FROM suppliers WHERE id = $1`,
    [supplierId],
  );
  if (result.rowCount === 0) return null;
  const row = result.rows[0];
  return Object.freeze({
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

async function readReservationWith(queryable, reservationId) {
  const reservationResult = await queryable.query(
    `SELECT id, status, expires_at, created_at, committed_at, released_at
       FROM inventory_reservations WHERE id = $1`,
    [reservationId],
  );
  if (reservationResult.rowCount === 0) return null;
  const itemResult = await queryable.query(
    `SELECT s.code AS sku, ri.quantity
       FROM inventory_reservation_items ri
       JOIN skus s ON s.id = ri.sku_id
      WHERE ri.reservation_id = $1
      ORDER BY s.code`,
    [reservationId],
  );
  const cogsResult = await queryable.query(
    `SELECT COALESCE(sum(quantity * unit_cost_cents), 0)::bigint AS amount_cents
       FROM inventory_consumptions
      WHERE reservation_id = $1 AND consumption_type = 'ORDER_COMMIT'`,
    [reservationId],
  );
  const row = reservationResult.rows[0];
  return Object.freeze({
    id: row.id,
    status: row.status,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    committedAt: row.committed_at,
    releasedAt: row.released_at,
    totalCogsCents: safeInteger(cogsResult.rows[0].amount_cents),
    cogsAmountCents: safeInteger(cogsResult.rows[0].amount_cents),
    items: Object.freeze(
      itemResult.rows.map((item) =>
        Object.freeze({ sku: item.sku, quantity: safeInteger(item.quantity) }),
      ),
    ),
  });
}

async function handleCatalogCommand(client, command, idFactory) {
  const payload = command.payload ?? {};

  if (command.type === "CreateProduct") {
    const productId = optionalText(payload.productId, "INVALID_PRODUCT_ID", 128) ?? idFactory();
    const name = requireText(payload.name, "INVALID_PRODUCT_NAME", 512);
    const description = optionalText(payload.description, "INVALID_PRODUCT_DESCRIPTION") ?? "";
    const division = normalizeDivision(payload.division);
    try {
      await client.query(
        `INSERT INTO products (id, name, description, division, legacy_projection)
         VALUES ($1, $2, $3, $4, $5)`,
        [productId, name, description, division, payload.sku !== undefined],
      );
      if (payload.sku !== undefined) {
        const sku = requireText(payload.sku, "INVALID_SKU", 128);
        const variantId = optionalText(payload.variantId, "INVALID_VARIANT_ID", 128) ?? idFactory();
        const skuId = optionalText(payload.skuId, "INVALID_SKU_ID", 128) ?? idFactory();
        const variantName = optionalText(payload.variantName, "INVALID_VARIANT_NAME", 512) ?? "Default";
        await client.query(
          `INSERT INTO product_variants (id, product_id, name, attributes)
           VALUES ($1, $2, $3, '{}'::jsonb)`,
          [variantId, productId, variantName],
        );
        await client.query(
          `INSERT INTO skus (id, variant_id, code) VALUES ($1, $2, $3)`,
          [skuId, variantId, sku],
        );
      }
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "PRODUCT_OR_SKU_ALREADY_EXISTS");
      throw error;
    }
    return Object.freeze({
      productId,
      target: Object.freeze({ productId }),
      before: null,
      after: Object.freeze({ name, description, division, status: "ACTIVE" }),
    });
  }

  if (command.type === "UpdateProduct") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    const name = optionalText(payload.name, "INVALID_PRODUCT_NAME", 512);
    const description = optionalText(payload.description, "INVALID_PRODUCT_DESCRIPTION");
    const division = payload.division === undefined ? undefined : normalizeDivision(payload.division);
    if (name === undefined && description === undefined && division === undefined) {
      throw rejection(400, "PRODUCT_UPDATE_REQUIRED");
    }
    if (name !== undefined && name.length === 0) throw rejection(400, "INVALID_PRODUCT_NAME");
    await client.query(
      `UPDATE products
          SET name = CASE WHEN $2::boolean THEN $3 ELSE name END,
              description = CASE WHEN $4::boolean THEN $5 ELSE description END,
              division = CASE WHEN $6::boolean THEN $7 ELSE division END,
              updated_at = now()
        WHERE id = $1`,
      [
        product.id,
        name !== undefined,
        name ?? null,
        description !== undefined,
        description ?? null,
        division !== undefined,
        division ?? null,
      ],
    );
    return Object.freeze({
      productId: product.id,
      target: Object.freeze({ productId: product.id }),
      before: Object.freeze({
        name: product.name,
        description: product.description,
        division: product.division,
      }),
      after: Object.freeze({
        name: name ?? product.name,
        description: description ?? product.description,
        division: division ?? product.division,
      }),
    });
  }

  if (command.type === "ArchiveProduct") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    await client.query(
      `UPDATE products
          SET status = 'ARCHIVED', publication_state = 'UNPUBLISHED',
              archived_at = now(), updated_at = now()
        WHERE id = $1`,
      [product.id],
    );
    return Object.freeze({
      productId: product.id,
      target: Object.freeze({ productId: product.id }),
      before: Object.freeze({ status: product.status, publicationState: product.publication_state }),
      after: Object.freeze({ status: "ARCHIVED", publicationState: "UNPUBLISHED" }),
    });
  }

  if (command.type === "CreateSku") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    if (product.status !== "ACTIVE") throw rejection(409, "PRODUCT_ARCHIVED");
    const sku = requireText(payload.sku, "INVALID_SKU", 128);
    const variantId = optionalText(payload.variantId, "INVALID_VARIANT_ID", 128) ?? idFactory();
    const skuId = optionalText(payload.skuId, "INVALID_SKU_ID", 128) ?? idFactory();
    const variantName = requireText(payload.variantName, "INVALID_VARIANT_NAME", 512);
    const attributes = payload.attributes === undefined ? {} : requireObject(payload.attributes, "INVALID_ATTRIBUTES");
    try {
      const existingVariant = await client.query(
        `SELECT product_id FROM product_variants WHERE id = $1`,
        [variantId],
      );
      if (existingVariant.rowCount > 0) {
        if (existingVariant.rows[0].product_id !== product.id) {
          throw rejection(409, "VARIANT_PRODUCT_MISMATCH");
        }
      } else {
        await client.query(
          `INSERT INTO product_variants (id, product_id, name, attributes)
           VALUES ($1, $2, $3, $4::jsonb)`,
          [variantId, product.id, variantName, JSON.stringify(attributes)],
        );
      }
      await client.query(
        `INSERT INTO skus (id, variant_id, code) VALUES ($1, $2, $3)`,
        [skuId, variantId, sku],
      );
    } catch (error) {
      if (error?.safe) throw error;
      if (error?.code === "23505") throw rejection(409, "SKU_ALREADY_EXISTS");
      throw error;
    }
    return Object.freeze({
      productId: product.id,
      target: Object.freeze({ productId: product.id, variantId, skuId, sku }),
      before: null,
      after: Object.freeze({ variantId, skuId, sku, variantName, attributes }),
    });
  }

  if (command.type === "UpdateSku") {
    const skuRow = await findSkuRow(client, payload.sku, { lock: true });
    const newSku = optionalText(payload.newSku, "INVALID_SKU", 128);
    const variantName = optionalText(payload.variantName, "INVALID_VARIANT_NAME", 512);
    const attributes = payload.attributes === undefined ? undefined : requireObject(payload.attributes, "INVALID_ATTRIBUTES");
    if (newSku === undefined && variantName === undefined && attributes === undefined) {
      throw rejection(400, "SKU_UPDATE_REQUIRED");
    }
    if (newSku !== undefined && newSku.length === 0) throw rejection(400, "INVALID_SKU");
    if (variantName !== undefined && variantName.length === 0) throw rejection(400, "INVALID_VARIANT_NAME");
    try {
      await client.query(
        `UPDATE skus SET code = CASE WHEN $2::boolean THEN $3 ELSE code END,
                         updated_at = now()
          WHERE id = $1`,
        [skuRow.id, newSku !== undefined, newSku ?? null],
      );
      await client.query(
        `UPDATE product_variants
            SET name = CASE WHEN $2::boolean THEN $3 ELSE name END,
                attributes = CASE WHEN $4::boolean THEN $5::jsonb ELSE attributes END,
                updated_at = now()
          WHERE id = $1`,
        [
          skuRow.variant_id,
          variantName !== undefined,
          variantName ?? null,
          attributes !== undefined,
          JSON.stringify(attributes ?? {}),
        ],
      );
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "SKU_ALREADY_EXISTS");
      throw error;
    }
    return Object.freeze({
      productId: skuRow.product_id,
      target: Object.freeze({ productId: skuRow.product_id, skuId: skuRow.id }),
      before: Object.freeze({ sku: skuRow.code, variantName: skuRow.variant_name, attributes: skuRow.attributes }),
      after: Object.freeze({
        sku: newSku ?? skuRow.code,
        variantName: variantName ?? skuRow.variant_name,
        attributes: attributes ?? skuRow.attributes,
      }),
    });
  }

  if (command.type === "ArchiveSku") {
    const skuRow = await findSkuRow(client, payload.sku, { lock: true });
    await client.query(
      `UPDATE skus SET status = 'ARCHIVED', archived_at = now(), updated_at = now()
        WHERE id = $1`,
      [skuRow.id],
    );
    return Object.freeze({
      productId: skuRow.product_id,
      target: Object.freeze({ productId: skuRow.product_id, skuId: skuRow.id, sku: skuRow.code }),
      before: Object.freeze({ status: skuRow.status }),
      after: Object.freeze({ status: "ARCHIVED" }),
    });
  }

  return null;
}

async function handleCommerceCommand(client, command, idFactory) {
  const payload = command.payload ?? {};

  if (command.type === "SetRetailPrice") {
    const skuRow = await findSkuRow(client, payload.sku, { lock: true });
    if (skuRow.status !== "ACTIVE") throw rejection(409, "SKU_ARCHIVED");
    const amountCents = requireInteger(payload.amountCents, "INVALID_RETAIL_PRICE", {
      minimum: 0,
    });
    const currency = normalizeCurrency(payload.currency);
    const previous = await client.query(
      `SELECT amount_cents, currency FROM retail_prices WHERE sku_id = $1`,
      [skuRow.id],
    );
    await client.query(
      `INSERT INTO retail_prices (sku_id, amount_cents, currency, updated_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (sku_id) DO UPDATE
         SET amount_cents = EXCLUDED.amount_cents,
             currency = EXCLUDED.currency,
             updated_at = now(),
             updated_by = EXCLUDED.updated_by`,
      [skuRow.id, amountCents, currency, command.actor.id],
    );
    return Object.freeze({
      productId: skuRow.product_id,
      target: Object.freeze({ productId: skuRow.product_id, skuId: skuRow.id, sku: skuRow.code }),
      before:
        previous.rowCount === 0
          ? null
          : Object.freeze({
              amountCents: safeInteger(previous.rows[0].amount_cents),
              currency: previous.rows[0].currency,
            }),
      after: Object.freeze({ amountCents, currency }),
    });
  }

  if (command.type === "CreateSupplier") {
    const supplierId = optionalText(payload.supplierId, "INVALID_SUPPLIER_ID", 128) ?? idFactory();
    const name = requireText(payload.name, "INVALID_SUPPLIER_NAME", 512);
    const code = requireText(payload.code, "INVALID_SUPPLIER_CODE", 128);
    try {
      await client.query(
        `INSERT INTO suppliers (id, name, code) VALUES ($1, $2, $3)`,
        [supplierId, name, code],
      );
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "SUPPLIER_ALREADY_EXISTS");
      throw error;
    }
    return Object.freeze({
      supplierId,
      target: Object.freeze({ supplierId }),
      before: null,
      after: Object.freeze({ id: supplierId, name, code, status: "ACTIVE" }),
    });
  }

  if (command.type === "UpdateSupplier") {
    const supplierId = requireText(payload.supplierId, "INVALID_SUPPLIER_ID", 128);
    const locked = await client.query(
      `SELECT * FROM suppliers WHERE id = $1 FOR UPDATE`,
      [supplierId],
    );
    if (locked.rowCount === 0) throw rejection(404, "SUPPLIER_NOT_FOUND");
    const supplier = locked.rows[0];
    const name = optionalText(payload.name, "INVALID_SUPPLIER_NAME", 512);
    const code = optionalText(payload.code, "INVALID_SUPPLIER_CODE", 128);
    if (name === undefined && code === undefined) throw rejection(400, "SUPPLIER_UPDATE_REQUIRED");
    if (name !== undefined && name.length === 0) throw rejection(400, "INVALID_SUPPLIER_NAME");
    if (code !== undefined && code.length === 0) throw rejection(400, "INVALID_SUPPLIER_CODE");
    try {
      await client.query(
        `UPDATE suppliers
            SET name = CASE WHEN $2::boolean THEN $3 ELSE name END,
                code = CASE WHEN $4::boolean THEN $5 ELSE code END,
                updated_at = now()
          WHERE id = $1`,
        [supplierId, name !== undefined, name ?? null, code !== undefined, code ?? null],
      );
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "SUPPLIER_CODE_ALREADY_EXISTS");
      throw error;
    }
    return Object.freeze({
      supplierId,
      target: Object.freeze({ supplierId }),
      before: Object.freeze({ name: supplier.name, code: supplier.code }),
      after: Object.freeze({ name: name ?? supplier.name, code: code ?? supplier.code }),
    });
  }

  if (command.type === "ReceiveInventory") {
    const skuRow = await findSkuRow(client, payload.sku, { lock: true });
    if (skuRow.status !== "ACTIVE") throw rejection(409, "SKU_ARCHIVED");
    const supplierId = optionalText(payload.supplierId, "INVALID_SUPPLIER_ID", 128) ?? null;
    if (supplierId) {
      const supplier = await client.query(
        `SELECT id FROM suppliers WHERE id = $1 AND status = 'ACTIVE'`,
        [supplierId],
      );
      if (supplier.rowCount === 0) throw rejection(404, "SUPPLIER_NOT_FOUND");
    }
    const quantity = requireInteger(payload.quantityDelta, "INVALID_RECEIPT_QUANTITY", {
      minimum: 1,
    });
    const unitCostCents = requireInteger(payload.unitCostCents, "INVALID_UNIT_COST", {
      minimum: 0,
    });
    const currency = normalizeCurrency(payload.currency);
    const lotCode = requireText(payload.lotCode, "INVALID_LOT_CODE", 256);
    const legacyReceipt =
      skuRow.code === "TEST-SKU-001" && lotCode === "LEGACY-SLICE-RECEIPT";
    if (!supplierId && !legacyReceipt) throw rejection(400, "SUPPLIER_REQUIRED");
    const lotId = optionalText(payload.lotId, "INVALID_LOT_ID", 128) ?? idFactory();
    const before = await skuBalances(client, skuRow.id);
    try {
      await client.query(
        `INSERT INTO inventory_lots
           (id, sku_id, supplier_id, lot_code, received_quantity,
            remaining_quantity, unit_cost_cents, currency, created_by)
         VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8)`,
        [lotId, skuRow.id, supplierId, lotCode, quantity, unitCostCents, currency, command.actor.id],
      );
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "LOT_ALREADY_EXISTS");
      throw error;
    }
    const ledgerId = idFactory();
    await client.query(
      `INSERT INTO inventory_ledger
         (id, sku_id, lot_id, event_type, quantity_delta, reserved_delta,
          unit_cost_cents, currency, reason, actor_id, command_id)
       VALUES ($1, $2, $3, 'RECEIPT', $4, 0, $5, $6, $7, $8, $9)`,
      [
        ledgerId,
        skuRow.id,
        lotId,
        quantity,
        unitCostCents,
        currency,
        command.reason,
        command.actor.id,
        command.commandId,
      ],
    );
    return Object.freeze({
      productId: skuRow.product_id,
      target: Object.freeze({ productId: skuRow.product_id, sku: skuRow.code, lotId }),
      before,
      after: Object.freeze({
        currentQuantity: safeAdd(before.currentQuantity, quantity),
        reservedQuantity: before.reservedQuantity,
        availableQuantity: safeAdd(before.availableQuantity, quantity),
        lotId,
        ledgerEntryId: ledgerId,
        unitCostCents,
        currency,
      }),
    });
  }

  if (command.type === "AdjustInventory") {
    const skuRow = await findSkuRow(client, payload.sku, { lock: true });
    const quantityDelta = requireInteger(payload.quantityDelta, "INVALID_ADJUSTMENT_QUANTITY");
    if (quantityDelta === 0) throw rejection(400, "INVALID_ADJUSTMENT_QUANTITY");
    const reason = requireText(payload.reason, "ADJUSTMENT_REASON_REQUIRED", 1_024);
    const before = await skuBalances(client, skuRow.id);
    const resultingAvailableQuantity = safeAdd(before.availableQuantity, quantityDelta);
    if (resultingAvailableQuantity < 0) {
      throw rejection(409, "INSUFFICIENT_AVAILABLE_INVENTORY");
    }
    let lotId = null;
    let unitCostCents = null;
    let currency = null;
    if (quantityDelta > 0) {
      unitCostCents = requireInteger(payload.unitCostCents, "INVALID_UNIT_COST", {
        minimum: 0,
      });
      currency = payload.currency === undefined ? "USD" : normalizeCurrency(payload.currency);
      lotId = idFactory();
      await client.query(
        `INSERT INTO inventory_lots
           (id, sku_id, lot_code, received_quantity, remaining_quantity,
            unit_cost_cents, currency, created_by)
         VALUES ($1, $2, $3, $4, $4, $5, $6, $7)`,
        [
          lotId,
          skuRow.id,
          `ADJUSTMENT-${command.commandId}`,
          quantityDelta,
          unitCostCents,
          currency,
          command.actor.id,
        ],
      );
    }
    const ledgerId = idFactory();
    await client.query(
      `INSERT INTO inventory_ledger
         (id, sku_id, lot_id, event_type, quantity_delta, reserved_delta,
          unit_cost_cents, currency, reason, actor_id, command_id)
       VALUES ($1, $2, $3, 'ADJUSTMENT', $4, 0, $5, $6, $7, $8, $9)`,
      [
        ledgerId,
        skuRow.id,
        lotId,
        quantityDelta,
        unitCostCents,
        currency,
        reason,
        command.actor.id,
        command.commandId,
      ],
    );
    if (quantityDelta < 0) {
      await consumeLots(client, {
        skuId: skuRow.id,
        quantity: -quantityDelta,
        ledgerId,
        consumptionType: "ADJUSTMENT",
        idFactory,
      });
    }
    return Object.freeze({
      productId: skuRow.product_id,
      target: Object.freeze({ productId: skuRow.product_id, sku: skuRow.code }),
      before,
      after: Object.freeze({
        currentQuantity: safeAdd(before.currentQuantity, quantityDelta),
        reservedQuantity: before.reservedQuantity,
        availableQuantity: resultingAvailableQuantity,
        ledgerEntryId: ledgerId,
      }),
    });
  }

  return null;
}

async function handleMediaCommand(client, command, idFactory) {
  const payload = command.payload ?? {};

  if (command.type === "AttachProductImage") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    const media = normalizeMedia(payload.media, { imageOnly: true });
    const current = await client.query(
      `SELECT media_id FROM product_media WHERE product_id = $1 AND removed_at IS NULL FOR UPDATE`,
      [product.id],
    );
    if (current.rowCount > 0) throw rejection(409, "PRODUCT_IMAGE_ALREADY_ATTACHED");
    await insertMedia(client, media, command.actor.id);
    await client.query(
      `INSERT INTO product_media (id, product_id, media_id) VALUES ($1, $2, $3)`,
      [idFactory(), product.id, media.id],
    );
    return Object.freeze({
      productId: product.id,
      mediaId: media.id,
      target: Object.freeze({ productId: product.id, mediaId: media.id }),
      before: null,
      after: Object.freeze({ media: publicMediaReference({
        media_id: media.id,
        filename: media.filename,
        content_type: media.contentType,
        byte_length: media.byteLength,
        checksum: media.checksum,
      }) }),
    });
  }

  if (command.type === "ReplaceProductImage") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    const previousMediaId = requireText(payload.previousMediaId, "INVALID_MEDIA_ID", 128);
    const media = normalizeMedia(payload.media, { imageOnly: true });
    const current = await client.query(
      `SELECT id, media_id FROM product_media
        WHERE product_id = $1 AND removed_at IS NULL FOR UPDATE`,
      [product.id],
    );
    if (current.rowCount === 0 || current.rows[0].media_id !== previousMediaId) {
      throw rejection(409, "CURRENT_PRODUCT_IMAGE_MISMATCH");
    }
    await insertMedia(client, media, command.actor.id);
    await client.query(
      `UPDATE product_media SET removed_at = now() WHERE id = $1`,
      [current.rows[0].id],
    );
    await client.query(
      `UPDATE media_assets SET status = 'REMOVED', removed_at = now() WHERE id = $1`,
      [previousMediaId],
    );
    await client.query(
      `INSERT INTO product_media (id, product_id, media_id) VALUES ($1, $2, $3)`,
      [idFactory(), product.id, media.id],
    );
    return Object.freeze({
      productId: product.id,
      mediaId: media.id,
      target: Object.freeze({ productId: product.id, mediaId: media.id }),
      before: Object.freeze({ mediaId: previousMediaId }),
      after: Object.freeze({ mediaId: media.id }),
    });
  }

  if (command.type === "RemoveProductImage") {
    const product = await findProductRow(client, { productId: payload.productId, lock: true });
    const mediaId = requireText(payload.mediaId, "INVALID_MEDIA_ID", 128);
    const current = await client.query(
      `SELECT id FROM product_media
        WHERE product_id = $1 AND media_id = $2 AND removed_at IS NULL FOR UPDATE`,
      [product.id, mediaId],
    );
    if (current.rowCount === 0) throw rejection(404, "PRODUCT_IMAGE_NOT_FOUND");
    await client.query(`UPDATE product_media SET removed_at = now() WHERE id = $1`, [current.rows[0].id]);
    await client.query(
      `UPDATE media_assets SET status = 'REMOVED', removed_at = now() WHERE id = $1`,
      [mediaId],
    );
    return Object.freeze({
      productId: product.id,
      target: Object.freeze({ productId: product.id, mediaId }),
      before: Object.freeze({ mediaId }),
      after: null,
    });
  }

  if (command.type === "AttachEvidence") {
    const productId = optionalText(payload.productId, "INVALID_PRODUCT_ID", 128);
    const lotId = optionalText(payload.lotId, "INVALID_LOT_ID", 128);
    if (!productId && !lotId) throw rejection(400, "EVIDENCE_SCOPE_REQUIRED");
    let resolvedProductId = productId;
    if (productId) {
      const product = await findProductRow(client, { productId, lock: true });
      resolvedProductId = product.id;
    }
    if (lotId) {
      const lot = await client.query(
        `SELECT v.product_id
           FROM inventory_lots lot
           JOIN skus s ON s.id = lot.sku_id
           JOIN product_variants v ON v.id = s.variant_id
          WHERE lot.id = $1 FOR UPDATE OF lot`,
        [lotId],
      );
      if (lot.rowCount === 0) throw rejection(404, "LOT_NOT_FOUND");
      if (resolvedProductId && resolvedProductId !== lot.rows[0].product_id) {
        throw rejection(409, "EVIDENCE_SCOPE_MISMATCH");
      }
      resolvedProductId = lot.rows[0].product_id;
    }
    const kind = requireText(payload.kind, "INVALID_EVIDENCE_KIND", 128).toUpperCase();
    const media = normalizeMedia(payload.media);
    await insertMedia(client, media, command.actor.id);
    const evidenceId = idFactory();
    await client.query(
      `INSERT INTO evidence_records
         (id, product_id, lot_id, media_id, kind, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [evidenceId, productId ?? null, lotId ?? null, media.id, kind, command.actor.id],
    );
    return Object.freeze({
      productId: resolvedProductId,
      evidenceId,
      target: Object.freeze({ productId: resolvedProductId, lotId: lotId ?? null, evidenceId }),
      before: null,
      after: Object.freeze({ evidenceId, kind, mediaId: media.id }),
    });
  }

  return null;
}

function normalizeReservationItems(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) {
    throw rejection(400, "INVALID_RESERVATION_ITEMS");
  }
  const combined = new Map();
  for (const raw of value) {
    const item = requireObject(raw, "INVALID_RESERVATION_ITEM");
    const sku = requireText(item.sku, "INVALID_SKU", 128);
    const quantity = requireInteger(item.quantity, "INVALID_RESERVATION_QUANTITY", {
      minimum: 1,
    });
    const next = (combined.get(sku) ?? 0) + quantity;
    if (!Number.isSafeInteger(next)) throw rejection(400, "INVALID_RESERVATION_QUANTITY");
    combined.set(sku, next);
  }
  return Object.freeze(
    [...combined.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([sku, quantity]) => Object.freeze({ sku, quantity })),
  );
}

async function handleReservationCommand(client, command, idFactory) {
  const payload = command.payload ?? {};

  if (command.type === "CreateReservation") {
    const reservationId =
      optionalText(payload.reservationId, "INVALID_RESERVATION_ID", 128) ?? idFactory();
    const items = normalizeReservationItems(payload.items);
    let expiresAt = null;
    if (payload.expiresAt !== undefined && payload.expiresAt !== null) {
      const parsed = new Date(payload.expiresAt);
      if (!Number.isFinite(parsed.valueOf()) || parsed <= new Date()) {
        throw rejection(400, "INVALID_RESERVATION_EXPIRY");
      }
      expiresAt = parsed.toISOString();
    }
    const lockedItems = [];
    for (const item of items) {
      const skuRow = await findSkuRow(client, item.sku, { lock: true });
      if (skuRow.status !== "ACTIVE") throw rejection(409, "SKU_ARCHIVED");
      const product = await findProductRow(client, {
        productId: skuRow.product_id,
        lock: true,
      });
      if (product.status !== "ACTIVE") throw rejection(409, "PRODUCT_ARCHIVED");
      const balance = await skuBalances(client, skuRow.id);
      if (balance.availableQuantity < item.quantity) {
        throw rejection(409, "INSUFFICIENT_AVAILABLE_INVENTORY");
      }
      lockedItems.push(Object.freeze({ ...item, skuId: skuRow.id, productId: skuRow.product_id }));
    }
    try {
      await client.query(
        `INSERT INTO inventory_reservations (id, expires_at, created_by)
         VALUES ($1, $2, $3)`,
        [reservationId, expiresAt, command.actor.id],
      );
    } catch (error) {
      if (error?.code === "23505") throw rejection(409, "RESERVATION_ALREADY_EXISTS");
      throw error;
    }
    for (const item of lockedItems) {
      await client.query(
        `INSERT INTO inventory_reservation_items (reservation_id, sku_id, quantity)
         VALUES ($1, $2, $3)`,
        [reservationId, item.skuId, item.quantity],
      );
      await client.query(
        `INSERT INTO inventory_ledger
           (id, sku_id, reservation_id, event_type, quantity_delta, reserved_delta,
            reason, actor_id, command_id)
         VALUES ($1, $2, $3, 'RESERVATION_CREATED', 0, $4, $5, $6, $7)`,
        [
          idFactory(),
          item.skuId,
          reservationId,
          item.quantity,
          command.reason,
          command.actor.id,
          command.commandId,
        ],
      );
    }
    return Object.freeze({
      reservationId,
      target: Object.freeze({
        reservationId,
        productIds: Object.freeze([...new Set(lockedItems.map((item) => item.productId))]),
      }),
      before: null,
      after: Object.freeze({ status: "ACTIVE", expiresAt, items }),
    });
  }

  if (command.type === "CommitReservation" || command.type === "ReleaseReservation") {
    const reservationId = requireText(payload.reservationId, "INVALID_RESERVATION_ID", 128);
    const locked = await client.query(
      `SELECT * FROM inventory_reservations WHERE id = $1 FOR UPDATE`,
      [reservationId],
    );
    if (locked.rowCount === 0) throw rejection(404, "RESERVATION_NOT_FOUND");
    const reservation = locked.rows[0];
    if (reservation.status !== "ACTIVE") {
      throw rejection(409, "RESERVATION_NOT_ACTIVE");
    }
    if (
      command.type === "CommitReservation" &&
      reservation.expires_at !== null &&
      new Date(reservation.expires_at) <= new Date()
    ) {
      throw rejection(409, "RESERVATION_EXPIRED");
    }
    const itemResult = await client.query(
      `SELECT ri.sku_id, ri.quantity, s.code AS sku, v.product_id
         FROM inventory_reservation_items ri
         JOIN skus s ON s.id = ri.sku_id
         JOIN product_variants v ON v.id = s.variant_id
        WHERE ri.reservation_id = $1
        ORDER BY s.code`,
      [reservationId],
    );
    for (const item of itemResult.rows) {
      await client.query(`SELECT id FROM skus WHERE id = $1 FOR UPDATE`, [item.sku_id]);
    }
    const committing = command.type === "CommitReservation";
    const allocations = [];
    for (const item of itemResult.rows) {
      const quantity = safeInteger(item.quantity);
      const ledgerId = idFactory();
      await client.query(
        `INSERT INTO inventory_ledger
           (id, sku_id, reservation_id, event_type, quantity_delta, reserved_delta,
            reason, actor_id, command_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          ledgerId,
          item.sku_id,
          reservationId,
          committing ? "RESERVATION_COMMITTED" : "RESERVATION_RELEASED",
          committing ? -quantity : 0,
          -quantity,
          command.reason,
          command.actor.id,
          command.commandId,
        ],
      );
      if (committing) {
        allocations.push(
          ...(await consumeLots(client, {
            skuId: item.sku_id,
            quantity,
            reservationId,
            ledgerId,
            consumptionType: "ORDER_COMMIT",
            idFactory,
          })),
        );
      }
    }
    await client.query(
      committing
        ? `UPDATE inventory_reservations
              SET status = 'COMMITTED', committed_at = now()
            WHERE id = $1`
        : `UPDATE inventory_reservations
              SET status = 'RELEASED', released_at = now()
            WHERE id = $1`,
      [reservationId],
    );
    return Object.freeze({
      reservationId,
      target: Object.freeze({
        reservationId,
        productIds: Object.freeze([...new Set(itemResult.rows.map((item) => item.product_id))]),
      }),
      before: Object.freeze({ status: "ACTIVE" }),
      after: Object.freeze({
        status: committing ? "COMMITTED" : "RELEASED",
        allocationCount: allocations.length,
      }),
    });
  }

  return null;
}

async function handlePublicationCommand(client, command) {
  if (command.type !== "PublishProduct" && command.type !== "UnpublishProduct") return null;
  const payload = command.payload ?? {};
  const product = await findProductRow(client, {
    productId: payload.productId,
    sku: payload.sku,
    lock: true,
  });
  const publishing = command.type === "PublishProduct";
  if (publishing) {
    if (product.status !== "ACTIVE") throw rejection(409, "PRODUCT_ARCHIVED");
    const readiness = await client.query(
      `SELECT count(*)::bigint AS active_skus,
              count(*) FILTER (WHERE amount_cents IS NOT NULL)::bigint AS priced_skus,
              count(*) FILTER (
                WHERE amount_cents IS NOT NULL AND available_quantity > 0
              )::bigint AS ready_skus
         FROM (
           SELECT s.id, rp.amount_cents,
                  COALESCE(sum(l.quantity_delta - l.reserved_delta), 0)::bigint
                    AS available_quantity
             FROM product_variants v
             JOIN skus s ON s.variant_id = v.id AND s.status = 'ACTIVE'
             LEFT JOIN retail_prices rp ON rp.sku_id = s.id
             LEFT JOIN inventory_ledger l ON l.sku_id = s.id
            WHERE v.product_id = $1 AND v.status = 'ACTIVE'
            GROUP BY s.id, rp.amount_cents
         ) ready`,
      [product.id],
    );
    const row = readiness.rows[0];
    if (safeInteger(row.active_skus) < 1) throw rejection(409, "ACTIVE_SKU_REQUIRED");
    if (safeInteger(row.priced_skus) < 1) throw rejection(409, "RETAIL_PRICE_REQUIRED");
    if (safeInteger(row.ready_skus) < 1) {
      throw rejection(409, "AVAILABLE_INVENTORY_REQUIRED");
    }
  }
  const publicationState = publishing ? "PUBLISHED" : "UNPUBLISHED";
  await client.query(
    `UPDATE products SET publication_state = $2, updated_at = now() WHERE id = $1`,
    [product.id, publicationState],
  );
  return Object.freeze({
    productId: product.id,
    target: Object.freeze({ productId: product.id }),
    before: Object.freeze({ publicationState: product.publication_state }),
    after: Object.freeze({ publicationState }),
  });
}

async function dispatchCommand(client, command, idFactory) {
  return (
    (await handleCatalogCommand(client, command, idFactory)) ??
    (await handleCommerceCommand(client, command, idFactory)) ??
    (await handleMediaCommand(client, command, idFactory)) ??
    (await handleReservationCommand(client, command, idFactory)) ??
    (await handlePublicationCommand(client, command))
  );
}

async function readSafeMediaWith(queryable, mediaId) {
  const result = await queryable.query(
    `SELECT id AS media_id, filename, content_type, byte_length, checksum
       FROM media_assets WHERE id = $1`,
    [mediaId],
  );
  if (result.rowCount === 0) return null;
  const row = result.rows[0];
  return Object.freeze({
    ...publicMediaReference(row),
    url: `/api/media/${encodeURIComponent(row.media_id)}`,
  });
}

async function readEvidenceWith(queryable, evidenceId) {
  const result = await queryable.query(
    `SELECT e.id, e.kind, e.product_id, e.lot_id, e.created_at, e.media_id
       FROM evidence_records e WHERE e.id = $1`,
    [evidenceId],
  );
  if (result.rowCount === 0) return null;
  const row = result.rows[0];
  return Object.freeze({
    id: row.id,
    kind: row.kind,
    productId: row.product_id,
    lotId: row.lot_id,
    createdAt: row.created_at,
    media: await readSafeMediaWith(queryable, row.media_id),
  });
}

function actorProjection(row) {
  return Object.freeze({
    id: row.id,
    subject: row.auth0_subject,
    role: row.role,
    status: row.status,
    lifecycleState: row.status,
    active: row.status === "ACTIVE",
    capabilities: Object.freeze([...(row.capabilities ?? [])]),
  });
}

function auditProjection(row) {
  return Object.freeze({
    id: row.id,
    sequence: safeInteger(row.sequence),
    commandId: row.command_id,
    idempotencyKey: row.idempotency_key,
    correlationId: row.correlation_id,
    occurredAt: row.occurred_at,
    action: row.action,
    actorId: row.actor_id,
    capability: row.capability,
    reason: row.reason,
    target: Object.freeze({ ...(row.target ?? {}) }),
    priorVersion: nullableSafeInteger(row.prior_version),
    resultVersion: nullableSafeInteger(row.result_version),
    before: row.before_state,
    after: row.after_state,
    result: row.result,
  });
}

async function requireDatabaseActor(client, actor, capability) {
  if (!hasCapability(actor, capability)) throw rejection(403, "FORBIDDEN");
  const result = await client.query(
    `SELECT id, auth0_subject, role, status, capabilities
       FROM admin_actors WHERE id = $1 AND status = 'ACTIVE' FOR SHARE`,
    [actor.id],
  );
  if (result.rowCount === 0 || !result.rows[0].capabilities.includes(capability)) {
    throw rejection(403, "FORBIDDEN");
  }
  return actorProjection(result.rows[0]);
}

function schemaStateError(code, details = {}) {
  const error = new Error(code);
  error.code = code;
  Object.assign(error, details);
  return error;
}

export async function verifyDay1AdminSchema({ queryable, pool } = {}) {
  const database = queryable ?? pool;
  if (!database || typeof database.query !== "function") {
    throw new Error("POSTGRES_POOL_REQUIRED");
  }

  const markerTable = await database.query(
    `SELECT to_regclass('public.admin_schema_migrations') AS relation`,
  );
  if (!markerTable.rows?.[0]?.relation) {
    throw schemaStateError("POSTGRES_MIGRATION_STATE_MISSING");
  }

  const marker = await database.query(
    `SELECT version, name, revision
       FROM public.admin_schema_migrations
      WHERE version = $1`,
    [DAY1_ADMIN_MIGRATION.version],
  );
  if (marker.rowCount !== 1) {
    throw schemaStateError("POSTGRES_MIGRATION_STATE_MISSING");
  }
  const applied = marker.rows[0];
  if (
    Number(applied.version) !== DAY1_ADMIN_MIGRATION.version ||
    applied.name !== DAY1_ADMIN_MIGRATION.name ||
    applied.revision !== DAY1_ADMIN_MIGRATION.revision
  ) {
    throw schemaStateError("POSTGRES_MIGRATION_STATE_CONFLICT");
  }

  const missingTablesResult = await database.query(
    `SELECT required.name
       FROM unnest($1::text[]) AS required(name)
      WHERE NOT EXISTS (
        SELECT 1
          FROM pg_class
          JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
         WHERE pg_class.relname = required.name
           AND pg_class.relkind IN ('r', 'p')
           AND pg_namespace.nspname = 'public'
      )
      ORDER BY required.name`,
    [DAY1_ADMIN_SCHEMA_TABLES],
  );
  const missingTables = (missingTablesResult.rows ?? []).map((row) => row.name);

  const missingTriggersResult = await database.query(
    `SELECT required.name
       FROM unnest($1::text[], $2::text[]) AS required(name, relation_name)
      WHERE NOT EXISTS (
        SELECT 1
          FROM pg_trigger
          JOIN pg_class ON pg_class.oid = pg_trigger.tgrelid
          JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
          JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
          JOIN pg_namespace AS function_namespace
            ON function_namespace.oid = pg_proc.pronamespace
         WHERE tgname = required.name
           AND pg_class.relname = required.relation_name
           AND pg_namespace.nspname = 'public'
           AND NOT tgisinternal
           AND tgenabled IN ('O', 'A')
           AND tgtype = 27
           AND pg_proc.proname = 'reject_immutable_commerce_row_mutation'
           AND function_namespace.nspname = 'public'
      )
      ORDER BY required.name`,
    [
      DAY1_ADMIN_IMMUTABLE_TRIGGERS.map((trigger) => trigger.name),
      DAY1_ADMIN_IMMUTABLE_TRIGGERS.map((trigger) => trigger.table),
    ],
  );
  const missingTriggers = (missingTriggersResult.rows ?? []).map((row) => row.name);

  if (missingTables.length > 0 || missingTriggers.length > 0) {
    throw schemaStateError("POSTGRES_SCHEMA_DRIFT", {
      missingTables: Object.freeze(missingTables),
      missingTriggers: Object.freeze(missingTriggers),
    });
  }

  return Object.freeze({
    migration: DAY1_ADMIN_MIGRATION,
    missingTables: Object.freeze([]),
    missingTriggers: Object.freeze([]),
  });
}

export async function runDay1AdminMigrations({ pool } = {}) {
  if (!pool || typeof pool.query !== "function") throw new Error("POSTGRES_POOL_REQUIRED");

  try {
    const state = await verifyDay1AdminSchema({ pool });
    return Object.freeze({ applied: false, ...state });
  } catch (error) {
    if (error?.code !== "POSTGRES_MIGRATION_STATE_MISSING") throw error;
  }

  const sql = await readFile(MIGRATION_URL, "utf8");
  await pool.query({ text: sql, query_timeout: 75_000 });
  const state = await verifyDay1AdminSchema({ pool });
  return Object.freeze({ applied: true, ...state });
}

export function createPostgresCommerceStore({
  pool,
  idFactory = randomUUID,
  ownsPool = false,
} = {}) {
  if (!pool || typeof pool.query !== "function" || typeof pool.connect !== "function") {
    throw new Error("POSTGRES_POOL_REQUIRED");
  }
  if (typeof idFactory !== "function") throw new Error("ID_FACTORY_REQUIRED");

  return Object.freeze({
    async executeAdminCommand(command = {}) {
      const expectedCapability = EXPECTED_CAPABILITY[command.type];
      if (!expectedCapability || command.capability !== expectedCapability) {
        throw rejection(403, "FORBIDDEN");
      }
      const idempotencyKey = requireText(
        command.idempotencyKey,
        "IDEMPOTENCY_KEY_REQUIRED",
        128,
      );
      if (idempotencyKey.length < 8) throw rejection(400, "IDEMPOTENCY_KEY_REQUIRED");
      const correlationId = requireText(command.correlationId, "COMMAND_CONTEXT_REQUIRED", 128);
      const reason = requireText(command.reason, "COMMAND_CONTEXT_REQUIRED", 1_024);
      const payload = requireObject(command.payload ?? {}, "INVALID_COMMAND_PAYLOAD");
      const commandFingerprint = fingerprint({ type: command.type, payload });

      return withTransaction(pool, async (client) => {
        const actor = await requireDatabaseActor(client, command.actor, expectedCapability);
        const commandId = idFactory();
        const inserted = await client.query(
          `INSERT INTO admin_commands
             (id, actor_id, idempotency_key, fingerprint, command_type, request_payload)
           VALUES ($1, $2, $3, $4, $5, $6::jsonb)
           ON CONFLICT (actor_id, idempotency_key) DO NOTHING
           RETURNING id`,
          [
            commandId,
            actor.id,
            idempotencyKey,
            commandFingerprint,
            command.type,
            JSON.stringify(payload),
          ],
        );
        if (inserted.rowCount === 0) {
          const existing = await client.query(
            `SELECT fingerprint, result FROM admin_commands
              WHERE actor_id = $1 AND idempotency_key = $2 FOR UPDATE`,
            [actor.id, idempotencyKey],
          );
          if (existing.rowCount === 0) throw rejection(409, "COMMAND_IN_PROGRESS");
          if (existing.rows[0].fingerprint !== commandFingerprint) {
            throw rejection(409, "IDEMPOTENCY_KEY_REUSED");
          }
          if (existing.rows[0].result === null) throw rejection(409, "COMMAND_IN_PROGRESS");
          return Object.freeze(existing.rows[0].result);
        }

        const normalizedCommand = Object.freeze({
          ...command,
          actor,
          payload: Object.freeze({ ...payload }),
          idempotencyKey,
          correlationId,
          reason,
          commandId,
        });
        const mutation = await dispatchCommand(client, normalizedCommand, idFactory);
        if (!mutation) throw rejection(400, "UNKNOWN_COMMAND");

        let priorVersion = null;
        let resultVersion = null;
        if (mutation.productId) {
          const versionResult = await client.query(
            `UPDATE products
                SET version = version + 1, updated_at = now()
              WHERE id = $1
              RETURNING version`,
            [mutation.productId],
          );
          resultVersion = safeInteger(versionResult.rows[0].version);
          priorVersion = resultVersion - 1;
        }

        const auditId = idFactory();
        const auditInsert = await client.query(
          `INSERT INTO audit_records
             (id, command_id, idempotency_key, correlation_id, actor_id,
              action, capability, reason, target, prior_version, result_version,
              before_state, after_state)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11,
                   $12::jsonb, $13::jsonb)
           RETURNING *`,
          [
            auditId,
            commandId,
            idempotencyKey,
            correlationId,
            actor.id,
            command.type,
            expectedCapability,
            reason,
            JSON.stringify(mutation.target),
            priorVersion,
            resultVersion,
            mutation.before === null ? null : JSON.stringify(mutation.before),
            mutation.after === null ? null : JSON.stringify(mutation.after),
          ],
        );
        const auditRecord = auditProjection(auditInsert.rows[0]);
        const result = {
          auditRecord,
          outcome: mutation.after,
        };
        if (mutation.productId) {
          result.product = await readAdminProductWith(client, { productId: mutation.productId });
        }
        if (mutation.supplierId) {
          result.supplier = await readSupplierWith(client, mutation.supplierId);
        }
        if (mutation.reservationId) {
          result.reservation = await readReservationWith(client, mutation.reservationId);
        }
        if (mutation.mediaId) {
          result.media = await readSafeMediaWith(client, mutation.mediaId);
        }
        if (mutation.evidenceId) {
          result.evidence = await readEvidenceWith(client, mutation.evidenceId);
        }
        const frozenResult = Object.freeze(result);
        await client.query(
          `UPDATE admin_commands
              SET result = $2::jsonb, completed_at = now()
            WHERE id = $1`,
          [commandId, JSON.stringify(frozenResult)],
        );
        return frozenResult;
      });
    },

    async readAdminProduct({ sku, productId } = {}) {
      return readAdminProductWith(pool, { sku, productId });
    },

    async readAdminDashboard() {
      const [productsResult, supplierResult, reservationResult, auditResult] = await Promise.all([
        pool.query(`SELECT id FROM products ORDER BY updated_at DESC, id`),
        pool.query(`SELECT id FROM suppliers ORDER BY name, id`),
        pool.query(
          `SELECT id FROM inventory_reservations ORDER BY created_at DESC, id`,
        ),
        pool.query(`SELECT * FROM audit_records ORDER BY sequence DESC LIMIT 200`),
      ]);
      const products = await Promise.all(
        productsResult.rows.map((row) => readAdminProductWith(pool, { productId: row.id })),
      );
      const suppliers = await Promise.all(
        supplierResult.rows.map((row) => readSupplierWith(pool, row.id)),
      );
      const reservations = await Promise.all(
        reservationResult.rows.map((row) => readReservationWith(pool, row.id)),
      );
      const auditRecords = Object.freeze(auditResult.rows.map(auditProjection));
      return Object.freeze({
        products: Object.freeze(products),
        suppliers: Object.freeze(suppliers),
        reservations: Object.freeze(reservations),
        activeReservations: Object.freeze(
          reservations.filter((reservation) => reservation.status === "ACTIVE"),
        ),
        inventoryHistory: Object.freeze(
          products.flatMap((product) => product.inventoryHistory),
        ),
        auditRecords,
        auditCount: auditRecords.length,
      });
    },

    async readPublishedProducts({ sku } = {}) {
      const result = await pool.query(
        `SELECT DISTINCT p.id
           FROM products p
           JOIN product_variants v ON v.product_id = p.id
           JOIN skus s ON s.variant_id = v.id
          WHERE p.status = 'ACTIVE' AND p.publication_state = 'PUBLISHED'
            AND v.status = 'ACTIVE' AND s.status = 'ACTIVE'
            AND ($1::text IS NULL OR s.code = $1)
          ORDER BY p.id`,
        [sku ?? null],
      );
      const projections = await Promise.all(
        result.rows.map((row) => readAdminProductWith(pool, { productId: row.id })),
      );
      return Object.freeze(
        projections.map((product) => {
          if (product.legacyProjection === true && product.skus.length === 1) {
            return Object.freeze({
              id: product.id,
              name: product.name,
              sku: product.sku,
              retailPrice: product.retailPrice,
              availableQuantity: product.availableQuantity,
              images: product.images,
            });
          }
          return Object.freeze({
            id: product.id,
            name: product.name,
            description: product.description,
            division: product.division,
            publicationState: product.publicationState,
            variants: Object.freeze(
              product.variants
                .filter(
                  (variant) =>
                    variant.lifecycleState === "ACTIVE" &&
                    variant.skus.some(
                      (skuRecord) =>
                        skuRecord.lifecycleState === "ACTIVE" &&
                        skuRecord.retailPrice !== null,
                    ),
                )
                .map((variant) =>
                  Object.freeze({
                    id: variant.id,
                    name: variant.name,
                    attributes: variant.attributes,
                    skus: Object.freeze(
                      variant.skus
                        .filter(
                          (skuRecord) =>
                            skuRecord.lifecycleState === "ACTIVE" &&
                            skuRecord.retailPrice !== null,
                        )
                        .map((skuRecord) =>
                          Object.freeze({
                            id: skuRecord.id,
                            sku: skuRecord.sku,
                            retailPrice: skuRecord.retailPrice,
                            availableQuantity: skuRecord.availableQuantity,
                          }),
                        ),
                    ),
                  }),
                ),
            ),
            images: product.images,
          });
        }),
      );
    },

    async readAuditRecords({ limit = 200 } = {}) {
      const boundedLimit = Number.isSafeInteger(limit) ? Math.min(Math.max(limit, 1), 1_000) : 200;
      const result = await pool.query(
        `SELECT * FROM audit_records ORDER BY sequence DESC LIMIT $1`,
        [boundedLimit],
      );
      return Object.freeze(result.rows.map(auditProjection));
    },

    async readPublicMedia({ mediaId } = {}) {
      const id = requireText(mediaId, "INVALID_MEDIA_ID", 128);
      const result = await pool.query(
        `SELECT ma.id, ma.storage_key, ma.filename, ma.content_type,
                ma.byte_length, ma.checksum
           FROM media_assets ma
           JOIN product_media pm ON pm.media_id = ma.id
           JOIN products p ON p.id = pm.product_id
          WHERE ma.id = $1 AND ma.status = 'ACTIVE' AND pm.removed_at IS NULL
            AND p.status = 'ACTIVE' AND p.publication_state = 'PUBLISHED'`,
        [id],
      );
      if (result.rowCount === 0) return null;
      const row = result.rows[0];
      return Object.freeze({
        id: row.id,
        storageKey: row.storage_key,
        filename: row.filename,
        contentType: row.content_type,
        byteLength: safeInteger(row.byte_length),
        checksum: row.checksum,
      });
    },

    async readAdminMedia({ mediaId } = {}) {
      const id = requireText(mediaId, "INVALID_MEDIA_ID", 128);
      const result = await pool.query(
        `SELECT id, storage_key, filename, content_type, byte_length, checksum
           FROM media_assets WHERE id = $1 AND status = 'ACTIVE'`,
        [id],
      );
      if (result.rowCount === 0) return null;
      const row = result.rows[0];
      return Object.freeze({
        id: row.id,
        storageKey: row.storage_key,
        filename: row.filename,
        contentType: row.content_type,
        byteLength: safeInteger(row.byte_length),
        checksum: row.checksum,
      });
    },

    async resolveAdminActor({ subject, bootstrapSubject } = {}) {
      const auth0Subject = requireText(subject, "INVALID_AUTH0_SUBJECT", 512);
      const existing = await pool.query(
        `SELECT id, auth0_subject, role, status, capabilities
           FROM admin_actors WHERE auth0_subject = $1`,
        [auth0Subject],
      );
      if (existing.rowCount > 0) {
        return existing.rows[0].status === "ACTIVE" ? actorProjection(existing.rows[0]) : null;
      }
      if (
        typeof bootstrapSubject !== "string" ||
        bootstrapSubject.trim() === "" ||
        auth0Subject !== bootstrapSubject.trim()
      ) {
        return null;
      }
      return withTransaction(pool, async (client) => {
        await client.query(`SELECT pg_advisory_xact_lock(hashtext('blowin-smoke-admin-bootstrap'))`);
        const repeated = await client.query(
          `SELECT id, auth0_subject, role, status, capabilities
             FROM admin_actors WHERE auth0_subject = $1`,
          [auth0Subject],
        );
        if (repeated.rowCount > 0) {
          return repeated.rows[0].status === "ACTIVE" ? actorProjection(repeated.rows[0]) : null;
        }
        const count = await client.query(`SELECT count(*)::bigint AS count FROM admin_actors`);
        if (safeInteger(count.rows[0].count) !== 0) return null;
        const actorId = idFactory();
        const inserted = await client.query(
          `INSERT INTO admin_actors (id, auth0_subject, capabilities)
           VALUES ($1, $2, $3::text[])
           RETURNING id, auth0_subject, role, status, capabilities`,
          [actorId, auth0Subject, OWNER_CAPABILITIES],
        );
        await client.query(
          `INSERT INTO admin_security_events (id, actor_id, event_type)
           VALUES ($1, $2, 'ACTOR_BOOTSTRAPPED')`,
          [idFactory(), actorId],
        );
        return actorProjection(inserted.rows[0]);
      });
    },

    async createAdminDeviceEnrollmentGrant({
      actorId,
      sessionId,
      codeHash,
      expiresAt,
    } = {}) {
      const actor = requireText(actorId, "INVALID_ACTOR_ID", 128);
      const session = requireText(sessionId, "INVALID_SESSION_ID", 256);
      const hash = requireText(codeHash, "INVALID_DEVICE_ENROLLMENT_CODE", 64);
      if (!/^[a-f0-9]{64}$/.test(hash)) {
        throw rejection(400, "INVALID_DEVICE_ENROLLMENT_CODE");
      }
      const expiration = new Date(expiresAt);
      if (
        !Number.isFinite(expiration.valueOf()) ||
        expiration <= new Date() ||
        expiration > new Date(Date.now() + 15 * 60 * 1_000)
      ) {
        throw rejection(400, "INVALID_DEVICE_ENROLLMENT_EXPIRY");
      }
      return withTransaction(pool, async (client) => {
        const trustedSession = await client.query(
          `SELECT s.id
             FROM admin_sessions s
             JOIN admin_devices d ON d.id = s.device_id
             JOIN admin_actors a ON a.id = s.actor_id
            WHERE s.id = $1 AND s.actor_id = $2
              AND s.status = 'ACTIVE' AND s.expires_at > now()
              AND d.status = 'ACTIVE' AND a.status = 'ACTIVE'
            FOR SHARE OF s, d, a`,
          [session, actor],
        );
        if (trustedSession.rowCount === 0) throw rejection(403, "DEVICE_NOT_TRUSTED");
        const grantId = idFactory();
        await client.query(
          `INSERT INTO admin_device_enrollment_grants
             (id, actor_id, created_by_session, code_hash, expires_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [grantId, actor, session, hash, expiration.toISOString()],
        );
        await client.query(
          `INSERT INTO admin_security_events
             (id, actor_id, session_id, event_type)
           VALUES ($1, $2, $3, 'DEVICE_ENROLLMENT_GRANTED')`,
          [idFactory(), actor, session],
        );
        return Object.freeze({
          id: grantId,
          actorId: actor,
          expiresAt: expiration.toISOString(),
        });
      });
    },

    async registerAdminDevice({ deviceId, actorId, enrollmentCodeHash } = {}) {
      const id = requireText(deviceId, "INVALID_DEVICE_ID", 256);
      const actor = requireText(actorId, "INVALID_ACTOR_ID", 128);
      return withTransaction(pool, async (client) => {
        await client.query(
          `SELECT pg_advisory_xact_lock(hashtext($1))`,
          [`blowin-smoke-admin-device:${actor}`],
        );
        const activeActor = await client.query(
          `SELECT id FROM admin_actors WHERE id = $1 AND status = 'ACTIVE' FOR SHARE`,
          [actor],
        );
        if (activeActor.rowCount === 0) throw rejection(403, "FORBIDDEN");
        const existing = await client.query(
          `SELECT id, actor_id, status, created_at, last_verified_at
             FROM admin_devices WHERE id = $1 FOR UPDATE`,
          [id],
        );
        if (existing.rowCount > 0) {
          const row = existing.rows[0];
          if (row.actor_id !== actor || row.status !== "ACTIVE") {
            throw rejection(403, "DEVICE_NOT_TRUSTED");
          }
          const verified = await client.query(
            `UPDATE admin_devices SET last_verified_at = now()
              WHERE id = $1
              RETURNING id, actor_id, status, created_at, last_verified_at`,
            [id],
          );
          return Object.freeze({
            id: verified.rows[0].id,
            actorId: verified.rows[0].actor_id,
            status: verified.rows[0].status,
            createdAt: verified.rows[0].created_at,
            lastVerifiedAt: verified.rows[0].last_verified_at,
          });
        }
        const activeDeviceCount = await client.query(
          `SELECT count(*)::bigint AS count
             FROM admin_devices WHERE actor_id = $1 AND status = 'ACTIVE'`,
          [actor],
        );
        if (safeInteger(activeDeviceCount.rows[0].count) !== 0) {
          const hash = optionalText(
            enrollmentCodeHash,
            "INVALID_DEVICE_ENROLLMENT_CODE",
            64,
          );
          if (!hash || !/^[a-f0-9]{64}$/.test(hash)) {
            throw rejection(403, "DEVICE_ENROLLMENT_AUTHORIZATION_REQUIRED");
          }
          const grant = await client.query(
            `SELECT id
               FROM admin_device_enrollment_grants
              WHERE actor_id = $1 AND code_hash = $2
                AND consumed_at IS NULL AND expires_at > now()
              FOR UPDATE`,
            [actor, hash],
          );
          if (grant.rowCount === 0) {
            throw rejection(403, "DEVICE_ENROLLMENT_AUTHORIZATION_REQUIRED");
          }
          await client.query(
            `UPDATE admin_device_enrollment_grants
                SET consumed_at = now()
              WHERE id = $1`,
            [grant.rows[0].id],
          );
        }
        const inserted = await client.query(
          `INSERT INTO admin_devices (id, actor_id)
           VALUES ($1, $2)
           RETURNING id, actor_id, status, created_at, last_verified_at`,
          [id, actor],
        );
        await client.query(
          `INSERT INTO admin_security_events (id, actor_id, event_type)
           VALUES ($1, $2, 'DEVICE_ENROLLED')`,
          [idFactory(), actor],
        );
        return Object.freeze({
          id: inserted.rows[0].id,
          actorId: inserted.rows[0].actor_id,
          status: inserted.rows[0].status,
          createdAt: inserted.rows[0].created_at,
          lastVerifiedAt: inserted.rows[0].last_verified_at,
        });
      });
    },

    async listAdminDevices({ actorId } = {}) {
      const actor = requireText(actorId, "INVALID_ACTOR_ID", 128);
      const result = await pool.query(
        `SELECT id, actor_id, status, created_at, last_verified_at, revoked_at
           FROM admin_devices
          WHERE actor_id = $1
          ORDER BY created_at, id`,
        [actor],
      );
      return Object.freeze(
        result.rows.map((row) =>
          Object.freeze({
            id: row.id,
            actorId: row.actor_id,
            status: row.status,
            createdAt: row.created_at,
            lastVerifiedAt: row.last_verified_at,
            revokedAt: row.revoked_at,
          }),
        ),
      );
    },

    async readAdminDevice({ deviceId, actorId } = {}) {
      const id = requireText(deviceId, "INVALID_DEVICE_ID", 256);
      const actor = actorId === undefined
        ? null
        : requireText(actorId, "INVALID_ACTOR_ID", 128);
      const result = await pool.query(
        `SELECT id, actor_id, status, created_at, last_verified_at, revoked_at
           FROM admin_devices
          WHERE id = $1 AND ($2::text IS NULL OR actor_id = $2)`,
        [id, actor],
      );
      if (result.rowCount === 0 || result.rows[0].status !== "ACTIVE") return null;
      return Object.freeze({
        id: result.rows[0].id,
        actorId: result.rows[0].actor_id,
        status: result.rows[0].status,
        createdAt: result.rows[0].created_at,
        lastVerifiedAt: result.rows[0].last_verified_at,
      });
    },

    async revokeAdminDevice({ deviceId, actorId } = {}) {
      const id = requireText(deviceId, "INVALID_DEVICE_ID", 256);
      const actor = requireText(actorId, "INVALID_ACTOR_ID", 128);
      return withTransaction(pool, async (client) => {
        const updated = await client.query(
          `UPDATE admin_devices
              SET status = 'REVOKED', revoked_at = now()
            WHERE id = $1 AND actor_id = $2 AND status = 'ACTIVE'
            RETURNING id`,
          [id, actor],
        );
        if (updated.rowCount === 0) return false;
        await client.query(
          `UPDATE admin_sessions
              SET status = 'REVOKED', revoked_at = now()
            WHERE device_id = $1 AND status = 'ACTIVE'`,
          [id],
        );
        await client.query(
          `INSERT INTO admin_security_events (id, actor_id, event_type)
           VALUES ($1, $2, 'DEVICE_REVOKED')`,
          [idFactory(), actor],
        );
        return true;
      });
    },

    async createAdminSession({ sessionId, actorId, expiresAt, deviceId } = {}) {
      const id = optionalText(sessionId, "INVALID_SESSION_ID", 256) ?? idFactory();
      const actor = requireText(actorId, "INVALID_ACTOR_ID", 128);
      const device = requireText(deviceId, "INVALID_DEVICE_ID", 256);
      const expiration = new Date(expiresAt);
      if (!Number.isFinite(expiration.valueOf()) || expiration <= new Date()) {
        throw rejection(400, "INVALID_SESSION_EXPIRY");
      }
      return withTransaction(pool, async (client) => {
        const active = await client.query(
          `SELECT d.id
             FROM admin_devices d
             JOIN admin_actors a ON a.id = d.actor_id
            WHERE d.id = $1 AND d.actor_id = $2
              AND d.status = 'ACTIVE' AND a.status = 'ACTIVE'
            FOR SHARE OF d, a`,
          [device, actor],
        );
        if (active.rowCount === 0) throw rejection(403, "DEVICE_NOT_TRUSTED");
        await client.query(
          `INSERT INTO admin_sessions (id, actor_id, device_id, expires_at)
           VALUES ($1, $2, $3, $4)`,
          [id, actor, device, expiration.toISOString()],
        );
        await client.query(
          `INSERT INTO admin_security_events (id, actor_id, session_id, event_type)
           VALUES ($1, $2, $3, 'SESSION_CREATED')`,
          [idFactory(), actor, id],
        );
        return Object.freeze({
          id,
          actorId: actor,
          deviceId: device,
          status: "ACTIVE",
          expiresAt: expiration.toISOString(),
        });
      });
    },

    async readAdminSession(input = {}) {
      const sessionId = requireText(
        typeof input === "string" ? input : input.sessionId,
        "INVALID_SESSION_ID",
        256,
      );
      const result = await pool.query(
        `SELECT s.id, s.actor_id, s.device_id, s.status, s.expires_at,
                a.auth0_subject, a.role, a.status AS actor_status, a.capabilities,
                d.status AS device_status, d.actor_id AS device_actor_id
           FROM admin_sessions s
           JOIN admin_actors a ON a.id = s.actor_id
           JOIN admin_devices d ON d.id = s.device_id
          WHERE s.id = $1`,
        [sessionId],
      );
      if (result.rowCount === 0) return null;
      const row = result.rows[0];
      if (
        row.status !== "ACTIVE" ||
        row.actor_status !== "ACTIVE" ||
        row.device_status !== "ACTIVE" ||
        row.device_actor_id !== row.actor_id ||
        new Date(row.expires_at) <= new Date()
      ) {
        return null;
      }
      return Object.freeze({
        id: row.id,
        actorId: row.actor_id,
        deviceId: row.device_id,
        status: row.status,
        expiresAt: row.expires_at,
        actor: actorProjection({
          id: row.actor_id,
          auth0_subject: row.auth0_subject,
          role: row.role,
          status: row.actor_status,
          capabilities: row.capabilities,
        }),
      });
    },

    async revokeAdminSession(input = {}) {
      const sessionId = requireText(
        typeof input === "string" ? input : input.sessionId,
        "INVALID_SESSION_ID",
        256,
      );
      const actorId =
        typeof input === "string" || input.actorId === undefined
          ? null
          : requireText(input.actorId, "INVALID_ACTOR_ID", 128);
      return withTransaction(pool, async (client) => {
        const updated = await client.query(
          `UPDATE admin_sessions
              SET status = 'REVOKED', revoked_at = now()
            WHERE id = $1 AND status = 'ACTIVE'
              AND ($2::text IS NULL OR actor_id = $2)
            RETURNING actor_id`,
          [sessionId, actorId],
        );
        if (updated.rowCount === 0) return false;
        await client.query(
          `INSERT INTO admin_security_events (id, actor_id, session_id, event_type)
           VALUES ($1, $2, $3, 'SESSION_REVOKED')`,
          [idFactory(), updated.rows[0].actor_id, sessionId],
        );
        return true;
      });
    },

    async close() {
      if (ownsPool && typeof pool.end === "function") await pool.end();
    },
  });
}

function boundedPoolInteger(value, fallback, { minimum, maximum }) {
  if (value === undefined || value === null || value === "") return fallback;
  const normalized = String(value).trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error("POSTGRES_POOL_CONFIGURATION_INVALID");
  }
  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error("POSTGRES_POOL_CONFIGURATION_INVALID");
  }
  return parsed;
}

export function productionPostgresPoolOptions({ databaseUrl, env = process.env } = {}) {
  const connectionString = databaseUrl ?? env.DATABASE_URL;
  if (typeof connectionString !== "string" || connectionString.trim() === "") {
    throw new Error("DATABASE_BOUNDARY_UNBOUND");
  }

  let url;
  try {
    url = new URL(connectionString.trim());
  } catch {
    throw new Error("DATABASE_URL_INVALID");
  }
  if (!new Set(["postgres:", "postgresql:"]).has(url.protocol)) {
    throw new Error("DATABASE_URL_INVALID");
  }

  const sslModes = url.searchParams.getAll("sslmode").map((value) => value.toLowerCase());
  const sslValues = url.searchParams.getAll("ssl").map((value) => value.toLowerCase());
  const libpqCompatibility = url.searchParams
    .getAll("uselibpqcompat")
    .map((value) => value.toLowerCase());
  const strongSslMode =
    sslModes.length === 1 &&
    new Set(["require", "verify-ca", "verify-full"]).has(sslModes[0]) &&
    sslValues.length === 0;
  const unambiguousSslFlag =
    sslValues.length === 1 && sslValues[0] === "true" && sslModes.length === 0;
  if (
    (!strongSslMode && !unambiguousSslFlag) ||
    libpqCompatibility.includes("true")
  ) {
    throw new Error("DATABASE_TLS_REQUIRED");
  }

  return Object.freeze({
    connectionString: connectionString.trim(),
    max: boundedPoolInteger(env.POSTGRES_POOL_MAX, 2, { minimum: 1, maximum: 5 }),
    connectionTimeoutMillis: boundedPoolInteger(
      env.POSTGRES_CONNECTION_TIMEOUT_MS,
      5_000,
      { minimum: 1_000, maximum: 30_000 },
    ),
    idleTimeoutMillis: boundedPoolInteger(env.POSTGRES_IDLE_TIMEOUT_MS, 10_000, {
      minimum: 1_000,
      maximum: 60_000,
    }),
    query_timeout: boundedPoolInteger(env.POSTGRES_QUERY_TIMEOUT_MS, 10_000, {
      minimum: 1_000,
      maximum: 60_000,
    }),
    allowExitOnIdle: true,
    application_name: "blowin-smoke-admin",
  });
}

export async function createProductionPostgresPool({
  databaseUrl,
  env = process.env,
  pgModule,
} = {}) {
  const pg = pgModule ?? (await import("pg"));
  const Pool = pg.Pool ?? pg.default?.Pool;
  if (typeof Pool !== "function") throw new Error("POSTGRES_DRIVER_UNAVAILABLE");
  return new Pool(productionPostgresPoolOptions({ databaseUrl, env }));
}

export async function createProductionPostgresStore({
  pool,
  databaseUrl,
  env = process.env,
  pgModule,
  migrate = false,
  verifySchema = false,
} = {}) {
  let resolvedPool = pool;
  let ownsPool = false;
  if (!resolvedPool) {
    resolvedPool = await createProductionPostgresPool({ databaseUrl, env, pgModule });
    ownsPool = true;
  }
  try {
    if (migrate) {
      await runDay1AdminMigrations({ pool: resolvedPool });
    } else if (verifySchema) {
      await verifyDay1AdminSchema({ pool: resolvedPool });
    }
    return createPostgresCommerceStore({ pool: resolvedPool, ownsPool });
  } catch (error) {
    if (ownsPool && typeof resolvedPool?.end === "function") {
      try {
        await resolvedPool.end();
      } catch {
        // Preserve the migration/initialization failure.
      }
    }
    throw error;
  }
}

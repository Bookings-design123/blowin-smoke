BEGIN;

SELECT pg_advisory_xact_lock(hashtext('blowin-smoke-day1-admin-migration'));

CREATE TABLE IF NOT EXISTS admin_actors (
  id text PRIMARY KEY,
  auth0_subject text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'OWNER' CHECK (role IN ('OWNER')),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
  capabilities text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE TABLE IF NOT EXISTS admin_devices (
  id text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES admin_actors(id),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  last_verified_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX IF NOT EXISTS admin_devices_actor_status_idx
  ON admin_devices (actor_id, status);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES admin_actors(id),
  device_id text NOT NULL REFERENCES admin_devices(id),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'EXPIRED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_verified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_actor_status_idx
  ON admin_sessions (actor_id, status, expires_at);

CREATE TABLE IF NOT EXISTS admin_device_enrollment_grants (
  id text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES admin_actors(id),
  created_by_session text NOT NULL REFERENCES admin_sessions(id),
  code_hash text NOT NULL UNIQUE CHECK (code_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz
);

CREATE INDEX IF NOT EXISTS admin_device_enrollment_grants_actor_expiry_idx
  ON admin_device_enrollment_grants (actor_id, expires_at, consumed_at);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  description text NOT NULL DEFAULT '',
  division text NOT NULL CHECK (division IN ('THCA', 'VAPE_NICOTINE', 'GLASS_ACCESSORIES')),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  legacy_projection boolean NOT NULL DEFAULT false,
  publication_state text NOT NULL DEFAULT 'UNPUBLISHED'
    CHECK (publication_state IN ('UNPUBLISHED', 'PUBLISHED')),
  version bigint NOT NULL DEFAULT 0 CHECK (version >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE TABLE IF NOT EXISTS product_variants (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id),
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  attributes jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(attributes) = 'object'),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX IF NOT EXISTS product_variants_product_status_idx
  ON product_variants (product_id, status);

CREATE TABLE IF NOT EXISTS skus (
  id text PRIMARY KEY,
  variant_id text NOT NULL REFERENCES product_variants(id),
  code text NOT NULL UNIQUE CHECK (length(btrim(code)) > 0),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz
);

CREATE INDEX IF NOT EXISTS skus_variant_status_idx ON skus (variant_id, status);

CREATE TABLE IF NOT EXISTS retail_prices (
  sku_id text PRIMARY KEY REFERENCES skus(id),
  amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text NOT NULL REFERENCES admin_actors(id)
);

CREATE TABLE IF NOT EXISTS suppliers (
  id text PRIMARY KEY,
  name text NOT NULL CHECK (length(btrim(name)) > 0),
  code text NOT NULL UNIQUE CHECK (length(btrim(code)) > 0),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id text PRIMARY KEY,
  storage_key text NOT NULL UNIQUE CHECK (length(btrim(storage_key)) > 0),
  filename text NOT NULL CHECK (length(btrim(filename)) > 0),
  content_type text NOT NULL CHECK (length(btrim(content_type)) > 0),
  byte_length bigint NOT NULL CHECK (byte_length > 0),
  checksum text NOT NULL CHECK (length(btrim(checksum)) > 0),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REMOVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL REFERENCES admin_actors(id),
  removed_at timestamptz
);

CREATE TABLE IF NOT EXISTS product_media (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES products(id),
  media_id text NOT NULL REFERENCES media_assets(id),
  role text NOT NULL DEFAULT 'IDENTITY' CHECK (role IN ('IDENTITY')),
  position integer NOT NULL DEFAULT 0 CHECK (position >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  removed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS product_media_one_active_identity_idx
  ON product_media (product_id)
  WHERE removed_at IS NULL;

CREATE TABLE IF NOT EXISTS inventory_lots (
  id text PRIMARY KEY,
  sku_id text NOT NULL REFERENCES skus(id),
  supplier_id text REFERENCES suppliers(id),
  lot_code text NOT NULL CHECK (length(btrim(lot_code)) > 0),
  received_quantity bigint NOT NULL CHECK (received_quantity > 0),
  remaining_quantity bigint NOT NULL CHECK (remaining_quantity >= 0 AND remaining_quantity <= received_quantity),
  unit_cost_cents bigint NOT NULL CHECK (unit_cost_cents >= 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  received_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL REFERENCES admin_actors(id),
  UNIQUE (sku_id, lot_code)
);

CREATE TABLE IF NOT EXISTS evidence_records (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id),
  lot_id text REFERENCES inventory_lots(id),
  media_id text NOT NULL REFERENCES media_assets(id),
  kind text NOT NULL CHECK (length(btrim(kind)) > 0),
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REMOVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by text NOT NULL REFERENCES admin_actors(id),
  CHECK (product_id IS NOT NULL OR lot_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS evidence_product_idx ON evidence_records (product_id, status);
CREATE INDEX IF NOT EXISTS evidence_lot_idx ON evidence_records (lot_id, status);

CREATE TABLE IF NOT EXISTS inventory_reservations (
  id text PRIMARY KEY,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMMITTED', 'RELEASED')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  committed_at timestamptz,
  released_at timestamptz,
  created_by text NOT NULL REFERENCES admin_actors(id)
);

CREATE TABLE IF NOT EXISTS inventory_reservation_items (
  reservation_id text NOT NULL REFERENCES inventory_reservations(id),
  sku_id text NOT NULL REFERENCES skus(id),
  quantity bigint NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (reservation_id, sku_id)
);

CREATE TABLE IF NOT EXISTS inventory_ledger (
  sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id text NOT NULL UNIQUE,
  sku_id text NOT NULL REFERENCES skus(id),
  lot_id text REFERENCES inventory_lots(id),
  reservation_id text REFERENCES inventory_reservations(id),
  event_type text NOT NULL CHECK (event_type IN (
    'RECEIPT', 'ADJUSTMENT', 'RESERVATION_CREATED',
    'RESERVATION_COMMITTED', 'RESERVATION_RELEASED'
  )),
  quantity_delta bigint NOT NULL DEFAULT 0,
  reserved_delta bigint NOT NULL DEFAULT 0,
  disposition text NOT NULL DEFAULT 'SELLABLE' CHECK (disposition IN ('SELLABLE')),
  unit_cost_cents bigint CHECK (unit_cost_cents IS NULL OR unit_cost_cents >= 0),
  currency text CHECK (currency IS NULL OR currency ~ '^[A-Z]{3}$'),
  reason text NOT NULL CHECK (length(btrim(reason)) > 0),
  actor_id text NOT NULL REFERENCES admin_actors(id),
  command_id text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  CHECK (quantity_delta <> 0 OR reserved_delta <> 0)
);

CREATE INDEX IF NOT EXISTS inventory_ledger_sku_sequence_idx
  ON inventory_ledger (sku_id, sequence);
CREATE INDEX IF NOT EXISTS inventory_ledger_reservation_idx
  ON inventory_ledger (reservation_id, sequence);

CREATE TABLE IF NOT EXISTS inventory_consumptions (
  id text PRIMARY KEY,
  reservation_id text REFERENCES inventory_reservations(id),
  ledger_id text NOT NULL REFERENCES inventory_ledger(id),
  lot_id text NOT NULL REFERENCES inventory_lots(id),
  quantity bigint NOT NULL CHECK (quantity > 0),
  unit_cost_cents bigint NOT NULL CHECK (unit_cost_cents >= 0),
  currency text NOT NULL CHECK (currency ~ '^[A-Z]{3}$'),
  consumption_type text NOT NULL CHECK (consumption_type IN ('ORDER_COMMIT', 'ADJUSTMENT')),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_consumptions_reservation_idx
  ON inventory_consumptions (reservation_id);

CREATE TABLE IF NOT EXISTS admin_commands (
  id text PRIMARY KEY,
  actor_id text NOT NULL REFERENCES admin_actors(id),
  idempotency_key text NOT NULL,
  fingerprint text NOT NULL,
  command_type text NOT NULL,
  request_payload jsonb NOT NULL CHECK (jsonb_typeof(request_payload) = 'object'),
  result jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (actor_id, idempotency_key)
);

CREATE TABLE IF NOT EXISTS audit_records (
  sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id text NOT NULL UNIQUE,
  command_id text NOT NULL UNIQUE REFERENCES admin_commands(id),
  idempotency_key text NOT NULL,
  correlation_id text NOT NULL,
  actor_id text NOT NULL REFERENCES admin_actors(id),
  action text NOT NULL,
  capability text NOT NULL,
  reason text NOT NULL,
  target jsonb NOT NULL CHECK (jsonb_typeof(target) = 'object'),
  prior_version bigint,
  result_version bigint,
  before_state jsonb,
  after_state jsonb,
  result text NOT NULL DEFAULT 'COMMITTED' CHECK (result = 'COMMITTED'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_records_actor_sequence_idx
  ON audit_records (actor_id, sequence DESC);

CREATE TABLE IF NOT EXISTS admin_security_events (
  sequence bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id text NOT NULL UNIQUE,
  actor_id text REFERENCES admin_actors(id),
  session_id text,
  event_type text NOT NULL CHECK (event_type IN (
    'ACTOR_BOOTSTRAPPED', 'DEVICE_ENROLLMENT_GRANTED',
    'DEVICE_ENROLLED', 'DEVICE_REVOKED',
    'SESSION_CREATED', 'SESSION_REVOKED'
  )),
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION reject_immutable_commerce_row_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% is immutable', TG_TABLE_NAME USING ERRCODE = '55000';
END;
$$;

DROP TRIGGER IF EXISTS inventory_ledger_immutable ON inventory_ledger;
CREATE TRIGGER inventory_ledger_immutable
  BEFORE UPDATE OR DELETE ON inventory_ledger
  FOR EACH ROW EXECUTE FUNCTION reject_immutable_commerce_row_mutation();

DROP TRIGGER IF EXISTS inventory_consumptions_immutable ON inventory_consumptions;
CREATE TRIGGER inventory_consumptions_immutable
  BEFORE UPDATE OR DELETE ON inventory_consumptions
  FOR EACH ROW EXECUTE FUNCTION reject_immutable_commerce_row_mutation();

DROP TRIGGER IF EXISTS audit_records_immutable ON audit_records;
CREATE TRIGGER audit_records_immutable
  BEFORE UPDATE OR DELETE ON audit_records
  FOR EACH ROW EXECUTE FUNCTION reject_immutable_commerce_row_mutation();

DROP TRIGGER IF EXISTS admin_security_events_immutable ON admin_security_events;
CREATE TRIGGER admin_security_events_immutable
  BEFORE UPDATE OR DELETE ON admin_security_events
  FOR EACH ROW EXECUTE FUNCTION reject_immutable_commerce_row_mutation();

COMMIT;

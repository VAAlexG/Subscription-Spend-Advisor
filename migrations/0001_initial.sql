PRAGMA foreign_keys = ON;

CREATE TABLE firms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  primary_colour TEXT NOT NULL DEFAULT '#121212',
  accent_colour TEXT NOT NULL DEFAULT '#C08A2A',
  disclaimer TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  external_subject TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abn TEXT,
  gst_mode TEXT NOT NULL DEFAULT 'INCLUSIVE' CHECK (gst_mode IN ('INCLUSIVE','EXCLUSIVE')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX clients_firm_idx ON clients(firm_id);

CREATE TABLE memberships (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL REFERENCES firms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('FIRM_ADMIN','ADVISOR','CLIENT_ADMIN','CLIENT_CONTRIBUTOR','CLIENT_VIEWER')),
  UNIQUE(firm_id, user_id, client_id)
);

CREATE TABLE import_batches (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  mapping_json TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'CSV',
  imported_rows INTEGER NOT NULL DEFAULT 0,
  rejected_rows INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  import_id TEXT REFERENCES import_batches(id) ON DELETE SET NULL,
  source TEXT NOT NULL CHECK (source IN ('CSV','XERO','MANUAL')),
  provider_id TEXT,
  account_name TEXT,
  description TEXT NOT NULL,
  normalised_merchant TEXT NOT NULL,
  transaction_date TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  gst_cents INTEGER,
  source_fingerprint TEXT NOT NULL,
  original_row_json TEXT,
  UNIQUE(firm_id, client_id, source_fingerprint)
);
CREATE INDEX transactions_detection_idx ON transactions(firm_id, client_id, normalised_merchant, transaction_date);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  category TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  annual_cost_cents INTEGER NOT NULL,
  owner_name TEXT,
  renewal_date TEXT,
  notice_days INTEGER,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  public_notes TEXT,
  internal_notes TEXT
);
CREATE INDEX subscriptions_client_idx ON subscriptions(firm_id, client_id, status);

CREATE TABLE detection_candidates (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  merchant TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  median_interval_days INTEGER NOT NULL,
  amount_variation REAL NOT NULL,
  confidence_score REAL NOT NULL,
  annual_cost_cents INTEGER NOT NULL,
  transaction_ids_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','DISMISSED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX detection_candidates_client_idx ON detection_candidates(firm_id, client_id, status);

CREATE TABLE recommendations (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  subscription_id TEXT REFERENCES subscriptions(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  internal_notes TEXT,
  client_wording TEXT,
  confidence TEXT NOT NULL CHECK (confidence IN ('LOW','MEDIUM','HIGH')),
  estimated_saving_cents INTEGER NOT NULL,
  effort TEXT NOT NULL,
  assumptions_json TEXT NOT NULL,
  evidence_json TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'DRAFT',
  outcome TEXT NOT NULL DEFAULT 'ESTIMATED',
  verified_saving_cents INTEGER,
  approved_at TEXT,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX recommendations_client_idx ON recommendations(firm_id, client_id, state);

CREATE TABLE report_snapshots (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot_json TEXT NOT NULL,
  object_key TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, period_start, period_end, version)
);

CREATE TABLE data_connections (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_tenant_id TEXT,
  status TEXT NOT NULL,
  secret_reference TEXT,
  sync_cursor TEXT,
  last_synced_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  firm_id TEXT NOT NULL,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  actor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  summary_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX audit_client_idx ON audit_events(firm_id, client_id, created_at);

// Uses Node.js built-in SQLite (Node 22+) — no native compilation needed
const { DatabaseSync } = require('node:sqlite')
const path = require('path')

const db = new DatabaseSync(path.join(__dirname, 'jet2pay.sqlite'))

db.exec("PRAGMA journal_mode = WAL")
db.exec("PRAGMA foreign_keys = ON")

db.exec(`
  CREATE TABLE IF NOT EXISTS claims (
    id TEXT PRIMARY KEY,
    claim_token TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted',
    flight_type TEXT,
    departure_airport TEXT,
    arrival_airport TEXT,
    flight_number TEXT,
    flight_date TEXT,
    delay_duration TEXT,
    cancellation_reason TEXT,
    disruption_reason TEXT,
    airline TEXT,
    estimated_compensation INTEGER DEFAULT 0,
    consent_ec261 INTEGER DEFAULT 0,
    consent_assignment INTEGER DEFAULT 0,
    consent_marketing INTEGER DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    is_lead INTEGER NOT NULL DEFAULT 0,
    iban TEXT,
    bic TEXT,
    date_of_birth TEXT
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS timeline_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_id TEXT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK(direction IN ('outbound', 'inbound')),
    subject TEXT,
    body TEXT NOT NULL,
    from_email TEXT,
    to_email TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

module.exports = db

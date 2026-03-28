import Database from "better-sqlite3";

const sqlite = new Database("app-tracker.db");

// Create apps table
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS apps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    pricing_type TEXT NOT NULL DEFAULT 'free',
    subscription_plan TEXT,
    monthly_cost REAL,
    yearly_cost REAL,
    next_due_date TEXT,
    platforms TEXT NOT NULL DEFAULT '',
    category TEXT,
    tags TEXT NOT NULL DEFAULT '',
    release_date TEXT,
    status TEXT NOT NULL DEFAULT 'using',
    notes TEXT,
    created_at INTEGER,
    updated_at INTEGER
  )
`);

console.log("Database initialized successfully!");
sqlite.close();

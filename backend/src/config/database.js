const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const logger = require("../utils/logger");

const DB_PATH =
  process.env.DB_PATH || path.join(__dirname, "../../../data/productivity.db");

let db = null;

function getDb() {
  if (!db) {
    throw new Error("Database not initialised. Call connectDatabase() first.");
  }
  return db;
}

function connectDatabase() {
  try {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new DatabaseSync(DB_PATH);

    db.exec("PRAGMA journal_mode = WAL");
    db.exec("PRAGMA foreign_keys = ON");

    db.exec(`
      CREATE TABLE IF NOT EXISTS workers (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        worker_id   TEXT    NOT NULL UNIQUE,
        name        TEXT    NOT NULL,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS workstations (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        station_id  TEXT    NOT NULL UNIQUE,
        name        TEXT    NOT NULL,
        type        TEXT    NOT NULL,
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS ai_events (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp       TEXT    NOT NULL,
        worker_id       TEXT    NOT NULL,
        workstation_id  TEXT    NOT NULL,
        event_type      TEXT    NOT NULL CHECK(event_type IN ('working','idle','absent','product_count')),
        confidence      REAL    NOT NULL,
        count           INTEGER NOT NULL DEFAULT 0,
        event_hash      TEXT    NOT NULL UNIQUE,
        created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_events_worker    ON ai_events(worker_id, timestamp);
      CREATE INDEX IF NOT EXISTS idx_events_station   ON ai_events(workstation_id, timestamp);
      CREATE INDEX IF NOT EXISTS idx_events_timestamp ON ai_events(timestamp);
    `);

    logger.info("SQLite database connected", { path: DB_PATH });
    return db;
  } catch (error) {
    logger.error("SQLite connection error", { error });
    process.exit(1);
  }
}

function disconnectDatabase() {
  if (db) {
    db.close();
    db = null;
    logger.info("SQLite database closed");
  }
}

process.on("SIGINT", () => {
  disconnectDatabase();
  process.exit(0);
});

module.exports = { connectDatabase, disconnectDatabase, getDb };

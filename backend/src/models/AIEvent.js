const crypto = require("crypto");
const { getDb } = require("../config/database");

function generateEventHash(timestamp, worker_id, workstation_id, event_type) {
  const ts =
    timestamp instanceof Date ? timestamp.toISOString() : String(timestamp);
  const data = `${ts}_${worker_id}_${workstation_id}_${event_type}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

const AIEvent = {
  generateEventHash,

  create(event) {
    const ts =
      event.timestamp instanceof Date
        ? event.timestamp.toISOString()
        : String(event.timestamp);
    const hash =
      event.event_hash ||
      generateEventHash(
        ts,
        event.worker_id,
        event.workstation_id,
        event.event_type,
      );

    try {
      const stmt = getDb().prepare(
        "INSERT INTO ai_events (timestamp, worker_id, workstation_id, event_type, confidence, count, event_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
      );
      const info = stmt.run(
        ts,
        event.worker_id,
        event.workstation_id,
        event.event_type,
        event.confidence,
        event.count || 0,
        hash,
      );
      const rowId =
        typeof info.lastInsertRowid === "bigint"
          ? Number(info.lastInsertRowid)
          : info.lastInsertRowid;
      return getDb().prepare("SELECT * FROM ai_events WHERE id = ?").get(rowId);
    } catch (err) {
      if (err.message && err.message.includes("UNIQUE constraint failed")) {
        const dupErr = new Error("Duplicate event");
        dupErr.code = 11000;
        throw dupErr;
      }
      throw err;
    }
  },

  insertMany(events) {
    const db = getDb();
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO ai_events (timestamp, worker_id, workstation_id, event_type, confidence, count, event_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
    );

    let inserted = 0;
    db.exec("BEGIN");
    try {
      for (const e of events) {
        const ts =
          e.timestamp instanceof Date
            ? e.timestamp.toISOString()
            : String(e.timestamp);
        const hash =
          e.event_hash ||
          generateEventHash(ts, e.worker_id, e.workstation_id, e.event_type);
        const info = stmt.run(
          ts,
          e.worker_id,
          e.workstation_id,
          e.event_type,
          e.confidence,
          e.count || 0,
          hash,
        );
        if (info.changes) inserted++;
      }
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
    return inserted;
  },

  findByWorker(worker_id, minConfidence = 0.7) {
    return getDb()
      .prepare(
        "SELECT * FROM ai_events WHERE worker_id = ? AND confidence >= ? ORDER BY timestamp ASC",
      )
      .all(worker_id, minConfidence);
  },

  findByWorkstation(workstation_id, minConfidence = 0.7) {
    return getDb()
      .prepare(
        "SELECT * FROM ai_events WHERE workstation_id = ? AND confidence >= ? AND event_type IN ('working','idle','product_count') ORDER BY timestamp ASC",
      )
      .all(workstation_id, minConfidence);
  },

  deleteAll() {
    getDb().prepare("DELETE FROM ai_events").run();
  },
};

module.exports = AIEvent;

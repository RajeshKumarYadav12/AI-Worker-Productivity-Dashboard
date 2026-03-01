const { getDb } = require("../config/database");

const Worker = {
  findAll() {
    return getDb().prepare("SELECT * FROM workers ORDER BY worker_id").all();
  },

  findOne(worker_id) {
    return getDb()
      .prepare("SELECT * FROM workers WHERE worker_id = ?")
      .get(worker_id);
  },

  count() {
    return getDb().prepare("SELECT COUNT(*) as n FROM workers").get().n;
  },

  insertMany(workers) {
    const stmt = getDb().prepare(
      "INSERT OR IGNORE INTO workers (worker_id, name) VALUES (?, ?)",
    );
    for (const w of workers) stmt.run(w.worker_id, w.name);
  },

  deleteAll() {
    getDb().prepare("DELETE FROM workers").run();
  },
};

module.exports = Worker;

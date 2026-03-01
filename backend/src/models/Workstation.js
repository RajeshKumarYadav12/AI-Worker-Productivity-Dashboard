const { getDb } = require("../config/database");

const Workstation = {
  findAll() {
    return getDb()
      .prepare("SELECT * FROM workstations ORDER BY station_id")
      .all();
  },

  findOne(station_id) {
    return getDb()
      .prepare("SELECT * FROM workstations WHERE station_id = ?")
      .get(station_id);
  },

  count() {
    return getDb().prepare("SELECT COUNT(*) as n FROM workstations").get().n;
  },

  insertMany(workstations) {
    const stmt = getDb().prepare(
      "INSERT OR IGNORE INTO workstations (station_id, name, type) VALUES (?, ?, ?)",
    );
    for (const w of workstations) stmt.run(w.station_id, w.name, w.type);
  },

  deleteAll() {
    getDb().prepare("DELETE FROM workstations").run();
  },
};

module.exports = Workstation;

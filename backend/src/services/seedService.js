const Worker = require("../models/Worker");
const Workstation = require("../models/Workstation");
const AIEvent = require("../models/AIEvent");
const logger = require("../utils/logger");

const WORKERS = [
  { worker_id: "W001", name: "John Smith" },
  { worker_id: "W002", name: "Maria Garcia" },
  { worker_id: "W003", name: "Chen Wei" },
  { worker_id: "W004", name: "Priya Patel" },
  { worker_id: "W005", name: "Ahmed Hassan" },
  { worker_id: "W006", name: "Emma Johnson" },
];

const WORKSTATIONS = [
  { station_id: "WS001", name: "Assembly Line A", type: "Assembly" },
  { station_id: "WS002", name: "Assembly Line B", type: "Assembly" },
  { station_id: "WS003", name: "Quality Control 1", type: "QC" },
  { station_id: "WS004", name: "Packaging Station 1", type: "Packaging" },
  { station_id: "WS005", name: "Packaging Station 2", type: "Packaging" },
  { station_id: "WS006", name: "Inspection Booth", type: "Inspection" },
];

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateDummyEvents() {
  const rng = makeRng(42);
  const events = [];
  const now = new Date("2026-03-01T00:00:00Z");
  const DAYS_BACK = 7;

  for (let day = 0; day < DAYS_BACK; day++) {
    const dayDate = new Date(now);
    dayDate.setUTCDate(dayDate.getUTCDate() - day);

    for (const worker of WORKERS) {
      const stationIdx = (WORKERS.indexOf(worker) + day) % WORKSTATIONS.length;
      const station = WORKSTATIONS[stationIdx];

      let t = new Date(dayDate);
      t.setUTCHours(8 + Math.floor(rng() * 2), Math.floor(rng() * 60), 0, 0);

      const shiftHours = 6 + rng() * 2;
      const shiftEnd = new Date(t.getTime() + shiftHours * 3600 * 1000);

      while (t < shiftEnd) {
        const r = rng();
        const event_type = r < 0.7 ? "working" : r < 0.9 ? "idle" : "absent";

        events.push({
          timestamp: new Date(t),
          worker_id: worker.worker_id,
          workstation_id: station.station_id,
          event_type,
          confidence: 0.7 + rng() * 0.3,
          count: 0,
        });

        if (event_type === "working" && rng() > 0.5) {
          t = new Date(t.getTime() + (5 + rng() * 10) * 60 * 1000);
          events.push({
            timestamp: new Date(t),
            worker_id: worker.worker_id,
            workstation_id: station.station_id,
            event_type: "product_count",
            confidence: 0.8 + rng() * 0.2,
            count: Math.floor(rng() * 10) + 1,
          });
        }

        t = new Date(t.getTime() + (15 + rng() * 30) * 60 * 1000);
      }
    }
  }

  return events;
}

function seedDatabase() {
  try {
    logger.info("Starting database seed…");

    AIEvent.deleteAll();
    Worker.deleteAll();
    Workstation.deleteAll();

    Worker.insertMany(WORKERS);
    logger.info(`Inserted ${WORKERS.length} workers`);

    Workstation.insertMany(WORKSTATIONS);
    logger.info(`Inserted ${WORKSTATIONS.length} workstations`);

    const events = generateDummyEvents();
    const inserted = AIEvent.insertMany(events);
    logger.info(`Inserted ${inserted} / ${events.length} events`);

    logger.info("Database seed completed successfully");
  } catch (error) {
    logger.error("Error seeding database", { error });
    throw error;
  }
}

function seedIfEmpty() {
  try {
    const count = Worker.count();
    if (count === 0) {
      logger.info("Database is empty – running initial seed");
      seedDatabase();
    } else {
      logger.info(`Database already has ${count} workers – skipping auto-seed`);
    }
  } catch (error) {
    logger.error("Error in seedIfEmpty", { error });
  }
}

module.exports = { seedDatabase, seedIfEmpty };

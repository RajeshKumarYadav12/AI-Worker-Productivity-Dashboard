const { seedDatabase } = require("../services/seedService");
const logger = require("../utils/logger");

function seedDatabaseController(req, res) {
  try {
    seedDatabase();

    res.json({
      success: true,
      message:
        "Database seeded successfully with 6 workers, 6 workstations, and 7 days of events.",
    });
  } catch (error) {
    logger.error("Error seeding database", { error });
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

module.exports = {
  seedDatabaseController,
};

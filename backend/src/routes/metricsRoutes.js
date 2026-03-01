const express = require("express");
const {
  getWorkerMetricsController,
  getWorkstationMetricsController,
  getFactoryMetricsController,
} = require("../controllers/metricsController");

const router = express.Router();

router.get("/workers", getWorkerMetricsController);
router.get("/workstations", getWorkstationMetricsController);
router.get("/factory", getFactoryMetricsController);

module.exports = router;

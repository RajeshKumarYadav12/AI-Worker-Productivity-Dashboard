const {
  getWorkerMetrics,
  getWorkstationMetrics,
  getFactoryMetrics,
} = require("../services/metricsService");
const logger = require("../utils/logger");

function getWorkerMetricsController(req, res) {
  try {
    const { worker_id } = req.query;
    const metrics = getWorkerMetrics(worker_id);
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error("Error fetching worker metrics", { error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

function getWorkstationMetricsController(req, res) {
  try {
    const { station_id } = req.query;
    const metrics = getWorkstationMetrics(station_id);
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error("Error fetching workstation metrics", { error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

function getFactoryMetricsController(req, res) {
  try {
    const metrics = getFactoryMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error("Error fetching factory metrics", { error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = {
  getWorkerMetricsController,
  getWorkstationMetricsController,
  getFactoryMetricsController,
};

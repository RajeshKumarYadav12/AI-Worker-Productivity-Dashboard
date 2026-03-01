const AIEvent = require("../models/AIEvent");
const Worker = require("../models/Worker");
const Workstation = require("../models/Workstation");
const {
  getTimeDifferenceInHours,
  calculatePercentage,
} = require("../utils/timeUtils");
const logger = require("../utils/logger");

const MIN_CONFIDENCE = 0.7;
const MAX_GAP_HOURS = 8;

function computeWorkerMetrics(workerRow) {
  const events = AIEvent.findByWorker(workerRow.worker_id, MIN_CONFIDENCE);

  let totalActiveHours = 0;
  let totalIdleHours = 0;
  let totalUnitsProduced = 0;

  for (let i = 0; i < events.length; i++) {
    const curr = events[i];

    if (curr.event_type === "product_count") {
      totalUnitsProduced += curr.count || 0;
    }

    if (
      i > 0 &&
      (curr.event_type === "working" || curr.event_type === "idle")
    ) {
      const prev = events[i - 1];
      const diff = getTimeDifferenceInHours(
        new Date(prev.timestamp),
        new Date(curr.timestamp),
      );
      if (diff >= 0 && diff < MAX_GAP_HOURS) {
        if (prev.event_type === "working") totalActiveHours += diff;
        else if (prev.event_type === "idle") totalIdleHours += diff;
      }
    }
  }

  const totalHours = totalActiveHours + totalIdleHours;
  const utilizationPercentage =
    totalHours > 0 ? calculatePercentage(totalActiveHours, totalHours) : 0;
  const unitsPerHour =
    totalActiveHours > 0 ? totalUnitsProduced / totalActiveHours : 0;

  return {
    worker_id: workerRow.worker_id,
    worker_name: workerRow.name,
    total_active_hours: parseFloat(totalActiveHours.toFixed(2)),
    total_idle_hours: parseFloat(totalIdleHours.toFixed(2)),
    utilization_percentage: parseFloat(utilizationPercentage.toFixed(2)),
    total_units_produced: totalUnitsProduced,
    units_per_hour: parseFloat(unitsPerHour.toFixed(2)),
  };
}

function getWorkerMetrics(workerId) {
  try {
    let workers;
    if (workerId) {
      const w = Worker.findOne(workerId);
      workers = w ? [w] : [];
    } else {
      workers = Worker.findAll();
    }

    const metrics = workers.map(computeWorkerMetrics);
    logger.info("Worker metrics computed", { count: metrics.length });
    return metrics;
  } catch (error) {
    logger.error("Error computing worker metrics", { error });
    throw error;
  }
}

function computeWorkstationMetrics(stationRow) {
  const events = AIEvent.findByWorkstation(
    stationRow.station_id,
    MIN_CONFIDENCE,
  );

  let occupancyHours = 0;
  let activeHours = 0;
  let totalUnitsProduced = 0;

  for (let i = 0; i < events.length; i++) {
    const curr = events[i];

    if (curr.event_type === "product_count") {
      totalUnitsProduced += curr.count || 0;
    }

    if (
      i > 0 &&
      (curr.event_type === "working" || curr.event_type === "idle")
    ) {
      const prev = events[i - 1];
      const diff = getTimeDifferenceInHours(
        new Date(prev.timestamp),
        new Date(curr.timestamp),
      );
      if (diff >= 0 && diff < MAX_GAP_HOURS) {
        if (prev.event_type === "working" || prev.event_type === "idle") {
          occupancyHours += diff;
        }
        if (prev.event_type === "working") {
          activeHours += diff;
        }
      }
    }
  }

  const utilizationPercentage =
    occupancyHours > 0 ? calculatePercentage(activeHours, occupancyHours) : 0;
  const throughputRate =
    occupancyHours > 0 ? totalUnitsProduced / occupancyHours : 0;

  return {
    station_id: stationRow.station_id,
    station_name: stationRow.name,
    occupancy_hours: parseFloat(occupancyHours.toFixed(2)),
    utilization_percentage: parseFloat(utilizationPercentage.toFixed(2)),
    total_units_produced: totalUnitsProduced,
    throughput_rate: parseFloat(throughputRate.toFixed(2)),
  };
}

function getWorkstationMetrics(stationId) {
  try {
    let stations;
    if (stationId) {
      const s = Workstation.findOne(stationId);
      stations = s ? [s] : [];
    } else {
      stations = Workstation.findAll();
    }

    const metrics = stations.map(computeWorkstationMetrics);
    logger.info("Workstation metrics computed", { count: metrics.length });
    return metrics;
  } catch (error) {
    logger.error("Error computing workstation metrics", { error });
    throw error;
  }
}

function getFactoryMetrics() {
  try {
    const workerMetrics = getWorkerMetrics();
    const totalWorkers = Worker.count();
    const totalWorkstations = Workstation.count();

    const totalProductiveHours = workerMetrics.reduce(
      (s, w) => s + w.total_active_hours,
      0,
    );
    const totalProductionCount = workerMetrics.reduce(
      (s, w) => s + w.total_units_produced,
      0,
    );
    const avgProductionRate =
      totalProductiveHours > 0
        ? totalProductionCount / totalProductiveHours
        : 0;
    const avgUtilization =
      workerMetrics.length > 0
        ? workerMetrics.reduce((s, w) => s + w.utilization_percentage, 0) /
          workerMetrics.length
        : 0;
    const activeWorkers = workerMetrics.filter(
      (w) => w.total_active_hours > 0,
    ).length;

    logger.info("Factory metrics computed");

    return {
      total_productive_hours: parseFloat(totalProductiveHours.toFixed(2)),
      total_production_count: totalProductionCount,
      average_production_rate: parseFloat(avgProductionRate.toFixed(2)),
      average_utilization_percentage: parseFloat(avgUtilization.toFixed(2)),
      total_workers: totalWorkers,
      total_workstations: totalWorkstations,
      active_workers: activeWorkers,
    };
  } catch (error) {
    logger.error("Error computing factory metrics", { error });
    throw error;
  }
}

module.exports = { getWorkerMetrics, getWorkstationMetrics, getFactoryMetrics };

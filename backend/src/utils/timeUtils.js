function getTimeDifferenceInHours(start, end) {
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60);
}

function getTimeDifferenceInMinutes(start, end) {
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60);
}

function getTimeDifferenceInSeconds(start, end) {
  const diffMs = end.getTime() - start.getTime();
  return diffMs / 1000;
}

function sortEventsByTimestamp(events) {
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

function filterByConfidence(events, minConfidence = 0.7) {
  return events.filter((event) => event.confidence >= minConfidence);
}

function getDateRange(date) {
  const targetDate = date || new Date();
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return (value / total) * 100;
}

module.exports = {
  getTimeDifferenceInHours,
  getTimeDifferenceInMinutes,
  getTimeDifferenceInSeconds,
  sortEventsByTimestamp,
  filterByConfidence,
  getDateRange,
  calculatePercentage,
};

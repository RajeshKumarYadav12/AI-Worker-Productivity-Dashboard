const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error("Error occurred", {
    statusCode,
    message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
}

module.exports = { errorHandler, notFoundHandler };

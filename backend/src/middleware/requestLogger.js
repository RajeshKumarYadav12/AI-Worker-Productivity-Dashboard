const logger = require("../utils/logger");

function requestLogger(req, res, next) {
  const start = Date.now();

  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}

module.exports = { requestLogger };

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { connectDatabase } = require("./src/config/database");
const { seedIfEmpty } = require("./src/services/seedService");
const logger = require("./src/utils/logger");
const { requestLogger } = require("./src/middleware/requestLogger");
const {
  errorHandler,
  notFoundHandler,
} = require("./src/middleware/errorHandler");

const eventRoutes = require("./src/routes/eventRoutes");
const metricsRoutes = require("./src/routes/metricsRoutes");
const seedRoutes = require("./src/routes/seedRoutes");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Worker Productivity Dashboard API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      events: "/api/events",
      metrics: "/api/metrics/factory",
      workers: "/api/metrics/workers",
      workstations: "/api/metrics/workstations",
      seed: "/api/seed",
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

app.use("/api/events", eventRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/seed", seedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

function startServer() {
  try {
    connectDatabase();
    seedIfEmpty();
    app.listen(PORT, () => {
      logger.info(`Server started`, { port: PORT, environment: NODE_ENV });
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
}

startServer();

module.exports = app;

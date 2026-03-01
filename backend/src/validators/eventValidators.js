const { z } = require("zod");

const createEventSchema = z.object({
  timestamp: z.string().datetime().or(z.date()),
  worker_id: z.string().min(1, "Worker ID is required"),
  workstation_id: z.string().min(1, "Workstation ID is required"),
  event_type: z.enum(["working", "idle", "absent", "product_count"]),
  confidence: z.number().min(0).max(1),
  count: z.number().int().nonnegative().optional(),
});

const metricsQuerySchema = z.object({
  worker_id: z.string().optional(),
  workstation_id: z.string().optional(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
});

module.exports = {
  createEventSchema,
  metricsQuerySchema,
};

const AIEvent = require("../models/AIEvent");
const { createEventSchema } = require("../validators/eventValidators");
const logger = require("../utils/logger");
const { z } = require("zod");

function createEvent(req, res) {
  try {
    const validatedData = createEventSchema.parse(req.body);
    const event = AIEvent.create(validatedData);

    logger.info("Event created", { event_id: event.id });
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    if (error.name === "ZodError") {
      logger.warn("Validation error", { errors: error.errors });
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }
    if (error.code === 11000) {
      logger.warn("Duplicate event detected");
      return res.status(409).json({ success: false, error: "Duplicate event" });
    }
    logger.error("Error creating event", { error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

function createBatchEvents(req, res) {
  try {
    const { events } = req.body;

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body must contain a non-empty "events" array',
      });
    }

    const eventsSchema = z.array(createEventSchema);
    const validatedEvents = eventsSchema.parse(events);

    const inserted = AIEvent.insertMany(validatedEvents);
    const duplicates = validatedEvents.length - inserted;

    logger.info("Batch events created", { inserted, duplicates });
    res.status(201).json({
      success: true,
      data: { inserted, duplicates, total: events.length },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      logger.warn("Validation error in batch", { errors: error.errors });
      return res.status(400).json({
        success: false,
        error: "Validation error",
        details: error.errors,
      });
    }
    logger.error("Error creating batch events", { error });
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

module.exports = { createEvent, createBatchEvents };

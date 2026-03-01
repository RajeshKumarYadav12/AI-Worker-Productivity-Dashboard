const express = require("express");
const {
  createEvent,
  createBatchEvents,
} = require("../controllers/eventController");

const router = express.Router();

router.post("/", createEvent);
router.post("/batch", createBatchEvents);

module.exports = router;

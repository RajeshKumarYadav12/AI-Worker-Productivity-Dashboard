const express = require("express");
const { seedDatabaseController } = require("../controllers/seedController");

const router = express.Router();

router.post("/", seedDatabaseController);

module.exports = router;

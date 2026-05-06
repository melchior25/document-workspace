const express = require("express");
const {
  summarizeGeneratedDocument,
} = require("../controllers/documentSummaryController");

const router = express.Router();

router.post("/", summarizeGeneratedDocument);

module.exports = router;
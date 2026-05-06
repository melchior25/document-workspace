const express = require("express");
const {
  compareGeneratedDocuments,
} = require("../controllers/documentComparisonController");

const router = express.Router();

router.post("/", compareGeneratedDocuments);

module.exports = router;
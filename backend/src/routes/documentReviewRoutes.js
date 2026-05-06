const express = require("express");
const {
  reviewGeneratedDocument,
} = require("../controllers/documentReviewController");

const router = express.Router();

router.post("/", reviewGeneratedDocument);

module.exports = router;
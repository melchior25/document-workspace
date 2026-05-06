const express = require("express");
const {
  suggestCorrection,
} = require("../controllers/correctionController");

const router = express.Router();

router.post("/suggest", suggestCorrection);

module.exports = router;
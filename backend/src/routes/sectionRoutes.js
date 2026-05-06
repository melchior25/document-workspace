const express = require("express");
const { regenerateDocumentSection } = require("../controllers/sectionController");

const router = express.Router();

router.post("/regenerate", regenerateDocumentSection);

module.exports = router;
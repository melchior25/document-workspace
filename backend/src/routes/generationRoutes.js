const express = require("express");
const { generateDocument } = require("../controllers/generationController");

const router = express.Router();

router.post("/generate", generateDocument);

module.exports = router;
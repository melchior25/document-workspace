const express = require("express");
const { improveSelection } = require("../controllers/inlineEditController");

const router = express.Router();

router.post("/improve-selection", improveSelection);

module.exports = router;
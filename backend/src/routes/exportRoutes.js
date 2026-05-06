const express = require("express");
const {
  exportDocument,
  downloadExport,
} = require("../controllers/exportController");

const router = express.Router();

router.post("/document", exportDocument);
router.get("/download/:fileName", downloadExport);

module.exports = router;
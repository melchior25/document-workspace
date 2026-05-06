const express = require("express");
const multer = require("multer");
const {
  extractUploadedDocument,
  extractUploadedDocuments,
} = require("../controllers/uploadController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

router.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Upload routes are active.",
  });
});

router.post("/extract", upload.single("document"), extractUploadedDocument);

router.post(
  "/extract-many",
  upload.array("documents", 10),
  extractUploadedDocuments,
);

module.exports = router;
const express = require("express");
const {
  saveGeneratedDocument,
  listSavedDocuments,
  getSavedDocument,
  renameSavedDocument,
  deleteSavedDocument,
} = require("../controllers/documentLibraryController");

const router = express.Router();

router.post("/save", saveGeneratedDocument);
router.get("/", listSavedDocuments);
router.get("/:id", getSavedDocument);
router.patch("/:id", renameSavedDocument);
router.delete("/:id", deleteSavedDocument);

module.exports = router;
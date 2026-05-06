const {
  saveDocument,
  getSavedDocuments,
  getSavedDocumentById,
  renameSavedDocument: renameDocumentInLibrary,
  deleteSavedDocument: deleteDocumentFromLibrary,
} = require("../services/documentLibraryService");

function saveGeneratedDocument(req, res) {
  const {
    documentId,
    title,
    templateTitle,
    templateCategory,
    inputMode,
    summary,
    sections,
    notes,
  } = req.body;

  if (!title || !templateTitle) {
    return res.status(400).json({
      error: "MISSING_DOCUMENT_FIELDS",
      message: "title and templateTitle are required.",
    });
  }

  const savedDocument = saveDocument({
    documentId,
    title,
    templateTitle,
    templateCategory,
    inputMode,
    summary,
    sections,
    notes,
  });

  return res.status(200).json({
    success: true,
    document: savedDocument,
  });
}

function listSavedDocuments(req, res) {
  return res.status(200).json({
    success: true,
    documents: getSavedDocuments(),
  });
}

function getSavedDocument(req, res) {
  const { id } = req.params;
  const document = getSavedDocumentById(id);

  if (!document) {
    return res.status(404).json({
      error: "DOCUMENT_NOT_FOUND",
      message: "Saved document was not found.",
    });
  }

  return res.status(200).json({
    success: true,
    document,
  });
}

function renameSavedDocument(req, res) {
  const { id } = req.params;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      error: "MISSING_TITLE",
      message: "New title is required.",
    });
  }

  const updatedDocument = renameDocumentInLibrary(id, title.trim());

  if (!updatedDocument) {
    return res.status(404).json({
      error: "DOCUMENT_NOT_FOUND",
      message: "Saved document was not found.",
    });
  }

  return res.status(200).json({
    success: true,
    document: updatedDocument,
  });
}

function deleteSavedDocument(req, res) {
  const { id } = req.params;

  const deleted = deleteDocumentFromLibrary(id);

  if (!deleted) {
    return res.status(404).json({
      error: "DOCUMENT_NOT_FOUND",
      message: "Saved document was not found.",
    });
  }

  return res.status(200).json({
    success: true,
    deletedId: id,
  });
}

module.exports = {
  saveGeneratedDocument,
  listSavedDocuments,
  getSavedDocument,
  renameSavedDocument,
  deleteSavedDocument,
};
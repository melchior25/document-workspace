const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../../data/documents.json");

function loadDocumentsFromFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }

    const raw = fs.readFileSync(dataFilePath, "utf-8");
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to load documents:", error);
    return [];
  }
}

function saveDocumentsToFile(documents) {
  try {
    fs.writeFileSync(
      dataFilePath,
      JSON.stringify(documents, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to save documents:", error);
  }
}

// 🔹 Load once on startup
let savedDocuments = loadDocumentsFromFile();

function saveDocument({
  documentId,
  title,
  templateTitle,
  templateCategory,
  inputMode,
  summary,
  sections,
  notes,
}) {
  const savedDocument = {
    id: `saved_${Date.now()}`,
    documentId,
    title,
    templateTitle,
    templateCategory,
    inputMode,
    summary,
    sections,
    notes,
    savedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  savedDocuments.unshift(savedDocument);
  saveDocumentsToFile(savedDocuments);

  return savedDocument;
}

function getSavedDocuments() {
  return savedDocuments;
}

function getSavedDocumentById(id) {
  return savedDocuments.find((doc) => doc.id === id) || null;
}

function renameSavedDocument(id, title) {
  const document = getSavedDocumentById(id);

  if (!document) return null;

  document.title = title;
  document.updatedAt = new Date().toISOString();

  saveDocumentsToFile(savedDocuments);

  return document;
}

function deleteSavedDocument(id) {
  const index = savedDocuments.findIndex((doc) => doc.id === id);

  if (index === -1) return false;

  savedDocuments.splice(index, 1);

  saveDocumentsToFile(savedDocuments);

  return true;
}

module.exports = {
  saveDocument,
  getSavedDocuments,
  getSavedDocumentById,
  renameSavedDocument,
  deleteSavedDocument,
};
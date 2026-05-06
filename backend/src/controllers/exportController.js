const path = require("path");
const fs = require("fs");
const { prepareExport } = require("../services/exportService");

async function exportDocument(req, res) {
  try {
    const {
      documentTitle,
      templateTitle,
      exportFormat,
      title,
      summary,
      mainContent,
      notes,
    } = req.body;

    if (!exportFormat || !title) {
      return res.status(400).json({
        error: "MISSING_EXPORT_FIELDS",
        message: "exportFormat and title are required.",
      });
    }

    const exportResult = await prepareExport({
      documentTitle,
      templateTitle,
      exportFormat,
      title,
      summary,
      mainContent,
      notes,
    });

    return res.status(200).json({
      success: true,
      exportResult,
    });
  } catch (error) {
    return res.status(500).json({
      error: "EXPORT_FAILED",
      message: "The export could not be prepared.",
    });
  }
}

function downloadExport(req, res) {
  const { fileName } = req.params;
  const filePath = path.join(__dirname, "../../exports", fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "EXPORT_NOT_FOUND",
      message: "The requested export file does not exist.",
    });
  }

  return res.download(filePath, fileName);
}

module.exports = {
  exportDocument,
  downloadExport,
};
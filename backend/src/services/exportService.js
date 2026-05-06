const { createDocxExport } = require("./docxExportService");
const { createPdfExport } = require("./pdfExportService");
const { createPptxExport } = require("./pptxExportService");
const { createXlsxExport } = require("./xlsxExportService");

async function prepareExport({
  documentTitle,
  templateTitle,
  exportFormat,
  title,
  summary,
  mainContent,
  notes,
}) {
  if (exportFormat === "pdf") {
    return createPdfExport({
      documentTitle,
      templateTitle,
      title,
      summary,
      mainContent,
      notes,
    });
  }

  if (exportFormat === "docx") {
    return createDocxExport({
      documentTitle,
      templateTitle,
      title,
      summary,
      mainContent,
      notes,
    });
  }

  if (exportFormat === "pptx") {
    return createPptxExport({
      documentTitle,
      templateTitle,
      title,
      summary,
      mainContent,
      notes,
    });
  }

  if (exportFormat === "xlsx") {
    return createXlsxExport({
      documentTitle,
      templateTitle,
      title,
      summary,
      mainContent,
      notes,
    });
  }

  return {
    id: `export_${Date.now()}`,
    status: "prepared",
    exportFormat,
    fileName: `${documentTitle || title || templateTitle || "document"}.${exportFormat}`,
    downloadUrl: null,
    message: `${exportFormat.toUpperCase()} export structure is prepared.`,
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  prepareExport,
};
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const { sanitizeFileName } = require("../utils/sanitizeFileName");

function addSection(doc, heading, body) {
  doc
    .moveDown(1.4)
    .fontSize(10)
    .fillColor("#78716c")
    .text(heading.toUpperCase(), {
      characterSpacing: 1.4,
    });

  doc
    .moveDown(0.45)
    .fontSize(11)
    .fillColor("#44403c")
    .text(body || "No content provided.", {
      lineGap: 6,
      align: "left",
    });
}

function createPdfExport({
  documentTitle,
  templateTitle,
  title,
  summary,
  mainContent,
  notes,
}) {
  const exportId = `export_${Date.now()}`;
  const safeTitle = sanitizeFileName(title || documentTitle || "document");
  const fileName = `${safeTitle}.pdf`;
  const exportsDir = path.join(__dirname, "../../exports");
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: 64,
        bottom: 64,
        left: 64,
        right: 64,
      },
      info: {
        Title: title || documentTitle || "Generated Document",
        Author: "Document Workspace",
        Subject: templateTitle || "Generated document",
      },
    });

    const stream = fs.createWriteStream(filePath);

    stream.on("finish", () => {
      resolve({
        id: exportId,
        status: "ready",
        exportFormat: "pdf",
        fileName,
        downloadUrl: `/api/export/download/${fileName}`,
        message: "PDF export generated successfully.",
        createdAt: new Date().toISOString(),
      });
    });

    stream.on("error", reject);
    doc.on("error", reject);

    doc.pipe(stream);

    doc
      .fontSize(10)
      .fillColor("#78716c")
      .text("DOCUMENT WORKSPACE", {
        characterSpacing: 1.8,
      });

    doc
      .moveDown(0.8)
      .fontSize(26)
      .fillColor("#1c1917")
      .text(title || documentTitle || "Generated Document", {
        lineGap: 4,
      });

    doc
      .moveDown(0.6)
      .fontSize(10)
      .fillColor("#78716c")
      .text(`Template: ${templateTitle || "Unknown template"}`);

    doc
      .moveDown(1.4)
      .strokeColor("#e7e5e4")
      .lineWidth(1)
      .moveTo(64, doc.y)
      .lineTo(531, doc.y)
      .stroke();

    addSection(doc, "Executive Summary", summary);
    addSection(doc, "Main Document Content", mainContent);
    addSection(doc, "Final Notes", notes);

    doc
      .moveDown(2)
      .fontSize(9)
      .fillColor("#a8a29e")
      .text(`Generated on ${new Date().toLocaleString()}`);

    doc.end();
  });
}

module.exports = {
  createPdfExport,
};
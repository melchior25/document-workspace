const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} = require("docx");
const { sanitizeFileName } = require("../utils/sanitizeFileName");

function createHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 360,
      after: 160,
    },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: "1c1917",
      }),
    ],
  });
}

function createBody(text) {
  return new Paragraph({
    spacing: {
      after: 220,
      line: 360,
    },
    children: [
      new TextRun({
        text: text || "No content provided.",
        size: 22,
        color: "44403c",
      }),
    ],
  });
}

async function createDocxExport({
  documentTitle,
  templateTitle,
  title,
  summary,
  mainContent,
  notes,
}) {
  const exportId = `export_${Date.now()}`;
  const safeTitle = sanitizeFileName(title || documentTitle || "document");
  const fileName = `${safeTitle}.docx`;
  const exportsDir = path.join(__dirname, "../../exports");
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const doc = new Document({
    creator: "Document Workspace",
    title: title || documentTitle || "Generated Document",
    description: templateTitle || "Generated document",
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            spacing: {
              after: 200,
            },
            children: [
              new TextRun({
                text: "DOCUMENT WORKSPACE",
                bold: true,
                size: 18,
                color: "78716c",
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 180,
            },
            children: [
              new TextRun({
                text: title || documentTitle || "Generated Document",
                bold: true,
                size: 44,
                color: "1c1917",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 360,
            },
            children: [
              new TextRun({
                text: `Template: ${templateTitle || "Unknown template"}`,
                size: 20,
                color: "78716c",
              }),
            ],
          }),

          createHeading("Executive Summary"),
          createBody(summary),

          createHeading("Main Document Content"),
          createBody(mainContent),

          createHeading("Final Notes"),
          createBody(notes),

          new Paragraph({
            spacing: {
              before: 480,
            },
            children: [
              new TextRun({
                text: `Generated on ${new Date().toLocaleString()}`,
                size: 18,
                color: "a8a29e",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);

  return {
    id: exportId,
    status: "ready",
    exportFormat: "docx",
    fileName,
    downloadUrl: `/api/export/download/${fileName}`,
    message: "DOCX export generated successfully.",
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createDocxExport,
};
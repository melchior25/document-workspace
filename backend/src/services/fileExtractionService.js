const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");
const mammoth = require("mammoth");

function getFileExtension(fileName) {
  return path.extname(fileName || "").toLowerCase();
}

function normalizeExtractedText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    const rows = {};

    new PdfReader().parseFileItems(file.path, (error, item) => {
      if (error) {
        reject(error);
        return;
      }

      if (!item) {
        const sortedRows = Object.keys(rows)
          .sort((a, b) => Number(a) - Number(b))
          .map((rowKey) => rows[rowKey].join(" "))
          .join("\n");

        resolve(normalizeExtractedText(sortedRows));
        return;
      }

      if (item.text) {
        const rowKey = Math.round(item.y * 10);

        if (!rows[rowKey]) {
          rows[rowKey] = [];
        }

        rows[rowKey].push(item.text);
      }
    });
  });
}

async function extractDocxText(file) {
  const result = await mammoth.extractRawText({ path: file.path });
  return normalizeExtractedText(result.value);
}

function extractPlainText(file) {
  const text = fs.readFileSync(file.path, "utf8");
  return normalizeExtractedText(text);
}

async function extractTextFromFile(file) {
  const mimeType = file.mimetype || "";
  const extension = getFileExtension(file.originalname);

  let extractedText = "";

  if (mimeType === "application/pdf" || extension === ".pdf") {
    extractedText = await extractPdfText(file);
  } else if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    extension === ".docx"
  ) {
    extractedText = await extractDocxText(file);
  } else if (
    mimeType === "text/plain" ||
    extension === ".txt" ||
    extension === ".md" ||
    extension === ".csv"
  ) {
    extractedText = extractPlainText(file);
  } else {
    return {
      fileName: file.originalname,
      mimeType,
      extension,
      extractedText: "",
      characterCount: 0,
      supported: false,
      reason: `Unsupported file type: ${extension || mimeType || "unknown"}`,
    };
  }

  return {
    fileName: file.originalname,
    mimeType,
    extension,
    extractedText,
    characterCount: extractedText.length,
    supported: true,
    reason: extractedText
      ? "Text extracted successfully."
      : "The file was supported, but no readable text was found.",
  };
}

module.exports = {
  extractTextFromFile,
};
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { sanitizeFileName } = require("../utils/sanitizeFileName");

function addTitle(slide, title, subtitle) {
  slide.addText(title || "Generated Presentation", {
    x: 0.65,
    y: 0.65,
    w: 8.0,
    h: 0.55,
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    color: "1c1917",
    margin: 0,
  });

  slide.addText(subtitle || "", {
    x: 0.67,
    y: 1.25,
    w: 7.8,
    h: 0.35,
    fontFace: "Aptos",
    fontSize: 11,
    color: "78716c",
    margin: 0,
  });
}

function addSectionSlide(pptx, heading, body) {
  const slide = pptx.addSlide();

  slide.background = { color: "F7F6F3" };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0.45,
    y: 0.45,
    w: 9.1,
    h: 4.7,
    fill: { color: "FFFFFF" },
    line: { color: "E7E5E4" },
    radius: 0.2,
  });

  slide.addText(heading, {
    x: 0.85,
    y: 0.85,
    w: 7.9,
    h: 0.45,
    fontFace: "Aptos Display",
    fontSize: 24,
    bold: true,
    color: "1c1917",
    margin: 0,
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.85,
    y: 1.45,
    w: 7.8,
    h: 0,
    line: { color: "E7E5E4", width: 1 },
  });

  slide.addText(body || "No content provided.", {
    x: 0.85,
    y: 1.75,
    w: 7.9,
    h: 2.7,
    fontFace: "Aptos",
    fontSize: 15,
    color: "44403c",
    breakLine: false,
    fit: "shrink",
    valign: "top",
    margin: 0.05,
    paraSpaceAfterPt: 8,
  });

  slide.addText("Document Workspace", {
    x: 0.85,
    y: 4.75,
    w: 3.0,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 8,
    color: "A8A29E",
    margin: 0,
  });
}

async function createPptxExport({
  documentTitle,
  templateTitle,
  title,
  summary,
  mainContent,
  notes,
}) {
  const exportId = `export_${Date.now()}`;
  const safeTitle = sanitizeFileName(title || documentTitle || "presentation");
  const fileName = `${safeTitle}.pptx`;
  const exportsDir = path.join(__dirname, "../../exports");
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const pptx = new pptxgen();

  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Document Workspace";
  pptx.company = "Document Workspace";
  pptx.subject = templateTitle || "Generated presentation";
  pptx.title = title || documentTitle || "Generated Presentation";
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  const coverSlide = pptx.addSlide();
  coverSlide.background = { color: "F7F6F3" };

  coverSlide.addShape(pptx.ShapeType.rect, {
    x: 0.6,
    y: 0.6,
    w: 8.8,
    h: 4.55,
    fill: { color: "FFFFFF" },
    line: { color: "E7E5E4" },
    radius: 0.2,
  });

  coverSlide.addText("DOCUMENT WORKSPACE", {
    x: 0.95,
    y: 1.0,
    w: 4.0,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: "78716c",
    charSpace: 1.8,
    margin: 0,
  });

  addTitle(
    coverSlide,
    title || documentTitle || "Generated Presentation",
    `Based on ${templateTitle || "selected template"}`,
  );

  coverSlide.addText(summary || "Generated presentation prepared from your document workspace.", {
    x: 0.95,
    y: 2.1,
    w: 7.4,
    h: 1.2,
    fontFace: "Aptos",
    fontSize: 16,
    color: "44403c",
    fit: "shrink",
    margin: 0.05,
    paraSpaceAfterPt: 8,
  });

  coverSlide.addText(`Generated on ${new Date().toLocaleString()}`, {
    x: 0.95,
    y: 4.55,
    w: 4.0,
    h: 0.25,
    fontFace: "Aptos",
    fontSize: 8,
    color: "A8A29E",
    margin: 0,
  });

  addSectionSlide(pptx, "Executive Summary", summary);
  addSectionSlide(pptx, "Main Content", mainContent);
  addSectionSlide(pptx, "Final Notes", notes);

  await pptx.writeFile({ fileName: filePath });

  return {
    id: exportId,
    status: "ready",
    exportFormat: "pptx",
    fileName,
    downloadUrl: `/api/export/download/${fileName}`,
    message: "PPTX export generated successfully.",
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createPptxExport,
};
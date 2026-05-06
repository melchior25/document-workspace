const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { sanitizeFileName } = require("../utils/sanitizeFileName");

function applyTitleStyle(cell) {
  cell.font = {
    name: "Aptos",
    size: 22,
    bold: true,
    color: { argb: "FF1C1917" },
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };
}

function applyLabelStyle(cell) {
  cell.font = {
    name: "Aptos",
    size: 9,
    bold: true,
    color: { argb: "FF78716C" },
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };
}

function applySectionHeaderStyle(cell) {
  cell.font = {
    name: "Aptos",
    size: 12,
    bold: true,
    color: { argb: "FF1C1917" },
  };
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF5F5F4" },
  };
  cell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };
  cell.border = {
    top: { style: "thin", color: { argb: "FFE7E5E4" } },
    bottom: { style: "thin", color: { argb: "FFE7E5E4" } },
  };
}

function applyBodyStyle(cell) {
  cell.font = {
    name: "Aptos",
    size: 11,
    color: { argb: "FF44403C" },
  };
  cell.alignment = {
    vertical: "top",
    horizontal: "left",
    wrapText: true,
  };
}

function addSection(sheet, startRow, heading, body) {
  sheet.mergeCells(`A${startRow}:D${startRow}`);
  const headingCell = sheet.getCell(`A${startRow}`);
  headingCell.value = heading;
  applySectionHeaderStyle(headingCell);
  sheet.getRow(startRow).height = 24;

  sheet.mergeCells(`A${startRow + 1}:D${startRow + 4}`);
  const bodyCell = sheet.getCell(`A${startRow + 1}`);
  bodyCell.value = body || "No content provided.";
  applyBodyStyle(bodyCell);
  sheet.getRow(startRow + 1).height = 36;
  sheet.getRow(startRow + 2).height = 28;
  sheet.getRow(startRow + 3).height = 28;
  sheet.getRow(startRow + 4).height = 28;

  return startRow + 6;
}

async function createXlsxExport({
  documentTitle,
  templateTitle,
  title,
  summary,
  mainContent,
  notes,
}) {
  const exportId = `export_${Date.now()}`;
  const safeTitle = sanitizeFileName(title || documentTitle || "spreadsheet");
  const fileName = `${safeTitle}.xlsx`;
  const exportsDir = path.join(__dirname, "../../exports");
  const filePath = path.join(exportsDir, fileName);

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Document Workspace";
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheet = workbook.addWorksheet("Generated Document", {
    views: [{ showGridLines: false }],
    pageSetup: {
      paperSize: 9,
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  sheet.columns = [
    { key: "a", width: 22 },
    { key: "b", width: 24 },
    { key: "c", width: 24 },
    { key: "d", width: 24 },
  ];

  sheet.mergeCells("A1:D1");
  const brandCell = sheet.getCell("A1");
  brandCell.value = "DOCUMENT WORKSPACE";
  applyLabelStyle(brandCell);
  sheet.getRow(1).height = 20;

  sheet.mergeCells("A2:D3");
  const titleCell = sheet.getCell("A2");
  titleCell.value = title || documentTitle || "Generated Document";
  applyTitleStyle(titleCell);
  sheet.getRow(2).height = 32;
  sheet.getRow(3).height = 20;

  sheet.mergeCells("A4:D4");
  const templateCell = sheet.getCell("A4");
  templateCell.value = `Template: ${templateTitle || "Unknown template"}`;
  templateCell.font = {
    name: "Aptos",
    size: 10,
    color: { argb: "FF78716C" },
  };
  templateCell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };
  sheet.getRow(4).height = 24;

  let nextRow = 6;
  nextRow = addSection(sheet, nextRow, "Executive Summary", summary);
  nextRow = addSection(sheet, nextRow, "Main Document Content", mainContent);
  nextRow = addSection(sheet, nextRow, "Final Notes", notes);

  sheet.mergeCells(`A${nextRow}:D${nextRow}`);
  const footerCell = sheet.getCell(`A${nextRow}`);
  footerCell.value = `Generated on ${new Date().toLocaleString()}`;
  footerCell.font = {
    name: "Aptos",
    size: 9,
    color: { argb: "FFA8A29E" },
  };
  footerCell.alignment = {
    vertical: "middle",
    horizontal: "left",
  };
  sheet.getRow(nextRow).height = 24;

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        ...cell.border,
        left: { style: "thin", color: { argb: "FFF5F5F4" } },
        right: { style: "thin", color: { argb: "FFF5F5F4" } },
      };
    });
  });

  await workbook.xlsx.writeFile(filePath);

  return {
    id: exportId,
    status: "ready",
    exportFormat: "xlsx",
    fileName,
    downloadUrl: `/api/export/download/${fileName}`,
    message: "XLSX export generated successfully.",
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createXlsxExport,
};
const { compareDocuments } = require("../services/documentComparisonService");

async function compareGeneratedDocuments(req, res) {
  try {
    const { titleA, titleB, documentA, documentB, tone } = req.body;

    if (!documentA || !documentB) {
      return res.status(400).json({
        error: "MISSING_COMPARISON_FIELDS",
        message: "documentA and documentB are required.",
      });
    }

    const comparison = await compareDocuments({
      titleA: titleA || "Document A",
      titleB: titleB || "Document B",
      documentA,
      documentB,
      tone,
    });

    return res.status(200).json({
      success: true,
      comparison,
    });
  } catch (error) {
    return res.status(500).json({
      error: "DOCUMENT_COMPARISON_FAILED",
      message: error.message || "Could not compare documents.",
    });
  }
}

module.exports = {
  compareGeneratedDocuments,
};
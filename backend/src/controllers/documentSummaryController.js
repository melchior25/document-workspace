const { summarizeDocument } = require("../services/documentSummaryService");

async function summarizeGeneratedDocument(req, res) {
  try {
    const {
      title,
      templateTitle,
      templateCategory,
      tone,
      summary,
      mainContent,
      notes,
    } = req.body;

    if (!title || !templateTitle || !mainContent) {
      return res.status(400).json({
        error: "MISSING_SUMMARY_FIELDS",
        message: "title, templateTitle and mainContent are required.",
      });
    }

    const smartSummary = await summarizeDocument({
      title,
      templateTitle,
      templateCategory,
      tone,
      summary,
      mainContent,
      notes,
    });

    return res.status(200).json({
      success: true,
      summary: smartSummary,
    });
  } catch (error) {
    return res.status(500).json({
      error: "DOCUMENT_SUMMARY_FAILED",
      message: error.message || "Could not summarize document.",
    });
  }
}

module.exports = {
  summarizeGeneratedDocument,
};
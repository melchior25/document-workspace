const {
  createCorrectionSuggestion,
} = require("../services/correctionService");

function suggestCorrection(req, res) {
  const { request, documentTitle, summary, mainContent, notes } = req.body;

  if (!request || !documentTitle) {
    return res.status(400).json({
      error: "MISSING_CORRECTION_FIELDS",
      message: "request and documentTitle are required.",
    });
  }

  const suggestion = createCorrectionSuggestion({
    request,
    documentTitle,
    summary,
    mainContent,
    notes,
  });

  return res.status(200).json({
    success: true,
    suggestion,
  });
}

module.exports = {
  suggestCorrection,
};
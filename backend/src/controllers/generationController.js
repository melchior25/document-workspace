const { prepareGeneratedDocument } = require("../services/generationService");

async function generateDocument(req, res) {
  const {
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    promptText,
    documentContext,
  } = req.body;

  if (!templateId || !templateTitle || !templateCategory || !inputMode) {
    return res.status(400).json({
      error: "MISSING_GENERATION_FIELDS",
      message:
        "templateId, templateTitle, templateCategory and inputMode are required.",
    });
  }

  const document = await prepareGeneratedDocument({
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    promptText,
    documentContext,
  });

  return res.status(200).json({
    success: true,
    document,
  });
}

module.exports = {
  generateDocument,
};
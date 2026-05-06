const { regenerateSection } = require("../services/sectionRegenerationService");

async function regenerateDocumentSection(req, res) {
  try {
    const {
      templateId,
      templateTitle,
      templateCategory,
      inputMode,
      sectionTitle,
      fullDocumentText,
      tone,
    } = req.body;

    if (!sectionTitle || !fullDocumentText) {
      return res.status(400).json({
        error: "MISSING_FIELDS",
      });
    }

    const content = await regenerateSection({
      templateId,
      templateTitle,
      templateCategory,
      inputMode,
      sectionTitle,
      fullDocumentText,
      tone,
    });

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    return res.status(500).json({
      error: "SECTION_REGEN_FAILED",
      message: error.message || "Could not regenerate section.",
    });
  }
}

module.exports = {
  regenerateDocumentSection,
};
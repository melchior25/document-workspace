const { improveSelectedText } = require("../services/inlineEditService");

async function improveSelection(req, res) {
  try {
    const {
      selectedText,
      sectionHeading,
      documentTitle,
      templateTitle,
      tone,
    } = req.body;

    if (!selectedText || !selectedText.trim()) {
      return res.status(400).json({
        error: "MISSING_SELECTED_TEXT",
        message: "selectedText is required.",
      });
    }

    const improvedText = await improveSelectedText({
      selectedText,
      sectionHeading,
      documentTitle,
      templateTitle,
      tone,
    });

    return res.status(200).json({
      success: true,
      improvedText,
    });
  } catch (error) {
    return res.status(500).json({
      error: "INLINE_EDIT_FAILED",
      message: error.message || "Could not improve selected text.",
    });
  }
}

module.exports = {
  improveSelection,
};
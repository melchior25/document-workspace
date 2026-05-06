const { reviewDocument } = require("../services/documentReviewService");

async function reviewGeneratedDocument(req, res) {
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
        error: "MISSING_REVIEW_FIELDS",
        message: "title, templateTitle and mainContent are required.",
      });
    }

    const review = await reviewDocument({
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
      review,
    });
  } catch (error) {
    return res.status(500).json({
      error: "DOCUMENT_REVIEW_FAILED",
      message: error.message || "Could not review document.",
    });
  }
}

module.exports = {
  reviewGeneratedDocument,
};
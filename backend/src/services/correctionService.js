function createCorrectionSuggestion({
  request,
  documentTitle,
  summary,
  mainContent,
  notes,
}) {
  const cleanedRequest = request.trim();

  return {
    id: `correction_${Date.now()}`,
    request: cleanedRequest,
    suggestion: [
      `Suggested improvement for "${documentTitle}":`,
      "",
      `Request: ${cleanedRequest}`,
      "",
      "Recommended update:",
      "Refine the selected document content by making it clearer, more structured, and more professional. Keep the tone appropriate for the document type and preserve the original meaning.",
      "",
      "Current context used:",
      `Summary: ${summary || "No summary provided."}`,
      `Main content: ${mainContent || "No main content provided."}`,
      `Notes: ${notes || "No notes provided."}`,
    ].join("\n"),
    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  createCorrectionSuggestion,
};
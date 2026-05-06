function sanitizeFileName(value) {
  return String(value || "document")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "document";
}

module.exports = {
  sanitizeFileName,
};
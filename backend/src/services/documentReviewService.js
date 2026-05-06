const { openai } = require("./openaiClient");

async function reviewDocument({
  title,
  templateTitle,
  templateCategory,
  tone,
  summary,
  mainContent,
  notes,
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const prompt = [
    "You are a professional document quality reviewer.",
    "Review the document and return practical feedback.",
    "Return ONLY valid JSON. Do not include markdown fences.",
    "",
    "JSON shape:",
    "{",
    '  "overallScore": number,',
    '  "strengths": ["string"],',
    '  "issues": ["string"],',
    '  "missingPoints": ["string"],',
    '  "recommendations": ["string"],',
    '  "finalComment": "string"',
    "}",
    "",
    `Document title: ${title}`,
    `Template title: ${templateTitle}`,
    `Template category: ${templateCategory}`,
    `Requested tone: ${tone || "professional"}`,
    "",
    "Review focus:",
    "- clarity",
    "- structure",
    "- completeness",
    "- tone",
    "- professional quality",
    "- usefulness for export",
    "",
    "Summary:",
    summary,
    "",
    "Main content:",
    mainContent,
    "",
    "Notes:",
    notes,
  ].join("\n");

  const response = await openai.responses.create({
    model,
    input: prompt,
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("AI review response was empty.");
  }

  try {
    return JSON.parse(output);
  } catch {
    return {
      overallScore: 0,
      strengths: [],
      issues: ["The review response could not be parsed as JSON."],
      missingPoints: [],
      recommendations: [output.trim()],
      finalComment: "Review completed, but formatting was not valid JSON.",
    };
  }
}

module.exports = {
  reviewDocument,
};
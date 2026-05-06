const { openai } = require("./openaiClient");

async function summarizeDocument({
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
    "You are a professional document summarization assistant.",
    "Create a smart summary of the document.",
    "Return ONLY valid JSON. Do not include markdown fences.",
    "",
    "JSON shape:",
    "{",
    '  "shortSummary": "string",',
    '  "keyPoints": ["string"],',
    '  "actionItems": ["string"],',
    '  "importantNotes": ["string"],',
    '  "quickRecommendation": "string"',
    "}",
    "",
    `Document title: ${title}`,
    `Template title: ${templateTitle}`,
    `Template category: ${templateCategory}`,
    `Requested tone: ${tone || "professional"}`,
    "",
    "Summary rules:",
    "- Keep it concise but useful.",
    "- Focus on the most important information.",
    "- Extract practical action items if present.",
    "- Do not invent facts.",
    "- Use the requested tone.",
    "",
    "Current summary:",
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
    throw new Error("AI summary response was empty.");
  }

  try {
    return JSON.parse(output);
  } catch {
    return {
      shortSummary: output.trim(),
      keyPoints: [],
      actionItems: [],
      importantNotes: [],
      quickRecommendation:
        "Summary generated, but the response was not valid JSON.",
    };
  }
}

module.exports = {
  summarizeDocument,
};
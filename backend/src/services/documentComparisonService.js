const { openai } = require("./openaiClient");

async function compareDocuments({
  titleA,
  titleB,
  documentA,
  documentB,
  tone,
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const prompt = [
    "You are a professional document comparison assistant.",
    "Compare Document A and Document B.",
    "Return ONLY valid JSON. Do not include markdown fences.",
    "",
    "JSON shape:",
    "{",
    '  "summary": "string",',
    '  "mainDifferences": ["string"],',
    '  "overlap": ["string"],',
    '  "missingFromA": ["string"],',
    '  "missingFromB": ["string"],',
    '  "improvementSuggestions": ["string"],',
    '  "finalRecommendation": "string"',
    "}",
    "",
    `Requested tone: ${tone || "professional"}`,
    "",
    "Comparison rules:",
    "- Be practical and specific.",
    "- Do not invent facts.",
    "- Focus on meaningful content differences.",
    "- Mention missing or weaker areas.",
    "- Keep feedback useful for improving the document.",
    "",
    `Document A title: ${titleA}`,
    "Document A:",
    documentA,
    "",
    "---",
    "",
    `Document B title: ${titleB}`,
    "Document B:",
    documentB,
  ].join("\n");

  const response = await openai.responses.create({
    model,
    input: prompt,
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("AI comparison response was empty.");
  }

  try {
    return JSON.parse(output);
  } catch {
    return {
      summary: "Comparison completed, but the response was not valid JSON.",
      mainDifferences: [output.trim()],
      overlap: [],
      missingFromA: [],
      missingFromB: [],
      improvementSuggestions: [],
      finalRecommendation:
        "Review the raw comparison text and adjust the document manually.",
    };
  }
}

module.exports = {
  compareDocuments,
};
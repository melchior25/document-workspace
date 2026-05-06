const { openai } = require("./openaiClient");

function buildAiGenerationPrompt(generationInstruction) {
  return [
    "You are a professional document generation assistant.",
    "Generate a polished, structured, editable document.",
    "Return ONLY valid JSON. Do not include markdown fences.",
    "",
    "The JSON must use this exact shape:",
    "{",
    '  "title": "string",',
    '  "summary": "string",',
    '  "mainContent": "string",',
    '  "notes": "string",',
    '  "generatedSections": [',
    '    { "heading": "string", "content": "string" }',
    "  ]",
    "}",
    "",
    "Rules:",
    "- Write in clear professional English.",
    "- Use the selected template style and tone.",
    "- Make the document practical and export-ready.",
    "- Avoid vague filler.",
    "- Keep the content structured and easy to edit.",
    "- Each required section must appear in generatedSections.",
    "- mainContent must combine the sections into a readable document body.",
    "",
    "Generation instruction:",
    generationInstruction.instruction,
  ].join("\n");
}

function parseAiJson(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {
    const firstBrace = rawText.indexOf("{");
    const lastBrace = rawText.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("AI response did not contain JSON.");
    }

    const jsonText = rawText.slice(firstBrace, lastBrace + 1);
    return JSON.parse(jsonText);
  }
}

async function generateDocumentWithAi(generationInstruction) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const prompt = buildAiGenerationPrompt(generationInstruction);

  const response = await openai.responses.create({
    model,
    input: prompt,
  });

  const outputText = response.output_text;

  if (!outputText) {
    throw new Error("AI response was empty.");
  }

  return parseAiJson(outputText);
}

module.exports = {
  generateDocumentWithAi,
};
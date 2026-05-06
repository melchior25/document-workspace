const { openai } = require("./openaiClient");

async function improveSelectedText({
  selectedText,
  sectionHeading,
  documentTitle,
  templateTitle,
  tone,
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const prompt = [
    "You are a professional document editing assistant.",
    "Improve ONLY the selected text.",
    "Return ONLY the improved replacement text.",
    "Do not return JSON.",
    "Do not include markdown fences.",
    "Do not explain your changes.",
    "",
    `Document title: ${documentTitle}`,
    `Template title: ${templateTitle}`,
    `Section heading: ${sectionHeading}`,
    `Requested tone: ${tone || "professional"}`,
    "",
    "Rules:",
    "- Keep the original meaning.",
    "- Improve clarity, grammar, flow and tone.",
    "- Follow the requested tone.",
    "- Do not make the text much longer unless needed.",
    "- Do not add unrelated information.",
    "",
    "Selected text:",
    selectedText,
  ].join("\n");

  const response = await openai.responses.create({
    model,
    input: prompt,
  });

  if (!response.output_text) {
    throw new Error("AI response was empty.");
  }

  return response.output_text.trim();
}

module.exports = {
  improveSelectedText,
};
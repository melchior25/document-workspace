const { openai } = require("./openaiClient");

async function regenerateSection({
  templateTitle,
  templateCategory,
  inputMode,
  sectionTitle,
  fullDocumentText,
  tone,
}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.5";

  const prompt = [
    "You are a professional document editing assistant.",
    "Rewrite ONLY the requested section content.",
    "Return ONLY the improved section text.",
    "Do not return JSON.",
    "Do not include markdown fences.",
    "Do not rewrite the whole document.",
    "",
    `Template title: ${templateTitle}`,
    `Template category: ${templateCategory}`,
    `Input mode: ${inputMode}`,
    `Section to regenerate: ${sectionTitle}`,
    `Requested tone: ${tone || "professional"}`,
    "",
    "Rules:",
    "- Improve clarity, structure and professional quality.",
    "- Preserve the purpose of the section.",
    "- Follow the requested tone.",
    "- Do not mention that you are an AI.",
    "- Do not include the section heading unless needed.",
    "",
    "Full document context:",
    fullDocumentText,
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
  regenerateSection,
};
const {
  buildGenerationInstruction,
} = require("./generationPromptBuilder");
const { generateDocumentWithAi } = require("./aiGenerationService");

function buildSectionContent(section, sourceInput, templateTitle) {
  const cleanSource =
    sourceInput && sourceInput.trim()
      ? sourceInput.trim()
      : "No detailed source input was provided.";

  return `${section}: This section is prepared for the ${templateTitle} template. It uses the provided source information and organizes it into a clear, professional format.\n\nSource context: ${cleanSource}`;
}

function buildFallbackDocument({
  templateId,
  templateTitle,
  templateCategory,
  inputMode,
  promptText,
  documentContext,
  generationInstruction,
}) {
  const sourceInput = documentContext || promptText || "";

  const generatedSections = generationInstruction.requiredSections.map(
    (section) => ({
      heading: section,
      content: buildSectionContent(section, sourceInput, templateTitle),
    }),
  );

  const summary = `This ${templateTitle} draft was generated using a ${generationInstruction.tone} style. The structure follows the selected template and is ready for manual editing, AI-assisted correction and export.`;

  const mainContent = generatedSections
    .map((section) => `${section.heading}\n${section.content}`)
    .join("\n\n");

  const notes = [
    "Review the generated sections before exporting.",
    "Use the AI correction assistant to improve tone, grammar or structure.",
    "Adjust details manually where needed.",
  ].join("\n");

  return {
    id: `doc_${Date.now()}`,
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    status: "generated_fallback",
    title: `${templateTitle} Draft`,
    summary,
    mainContent,
    notes,
    generatedSections,
    generationInstruction,
    sourcePreview: sourceInput || null,
    createdAt: new Date().toISOString(),
  };
}

function normalizeAiDocument({
  aiDocument,
  templateId,
  templateTitle,
  templateCategory,
  inputMode,
  promptText,
  documentContext,
  generationInstruction,
}) {
  const generatedSections = Array.isArray(aiDocument.generatedSections)
    ? aiDocument.generatedSections.map((section) => ({
        heading: String(section.heading || "Section"),
        content: String(section.content || ""),
      }))
    : generationInstruction.requiredSections.map((section) => ({
        heading: section,
        content: "",
      }));

  const mainContent =
    aiDocument.mainContent ||
    generatedSections
      .map((section) => `${section.heading}\n${section.content}`)
      .join("\n\n");

  return {
    id: `doc_${Date.now()}`,
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    status: "generated_ai",
    title: aiDocument.title || `${templateTitle} Draft`,
    summary: aiDocument.summary || "",
    mainContent,
    notes: aiDocument.notes || "",
    generatedSections,
    generationInstruction,
    sourcePreview: documentContext || promptText || null,
    createdAt: new Date().toISOString(),
  };
}

async function prepareGeneratedDocument({
  templateId,
  templateTitle,
  templateCategory,
  inputMode,
  promptText,
  documentContext,
}) {
  const generationInstruction = buildGenerationInstruction({
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    promptText,
    documentContext,
  });

  try {
    const aiDocument = await generateDocumentWithAi(generationInstruction);

    return normalizeAiDocument({
      aiDocument,
      templateId,
      templateTitle,
      templateCategory,
      inputMode,
      promptText,
      documentContext,
      generationInstruction,
    });
  } catch (error) {
    console.error("AI generation failed. Using fallback:", error.message);

    return buildFallbackDocument({
      templateId,
      templateTitle,
      templateCategory,
      inputMode,
      promptText,
      documentContext,
      generationInstruction,
    });
  }
}

module.exports = {
  prepareGeneratedDocument,
};
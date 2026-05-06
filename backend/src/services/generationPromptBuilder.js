const {
  getTemplateGenerationProfile,
  getTemplateSubtypeProfile,
} = require("../config/templateGenerationProfiles");
const {
  buildChunkedSourceContext,
  normalizeSourceText,
} = require("./sourceChunkingService");

function buildDocumentQualityRules() {
  return [
    "Premium output rules:",
    "- Write like a professional document specialist, not like a chatbot.",
    "- Never mention that you are an AI.",
    "- Never explain what you are doing.",
    "- Do not use filler such as 'this section will discuss'.",
    "- Do not use weak placeholder writing.",
    "- Make the document immediately usable after generation.",
    "- Use grounded, practical and specific professional language.",
    "- Use strong section titles like real documents use.",
    "- Avoid repetitive wording across sections.",
    "- Preserve the original meaning and intent of the source content.",
    "- Improve structure, clarity and usefulness beyond the original input.",
    "- The output must feel premium and export-ready.",
  ].join("\n");
}

function buildDocumentUploadRules() {
  return [
    "Uploaded document analysis rules:",
    "- Do NOT simply rewrite the uploaded file line by line.",
    "- First understand the purpose of the uploaded content.",
    "- Identify the most important information across all chunks.",
    "- Remove weak repetition and unnecessary filler.",
    "- Reorganize information using the selected professional template.",
    "- Improve clarity, structure and usefulness.",
    "- Convert raw source material into a stronger professional document.",
    "- If multiple source documents are present, merge overlapping context intelligently.",
    "- If the source is incomplete, intelligently complete the missing structure.",
    "- Keep the original intent, but improve professional quality significantly.",
  ].join("\n");
}

function buildPromptInputRules() {
  return [
    "Prompt input rules:",
    "- Use the user prompt as the main source of truth.",
    "- Expand short prompts into strong professional structure.",
    "- Infer missing sections intelligently.",
    "- Keep the user's intended purpose unchanged.",
  ].join("\n");
}

function buildCategorySpecificRules(category) {
  const rules = {
    reports: [
      "Report rules:",
      "- Focus on findings, conclusions and recommendations.",
      "- Use objective professional language.",
      "- Make it suitable for formal review.",
      "- Include actionable next steps.",
    ],
    planning: [
      "Planning rules:",
      "- Make the plan executable and realistic.",
      "- Use phases, steps and responsibilities clearly.",
      "- Avoid vague goals.",
    ],
    summaries: [
      "Summary rules:",
      "- Focus only on important information.",
      "- Make it concise but complete.",
      "- Prioritize clarity and scanability.",
    ],
    communication: [
      "Communication rules:",
      "- Write for the intended audience.",
      "- Keep messaging polished and direct.",
      "- Make next actions clear.",
    ],
    "study-teaching": [
      "Study & Teaching rules:",
      "- Make the content practical for classroom use.",
      "- Keep instructions and learning goals clear.",
      "- Make it teacher-friendly and learner-friendly.",
    ],
    presentations: [
      "Presentation rules:",
      "- Make content slide-ready.",
      "- Use concise sections.",
      "- Avoid dense paragraphs.",
      "- Support presentation flow.",
    ],
  };

  return (
    rules[category] || [
      "General rules:",
      "- Keep the document professional and structured.",
      "- Make content useful and practical.",
    ]
  ).join("\n");
}

function buildSubtypeSpecificRules(subtypeProfile) {
  if (!subtypeProfile) {
    return [
      "Template rules:",
      "- Use the template title to infer the best structure.",
      "- Make the output specific to the selected document type.",
    ].join("\n");
  }

  return [
    "Template rules:",
    `- Purpose: ${subtypeProfile.purpose}`,
    ...subtypeProfile.rules.map((rule) => `- ${rule}`),
  ].join("\n");
}

function buildRequiredSectionRules(sections) {
  return [
    "Required sections rules:",
    "- Every required section must exist.",
    "- Every section must contain meaningful professional content.",
    "- No empty sections.",
    "- No weak one-line sections unless naturally required.",
    "- Keep sections distinct and valuable.",
    "",
    "Required sections:",
    ...sections.map((section) => `- ${section}`),
  ].join("\n");
}

function buildJsonContract() {
  return [
    "Return ONLY valid JSON.",
    "Do not return markdown.",
    "Do not return explanations.",
    "",
    "Required JSON shape:",
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
    "JSON rules:",
    "- title must be strong and professional",
    "- summary must be executive-quality",
    "- mainContent must read like a real final document",
    "- notes must contain useful follow-up notes",
    "- generatedSections must match required sections",
  ].join("\n");
}

function buildSourceContext({ inputMode, promptText, documentContext }) {
  const isDocumentMode =
    inputMode === "document" &&
    documentContext &&
    documentContext.trim();

  if (isDocumentMode) {
    const chunkedContext = buildChunkedSourceContext(documentContext);

    return {
      sourceInput: chunkedContext.chunkedText,
      sourceMeta: {
        mode: "document",
        chunkCount: chunkedContext.chunkCount,
        totalCharacters: chunkedContext.totalCharacters,
      },
    };
  }

  const sourceInput =
    promptText && promptText.trim()
      ? normalizeSourceText(promptText)
      : "No detailed source input was provided. Create a strong professional draft based on the selected template.";

  return {
    sourceInput,
    sourceMeta: {
      mode: "prompt",
      chunkCount: 1,
      totalCharacters: sourceInput.length,
    },
  };
}

function buildGenerationInstruction({
  templateId,
  templateTitle,
  templateCategory,
  inputMode,
  promptText,
  documentContext,
}) {
  const categoryProfile = getTemplateGenerationProfile(templateCategory);
  const subtypeProfile = getTemplateSubtypeProfile(templateId);
  const requiredSections =
    subtypeProfile?.sections || categoryProfile.sections;

  const isDocumentMode =
    inputMode === "document" &&
    documentContext &&
    documentContext.trim();

  const { sourceInput, sourceMeta } = buildSourceContext({
    inputMode,
    promptText,
    documentContext,
  });

  const inputSpecificRules = isDocumentMode
    ? buildDocumentUploadRules()
    : buildPromptInputRules();

  return {
    templateId,
    templateTitle,
    templateCategory,
    inputMode,
    tone: categoryProfile.tone,
    purpose:
      subtypeProfile?.purpose ||
      `Create a professional ${templateTitle} document.`,
    requiredSections,
    sourceInput,
    sourceMeta,
    instruction: [
      `Generate a premium professional document using the "${templateTitle}" template.`,
      `Template ID: ${templateId}`,
      `Template category: ${templateCategory}`,
      `Input mode: ${inputMode}`,
      `Required tone: ${categoryProfile.tone}`,
      "",
      isDocumentMode
        ? `Source has been chunked for better processing. Chunk count: ${sourceMeta.chunkCount}. Total characters: ${sourceMeta.totalCharacters}.`
        : `Prompt input characters: ${sourceMeta.totalCharacters}.`,
      "",
      buildDocumentQualityRules(),
      "",
      inputSpecificRules,
      "",
      buildCategorySpecificRules(templateCategory),
      "",
      buildSubtypeSpecificRules(subtypeProfile),
      "",
      buildRequiredSectionRules(requiredSections),
      "",
      buildJsonContract(),
      "",
      isDocumentMode
        ? "Chunked uploaded source document content:"
        : "User source prompt:",
      sourceInput,
    ].join("\n"),
  };
}

module.exports = {
  buildGenerationInstruction,
};
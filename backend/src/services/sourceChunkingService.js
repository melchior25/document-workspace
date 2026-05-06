function normalizeSourceText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitIntoParagraphs(text) {
  return normalizeSourceText(text)
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function chunkText(text, maxChunkLength = 3500) {
  const paragraphs = splitIntoParagraphs(text);
  const chunks = [];
  let currentChunk = "";

  paragraphs.forEach((paragraph) => {
    const nextChunk = currentChunk
      ? `${currentChunk}\n\n${paragraph}`
      : paragraph;

    if (nextChunk.length > maxChunkLength && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = paragraph;
      return;
    }

    if (paragraph.length > maxChunkLength) {
      const pieces = paragraph.match(new RegExp(`.{1,${maxChunkLength}}`, "g")) || [];
      pieces.forEach((piece) => chunks.push(piece.trim()));
      currentChunk = "";
      return;
    }

    currentChunk = nextChunk;
  });

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function createSourceChunks(sourceText, maxChunkLength = 3500) {
  const normalizedText = normalizeSourceText(sourceText);
  const chunks = chunkText(normalizedText, maxChunkLength);

  return chunks.map((chunk, index) => ({
    id: `chunk_${index + 1}`,
    index: index + 1,
    title: `Source Chunk ${index + 1}`,
    text: chunk,
    characterCount: chunk.length,
  }));
}

function buildChunkedSourceContext(sourceText) {
  const chunks = createSourceChunks(sourceText);
  const totalCharacters = chunks.reduce(
    (total, chunk) => total + chunk.characterCount,
    0,
  );

  const chunkedText = chunks
    .map((chunk) => {
      return [
        `CHUNK ${chunk.index}`,
        `CHARACTERS: ${chunk.characterCount}`,
        "",
        chunk.text,
      ].join("\n");
    })
    .join("\n\n---\n\n");

  return {
    chunks,
    chunkedText,
    chunkCount: chunks.length,
    totalCharacters,
  };
}

module.exports = {
  normalizeSourceText,
  createSourceChunks,
  buildChunkedSourceContext,
};
const fs = require("fs");
const { extractTextFromFile } = require("../services/fileExtractionService");

function removeTempFile(filePath) {
  if (!filePath) return;

  fs.unlink(filePath, (error) => {
    if (error) {
      console.error("Could not remove temp upload:", error.message);
    }
  });
}

async function extractUploadedDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "NO_FILE_UPLOADED",
        message: "Please upload a document file.",
      });
    }

    console.log("Upload received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    const extraction = await extractTextFromFile(req.file);

    removeTempFile(req.file.path);

    if (!extraction.supported) {
      return res.status(400).json({
        error: "UNSUPPORTED_FILE_TYPE",
        message: extraction.reason,
        extraction,
      });
    }

    if (!extraction.extractedText.trim()) {
      return res.status(400).json({
        error: "NO_TEXT_EXTRACTED",
        message:
          "The file was supported, but no readable text was found. If this is a scanned PDF or image-based document, OCR support must be added later.",
        extraction,
      });
    }

    return res.status(200).json({
      success: true,
      extraction,
    });
  } catch (error) {
    if (req.file?.path) {
      removeTempFile(req.file.path);
    }

    console.error("File extraction failed:", error);

    return res.status(500).json({
      error: "FILE_EXTRACTION_FAILED",
      message:
        error.message || "Could not extract text from the uploaded document.",
    });
  }
}

async function extractUploadedDocuments(req, res) {
  const files = req.files || [];

  try {
    if (files.length === 0) {
      return res.status(400).json({
        error: "NO_FILES_UPLOADED",
        message: "Please upload at least one document file.",
      });
    }

    console.log(
      "Multiple uploads received:",
      files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
      })),
    );

    const extractions = [];
    const failedFiles = [];

    for (const file of files) {
      try {
        const extraction = await extractTextFromFile(file);

        if (extraction.supported && extraction.extractedText.trim()) {
          extractions.push(extraction);
        } else {
          failedFiles.push({
            fileName: file.originalname,
            reason:
              extraction.reason ||
              "No readable text could be extracted from this file.",
          });
        }
      } catch (error) {
        console.error(`Extraction failed for ${file.originalname}:`, error);

        failedFiles.push({
          fileName: file.originalname,
          reason:
            error.message ||
            "Could not extract text from this uploaded document.",
        });
      } finally {
        removeTempFile(file.path);
      }
    }

    if (extractions.length === 0) {
      return res.status(400).json({
        error: "NO_TEXT_EXTRACTED",
        message:
          failedFiles.length > 0
            ? `No readable text could be extracted. First issue: ${failedFiles[0].fileName} - ${failedFiles[0].reason}`
            : "The uploaded files were received, but no readable text could be extracted.",
        failedFiles,
      });
    }

    const combinedText = extractions
      .map((extraction, index) => {
        return [
          `SOURCE DOCUMENT ${index + 1}: ${extraction.fileName}`,
          `FILE TYPE: ${extraction.extension || extraction.mimeType}`,
          "",
          extraction.extractedText,
        ].join("\n");
      })
      .join("\n\n---\n\n");

    const combinedExtraction = {
      fileName:
        extractions.length === 1
          ? extractions[0].fileName
          : `${extractions.length} uploaded documents`,
      mimeType: "multiple/documents",
      extension: "multiple",
      extractedText: combinedText,
      characterCount: combinedText.length,
      supported: true,
      reason:
        failedFiles.length > 0
          ? `${extractions.length} file(s) extracted. ${failedFiles.length} file(s) skipped.`
          : "Multiple documents extracted successfully.",
      files: extractions,
      failedFiles,
      fileCount: extractions.length,
    };

    return res.status(200).json({
      success: true,
      extraction: combinedExtraction,
    });
  } catch (error) {
    files.forEach((file) => removeTempFile(file.path));

    console.error("Multiple file extraction failed:", error);

    return res.status(500).json({
      error: "MULTI_FILE_EXTRACTION_FAILED",
      message:
        error.message || "Could not extract text from the uploaded documents.",
    });
  }
}

module.exports = {
  extractUploadedDocument,
  extractUploadedDocuments,
};
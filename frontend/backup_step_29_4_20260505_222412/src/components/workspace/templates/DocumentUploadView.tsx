import { useRef, useState } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'
import {
  extractUploadedDocument,
  extractUploadedDocuments,
} from '../../../features/uploads/uploadApi'
import type { UploadedDocumentExtraction } from '../../../features/uploads/upload.types'

type DocumentUploadViewProps = {
  template: TemplateItem
  onBack: () => void
  onContinue: (extraction: UploadedDocumentExtraction) => void
}

function DocumentUploadView({
  template,
  onBack,
  onContinue,
}: DocumentUploadViewProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([])
  const [extraction, setExtraction] = useState<UploadedDocumentExtraction | null>(
    null,
  )
  const [isExtracting, setIsExtracting] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    setSelectedFileNames(fileArray.map((file) => file.name))
    setExtraction(null)
    setUploadError(null)
    setIsExtracting(true)

    try {
      const result =
        fileArray.length === 1
          ? await extractUploadedDocument(fileArray[0])
          : await extractUploadedDocuments(fileArray)

      setExtraction(result)
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Could not extract readable text from the selected files.',
      )
    } finally {
      setIsExtracting(false)
    }
  }

  const selectedLabel =
    selectedFileNames.length === 0
      ? 'Choose document files'
      : selectedFileNames.length === 1
        ? selectedFileNames[0]
        : `${selectedFileNames.length} files selected`

  return (
    <section className="flex flex-col">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,.csv"
        className="hidden"
        onChange={(event) => handleFileSelect(event.target.files)}
      />

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back to input methods
        </button>

        <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {template.title}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm font-medium text-stone-500">Upload / Document</p>

        <h2 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900">
          Upload one or more source documents
        </h2>

        <p className="mt-4 max-w-[820px] text-base leading-7 text-stone-500">
          Upload PDF, DOCX, TXT, MD or CSV files. The workspace extracts readable
          text and combines it as source context for the{' '}
          <span className="font-semibold text-stone-700">{template.title}</span>{' '}
          template.
        </p>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[32px] border border-stone-200 bg-white p-7 shadow-[0_18px_50px_rgba(28,25,23,0.05)]">
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-stone-50 p-6">
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[24px] bg-white text-center shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-stone-200 text-lg font-semibold text-stone-700">
                D
              </div>

              <p className="mt-6 text-lg font-semibold text-stone-900">
                {selectedLabel}
              </p>

              <p className="mt-3 max-w-[420px] text-sm leading-7 text-stone-500">
                Select up to 10 files. Text-based PDFs, DOCX and TXT files work
                best. Scanned image-only PDFs need OCR later.
              </p>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Choose files
              </button>
            </div>
          </div>

          {selectedFileNames.length > 1 && (
            <div className="mt-5 rounded-[22px] border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Selected files
              </p>

              <div className="mt-3 space-y-2">
                {selectedFileNames.map((fileName) => (
                  <p key={fileName} className="text-sm text-stone-600">
                    {fileName}
                  </p>
                ))}
              </div>
            </div>
          )}

          {isExtracting && (
            <div className="mt-5 rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-600">
              Extracting document text...
            </div>
          )}

          {uploadError && (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700">
              {uploadError}
            </div>
          )}

          {extraction && (
            <div className="mt-6 rounded-[24px] border border-stone-200 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Extraction ready
              </p>

              <p className="mt-3 text-sm font-semibold text-stone-900">
                {extraction.fileName}
              </p>

              <p className="mt-2 text-sm leading-7 text-stone-500">
                {extraction.characterCount} characters extracted
                {extraction.fileCount
                  ? ` from ${extraction.fileCount} files.`
                  : '.'}
              </p>

              <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-stone-400">
                {extraction.extension || extraction.mimeType}
              </p>

              <div className="mt-4 max-h-[220px] overflow-auto rounded-[18px] bg-white p-4 text-left text-sm leading-7 text-stone-600">
                {extraction.extractedText.slice(0, 1600)}
                {extraction.extractedText.length > 1600 ? '...' : ''}
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              type="button"
              disabled={!extraction}
              onClick={() => extraction && onContinue(extraction)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to generate
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            Multi-file tips
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-stone-900">
                Combine related files
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                Upload notes, reports, plans or lesson files together so the AI
                can generate from the full context.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-900">
                Keep files relevant
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                Better source files produce better final documents. Avoid mixing
                unrelated topics.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default DocumentUploadView
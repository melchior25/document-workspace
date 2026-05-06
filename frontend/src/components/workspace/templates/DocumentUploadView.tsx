import { useRef, useState } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'
import {
  extractUploadedDocument,
  extractUploadedDocuments,
} from '../../../features/uploads/uploadApi'
import type { UploadedDocumentExtraction } from '../../../features/uploads/upload.types'
import TemplateFlowHeader from './TemplateFlowHeader'
import TemplateFlowPanel from './TemplateFlowPanel'

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

  const hasFailedFiles = Boolean(extraction?.failedFiles?.length)

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

      <TemplateFlowHeader
        template={template}
        eyebrow="Upload / Document"
        title="Upload source files and turn them into a structured draft"
        backLabel="Back to input methods"
        onBack={onBack}
        description={
          <>
            Upload PDF, DOCX, TXT, MD or CSV files. The workspace extracts readable
            text and combines it as source context for the{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            template.
          </>
        }
      />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[34px] border border-stone-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
          <div className="rounded-[30px] border border-dashed border-stone-300 bg-stone-50 p-5">
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] bg-white px-6 text-center shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-stone-950 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_36px_rgba(28,25,23,0.16)]">
                Doc
              </div>

              <p className="mt-6 max-w-[520px] text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {selectedLabel}
              </p>

              <p className="mt-3 max-w-[480px] text-sm leading-7 text-stone-500">
                Select up to 10 related files. Text-based PDFs, DOCX and TXT files
                work best. Scanned image-only PDFs need OCR later.
              </p>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                Choose files
              </button>
            </div>
          </div>

          {selectedFileNames.length > 0 && (
            <div className="mt-5 rounded-[24px] border border-stone-200/80 bg-stone-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Selected files
                </p>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  {selectedFileNames.length} total
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {selectedFileNames.map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 text-sm text-stone-600"
                  >
                    <span className="h-2 w-2 rounded-full bg-stone-300" />
                    <span className="truncate">{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isExtracting && (
            <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-stone-900" />
              Extracting readable document text...
            </div>
          )}

          {uploadError && (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700">
              {uploadError}
            </div>
          )}

          {extraction && (
            <div className="mt-6 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Extraction ready
                  </p>

                  <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                    {extraction.fileName}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 shadow-sm">
                  {extraction.characterCount} characters
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Files
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-900">
                    {extraction.fileCount || 1}
                  </p>
                </div>

                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Type
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-stone-900">
                    {extraction.extension || extraction.mimeType}
                  </p>
                </div>

                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-900">
                    Ready
                  </p>
                </div>
              </div>

              {hasFailedFiles && (
                <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                  Some files could not be fully extracted. The readable content
                  that was extracted can still be used.
                </div>
              )}

              <div className="mt-4 max-h-[240px] overflow-auto rounded-[20px] bg-white p-4 text-left text-sm leading-7 text-stone-600">
                {extraction.extractedText.slice(0, 1600)}
                {extraction.extractedText.length > 1600 ? '...' : ''}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!extraction}
              onClick={() => extraction && onContinue(extraction)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Continue to generate
            </button>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Choose different files
            </button>
          </div>
        </div>

        <TemplateFlowPanel eyebrow="Upload guide" title="Use clean source files">
          <div className="space-y-5">
            {[
              [
                'Combine related files',
                'Upload notes, reports, plans or lesson files together so the AI can use the full context.',
              ],
              [
                'Keep the topic focused',
                'Avoid mixing unrelated subjects. Better source files produce better final documents.',
              ],
              [
                'Check the preview',
                'After extraction, scan the text preview before continuing to generation.',
              ],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[22px] bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-950">{title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">{copy}</p>
              </div>
            ))}
          </div>
        </TemplateFlowPanel>
      </div>
    </section>
  )
}

export default DocumentUploadView

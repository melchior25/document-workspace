import { useEffect, useState } from 'react'
import GeneratedDocumentView from '../../components/workspace/templates/GeneratedDocumentView'
import { getSavedDocumentById } from '../../features/documents/documentLibraryApi'
import type { SavedDocument } from '../../features/documents/documentLibrary.types'
import type { GeneratedDocument } from '../../features/generation/generation.types'

function convertSavedToGeneratedDocument(
  savedDocument: SavedDocument,
): GeneratedDocument {
  const mainContent = savedDocument.sections
    .map((section) => `${section.heading}\n${section.content}`)
    .join('\n\n')

  return {
    id: savedDocument.documentId || savedDocument.id,
    templateId: savedDocument.templateTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-'),
    templateTitle: savedDocument.templateTitle,
    templateCategory: savedDocument.templateCategory,
    inputMode: savedDocument.inputMode,
    status: 'loaded_saved_document',
    title: savedDocument.title,
    summary: savedDocument.summary,
    mainContent,
    notes: savedDocument.notes,
    generatedSections: savedDocument.sections,
    generationInstruction: {
      templateId: savedDocument.templateTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      templateTitle: savedDocument.templateTitle,
      templateCategory: savedDocument.templateCategory,
      inputMode: savedDocument.inputMode,
      tone: 'saved document tone',
      purpose: 'Continue editing a saved document.',
      requiredSections: savedDocument.sections.map((section) => section.heading),
      sourceInput: '',
      sourceMeta: {
        mode: 'saved-document',
        chunkCount: 1,
        totalCharacters: mainContent.length,
      },
      instruction: 'Loaded from saved document library.',
    },
    sourcePreview: null,
    createdAt: savedDocument.savedAt,
  }
}

function SavedDocumentEditorPage() {
  const [document, setDocument] = useState<GeneratedDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDocument() {
      const id = window.location.pathname.split('/').filter(Boolean)[1]

      if (!id) {
        setError('Missing document id.')
        setLoading(false)
        return
      }

      try {
        const savedDocument = await getSavedDocumentById(id)
        setDocument(convertSavedToGeneratedDocument(savedDocument))
      } catch {
        setError('Could not load this saved document.')
      } finally {
        setLoading(false)
      }
    }

    loadDocument()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6f3] px-8 py-8">
        <div className="mx-auto max-w-[1300px] rounded-[24px] border border-stone-200 bg-white p-6 text-sm text-stone-500">
          Loading saved document...
        </div>
      </main>
    )
  }

  if (error || !document) {
    return (
      <main className="min-h-screen bg-[#f7f6f3] px-8 py-8">
        <div className="mx-auto max-w-[1300px] rounded-[24px] border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
          {error || 'Saved document not found.'}
        </div>

        <div className="mx-auto mt-6 max-w-[1300px]">
          <a
            href="/documents"
            className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            Back to documents
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f6f3] px-8 py-8">
      <div className="mx-auto max-w-[1400px]">
        <GeneratedDocumentView
          document={document}
          onBack={() => {
            window.location.href = '/documents'
          }}
        />
      </div>
    </main>
  )
}

export default SavedDocumentEditorPage
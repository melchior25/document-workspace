import type { GeneratedDocument } from '../../../features/generation/generation.types'
import GeneratedDocumentCanvas from './generatedDocument/GeneratedDocumentCanvas'
import GeneratedDocumentSidebar from './generatedDocument/GeneratedDocumentSidebar'
import { useGeneratedDocumentEditor } from './generatedDocument/useGeneratedDocumentEditor'

type GeneratedDocumentViewProps = {
  document: GeneratedDocument
  onBack: () => void
}

function GeneratedDocumentView({
  document,
  onBack,
}: GeneratedDocumentViewProps) {
  const editor = useGeneratedDocumentEditor({ document, onBack })

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={editor.onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950"
        >
          Back to generation
        </button>

        <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 shadow-sm">
          Premium editable document
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GeneratedDocumentCanvas editor={editor} />
        <GeneratedDocumentSidebar editor={editor} />
      </div>
    </section>
  )
}

export default GeneratedDocumentView
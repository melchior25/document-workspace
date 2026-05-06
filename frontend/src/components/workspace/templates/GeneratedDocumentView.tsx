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
      <div className="rounded-[30px] border border-stone-200/80 bg-white px-5 py-4 shadow-sm md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              Editable document workspace
            </p>
            <h2 className="mt-1 truncate text-xl font-semibold tracking-[-0.025em] text-stone-950">
              {editor.title || document.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={editor.onBack}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950"
            >
              Back to generation
            </button>

            <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              AI-assisted editor
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
        <GeneratedDocumentCanvas editor={editor} />
        <GeneratedDocumentSidebar editor={editor} />
      </div>
    </section>
  )
}

export default GeneratedDocumentView

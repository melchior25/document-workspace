import type { TemplateItem } from '../../../data/templates/template.types'
import type { GeneratedDocument } from '../../../features/generation/generation.types'
import type { TemplateInputMode } from './TemplateInputModeView'

type GenerationPrepViewProps = {
  template: TemplateItem
  inputMode: TemplateInputMode
  generatedDocument: GeneratedDocument | null
  isGenerating: boolean
  errorMessage: string | null
  onBack: () => void
  onGenerate: () => void
}

function GenerationPrepView({
  template,
  inputMode,
  generatedDocument,
  isGenerating,
  errorMessage,
  onBack,
  onGenerate,
}: GenerationPrepViewProps) {
  const inputModeLabel =
    inputMode === 'prompt' ? 'Prompt / Text' : 'Upload Document'

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back
        </button>

        <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {template.title}
        </div>
      </div>

      <div className="mt-10 rounded-[32px] border border-stone-200 bg-white p-8 shadow-[0_18px_50px_rgba(28,25,23,0.05)]">
        <p className="text-sm font-medium text-stone-500">Generation</p>
        <h2 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900">
          Ready to generate
        </h2>
        <p className="mt-4 max-w-[760px] text-base leading-7 text-stone-500">
          The selected template and input mode are ready. This call now connects
          to the backend generation endpoint.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              Template
            </p>
            <p className="mt-3 text-lg font-semibold text-stone-900">
              {template.title}
            </p>
          </div>

          <div className="rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              Input mode
            </p>
            <p className="mt-3 text-lg font-semibold text-stone-900">
              {inputModeLabel}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {generatedDocument && (
          <div className="mt-6 rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
              Backend response
            </p>
            <p className="mt-3 text-lg font-semibold text-stone-900">
              {generatedDocument.title}
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-500">
              {generatedDocument.summary}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating ? 'Generating...' : 'Generate document'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Review input again
          </button>
        </div>
      </div>
    </section>
  )
}

export default GenerationPrepView
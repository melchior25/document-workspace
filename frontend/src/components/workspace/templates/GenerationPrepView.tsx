import type { TemplateItem } from '../../../data/templates/template.types'
import type { GeneratedDocument } from '../../../features/generation/generation.types'
import type { TemplateInputMode } from './TemplateInputModeView'
import TemplateFlowHeader from './TemplateFlowHeader'

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
      <TemplateFlowHeader
        template={template}
        eyebrow="Generation check"
        title="Final review before the workspace creates your document"
        backLabel="Back"
        onBack={onBack}
        description={
          <>
            Your selected template and source input are ready. Start generation
            when you are ready to create the editable{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            draft.
          </>
        }
      />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[34px] border border-stone-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-stone-500">
                Ready to generate
              </p>

              <h3 className="mt-2 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-stone-950">
                Everything is prepared
              </h3>

              <p className="mt-4 max-w-[680px] text-sm leading-7 text-stone-500">
                The backend will now receive the selected template, input method,
                and source content. The result opens directly in the editor.
              </p>
            </div>

            <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Final check
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Template
              </p>

              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {template.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                The final draft will follow this document structure.
              </p>
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Input mode
              </p>

              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {inputModeLabel}
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Source content has been prepared for generation.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-stone-200/80 bg-white p-3">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                [
                  '1',
                  'Read source',
                  inputMode === 'document'
                    ? 'Use extracted document text.'
                    : 'Use your prompt instructions.',
                ],
                ['2', 'Shape structure', 'Apply the selected template rules.'],
                ['3', 'Open editor', 'Create an editable professional draft.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="rounded-[22px] bg-stone-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-900 shadow-sm">
                      {number}
                    </span>

                    <p className="text-sm font-semibold text-stone-950">
                      {title}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-stone-500">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium leading-7 text-red-700">
              {errorMessage}
            </div>
          )}

          {generatedDocument && (
            <div className="mt-6 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Last generated draft
              </p>

              <p className="mt-3 text-lg font-semibold text-stone-950">
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
              className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(28,25,23,0.16)] transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? 'Generating...' : 'Generate document'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Review input again
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[32px] border border-stone-200/80 bg-stone-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            What happens next
          </p>

          <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-950">
            The editor opens automatically
          </h3>

          <div className="mt-5 space-y-4">
            {[
              'You can edit title, summary, sections, and notes.',
              'You can regenerate sections or improve selected text.',
              'You can save, review, compare, and export after generation.',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-[22px] bg-white p-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-stone-400" />
                <p className="text-sm leading-7 text-stone-500">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default GenerationPrepView

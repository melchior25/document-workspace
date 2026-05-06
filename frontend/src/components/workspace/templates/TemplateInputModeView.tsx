import type { TemplateItem } from '../../../data/templates/template.types'
import TemplateFlowHeader from './TemplateFlowHeader'

type TemplateInputMode = 'prompt' | 'document'

type TemplateInputModeViewProps = {
  template: TemplateItem
  onBack: () => void
  onSelectMode: (mode: TemplateInputMode) => void
}

function TemplateInputModeView({
  template,
  onBack,
  onSelectMode,
}: TemplateInputModeViewProps) {
  return (
    <section className="flex flex-col">
      <TemplateFlowHeader
        template={template}
        eyebrow="Choose input method"
        title="Start with your own text or with an existing document"
        backLabel="Back to preview"
        onBack={onBack}
        description={
          <>
            Choose how the workspace should receive content for the{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            template. Both paths lead to the same final review screen before
            generation starts.
          </>
        }
      >
        <div className="grid gap-3 rounded-[28px] border border-stone-200/80 bg-white p-3 shadow-[0_18px_50px_rgba(28,25,23,0.045)] md:grid-cols-3">
          {[
            ['1', 'Input', 'Choose prompt or upload.'],
            ['2', 'Review', 'Check the selected source.'],
            ['3', 'Generate', 'Open the editable document.'],
          ].map(([number, label, copy]) => (
            <div
              key={number}
              className="rounded-[22px] bg-stone-50 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-900 shadow-sm">
                  {number}
                </span>
                <p className="text-sm font-semibold text-stone-950">{label}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-500">{copy}</p>
            </div>
          ))}
        </div>
      </TemplateFlowHeader>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelectMode('prompt')}
          className="group rounded-[34px] border border-stone-200/80 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.055)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-lg font-semibold text-white shadow-[0_14px_30px_rgba(28,25,23,0.18)]">
              T
            </div>

            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
              Best for new content
            </span>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 1
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
              Prompt / Text
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Type or speak what the document should contain. This is ideal for
              lesson plans, letters, reports, ideas, notes, or rough instructions.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
            <div className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="space-y-3">
                <div className="h-[7px] w-32 rounded-full bg-stone-300" />
                <div className="h-[7px] w-full rounded-full bg-stone-200" />
                <div className="h-[7px] w-11/12 rounded-full bg-stone-200" />
                <div className="h-[7px] w-8/12 rounded-full bg-stone-200" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Typed notes', 'Voice input', 'Instructions'].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with prompt
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('document')}
          className="group rounded-[34px] border border-stone-200/80 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.055)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-lg font-semibold text-stone-950 shadow-sm">
              D
            </div>

            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
              Best for source files
            </span>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 2
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
              Upload Document
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Upload one or more existing files. The workspace extracts readable
              text and uses it as the source for the selected template.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-dashed border-stone-300 bg-stone-50 p-5">
            <div className="flex min-h-[148px] flex-col items-center justify-center rounded-[20px] bg-white text-center shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-sm font-bold text-stone-700">
                PDF
              </div>

              <p className="mt-4 text-sm font-semibold text-stone-800">
                Browse and extract text
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-400">
                PDF, DOCX, TXT, MD and CSV
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Reports', 'Plans', 'Notes'].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with document
          </div>
        </button>
      </div>
    </section>
  )
}

export default TemplateInputModeView
export type { TemplateInputMode }

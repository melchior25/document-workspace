import type { TemplateItem } from '../../../data/templates/template.types'

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
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back to preview
        </button>

        <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {template.title}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm font-medium text-stone-500">Choose input method</p>
        <h2 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900">
          How do you want to generate this document?
        </h2>
        <p className="mt-4 max-w-[760px] text-base leading-7 text-stone-500">
          Choose how you want to provide content for the{' '}
          <span className="font-semibold text-stone-700">{template.title}</span>{' '}
          template. You can either describe what you want through prompt/text or
          upload an existing document to use as the source.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelectMode('prompt')}
          className="group rounded-[32px] border border-stone-200 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.05)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-900 text-lg font-semibold text-white">
            T
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 1
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-stone-900">
              Prompt / Text
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              Describe what should be included in the document, paste your notes,
              or write instructions for the AI to follow within this template.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-stone-200 bg-stone-50 p-5">
            <div className="space-y-3">
              <div className="h-[6px] w-28 rounded bg-stone-300" />
              <div className="h-[6px] w-full rounded bg-stone-200" />
              <div className="h-[6px] w-11/12 rounded bg-stone-200" />
              <div className="h-[6px] w-8/12 rounded bg-stone-200" />
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with prompt
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('document')}
          className="group rounded-[32px] border border-stone-200 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.05)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-lg font-semibold text-stone-900">
            D
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 2
            </p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-stone-900">
              Upload Document
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-500">
              Upload an existing file and let the system extract, reshape, and fit
              the content into the selected template structure.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] border border-dashed border-stone-300 bg-stone-50 p-5">
            <div className="flex min-h-[112px] flex-col items-center justify-center rounded-[18px] bg-white text-center">
              <div className="h-10 w-10 rounded-2xl bg-stone-200" />
              <p className="mt-4 text-sm font-medium text-stone-700">
                Drop file here or browse
              </p>
              <p className="mt-2 text-xs text-stone-400">
                PDF, DOCX and other supported documents
              </p>
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with document
          </div>
        </button>
      </div>
    </section>
  )
}

export default TemplateInputModeView
export type { TemplateInputMode }
import TemplateCardPreview from './TemplateCardPreview'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplatePreviewViewProps = {
  template: TemplateItem
  onBack: () => void
  onUseTemplate: (template: TemplateItem) => void
}

function formatCategoryLabel(category: string) {
  if (category === 'study-teaching') {
    return 'Study & Teaching'
  }

  return category.charAt(0).toUpperCase() + category.slice(1)
}

function TemplatePreviewView({
  template,
  onBack,
  onUseTemplate,
}: TemplatePreviewViewProps) {
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back to templates
        </button>

        <button
          type="button"
          onClick={() => onUseTemplate(template)}
          className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
        >
          Use this template
        </button>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[36px] border border-stone-200 bg-[linear-gradient(180deg,#f7f6f3_0%,#ece7df_100%)] p-6 shadow-[0_20px_60px_rgba(28,25,23,0.06)]">
          <div className="rounded-[30px] bg-white p-8 shadow-[0_30px_90px_rgba(28,25,23,0.10)]">
            <div className="mx-auto max-w-[760px]">
              <div className="mb-8 flex items-start justify-between gap-6 border-b border-stone-200 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                    Template preview
                  </p>
                  <h2 className="mt-3 text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-stone-900">
                    {template.title}
                  </h2>
                </div>

                <div className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  {formatCategoryLabel(template.category)}
                </div>
              </div>

              <div className="rounded-[28px] bg-[linear-gradient(180deg,#faf9f7_0%,#f1ece4_100%)] p-8">
                <div className="mx-auto max-w-[620px] rounded-[24px] bg-white p-6 shadow-[0_24px_70px_rgba(28,25,23,0.12)]">
                  <TemplateCardPreview previewKey={template.previewKey} />
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Layout
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Structured and presentation-ready with a polished visual hierarchy.
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Input
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Works with prompt-based input and document-based generation flows.
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Output
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Built for editable, export-ready documents after generation.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onUseTemplate(template)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Continue with this template
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            Overview
          </p>

          <div className="mt-5">
            <h3 className="text-xl font-semibold tracking-[-0.02em] text-stone-900">
              {template.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-500">
              {template.description}
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Category
              </p>
              <p className="mt-2 text-sm font-medium text-stone-700">
                {formatCategoryLabel(template.category)}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Best for
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                Users who want a clean, structured starting point before generating and editing content.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Next step
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                Continue to choose whether you want to generate from prompt/text or from a document.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-stone-900 px-6 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Use this template
            </button>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default TemplatePreviewView
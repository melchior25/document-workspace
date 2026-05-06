import type { TemplateItem } from '../../../data/templates/template.types'
import type { TemplateInputMode } from './TemplateInputModeView'

type GenerationLoadingViewProps = {
  template: TemplateItem
  inputMode: TemplateInputMode
}

function GenerationLoadingView({
  template,
  inputMode,
}: GenerationLoadingViewProps) {
  const sourceLabel =
    inputMode === 'document' ? 'uploaded source content' : 'prompt instructions'

  return (
    <section className="flex min-h-[660px] items-center justify-center">
      <div className="w-full max-w-[920px] rounded-[42px] border border-stone-200/80 bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-stone-950 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_46px_rgba(28,25,23,0.22)]">
          Doc
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
          Generating document
        </p>

        <h2 className="mx-auto mt-4 max-w-[720px] text-[42px] font-semibold leading-[1.05] tracking-[-0.045em] text-stone-950 md:text-[48px]">
          Building your {template.title}
        </h2>

        <p className="mx-auto mt-5 max-w-[660px] text-sm leading-7 text-stone-500">
          The workspace is reading your {sourceLabel}, applying the selected
          template structure, and preparing an editable professional document.
        </p>

        <div className="mx-auto mt-10 max-w-[620px] rounded-[30px] border border-stone-200/80 bg-stone-50 p-3 text-left">
          <div className="grid gap-3">
            {[
              [
                'Understanding source content',
                'Identifying the important information and context.',
              ],
              [
                'Applying template structure',
                'Organizing sections, tone, and document rules.',
              ],
              [
                'Preparing editable draft',
                'Creating the document that will open in the editor.',
              ],
            ].map(([title, copy], index) => (
              <div
                key={title}
                className="flex gap-4 rounded-[24px] bg-white p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-950 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <div>
                  <p className="text-sm font-semibold text-stone-950">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-stone-500">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-9 max-w-[460px]">
          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-stone-950" />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-900" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-300" />
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[560px] text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
          Please keep this page open while generation completes
        </p>
      </div>
    </section>
  )
}

export default GenerationLoadingView

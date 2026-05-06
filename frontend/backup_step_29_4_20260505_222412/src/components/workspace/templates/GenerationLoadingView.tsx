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
  return (
    <section className="flex min-h-[620px] items-center justify-center">
      <div className="w-full max-w-[860px] rounded-[40px] border border-stone-200 bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-stone-900 text-sm font-bold uppercase tracking-[0.18em] text-white">
          AI
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
          Generating document
        </p>

        <h2 className="mx-auto mt-4 max-w-[680px] text-[42px] font-semibold leading-[1.05] tracking-[-0.04em] text-stone-950">
          Building your {template.title}
        </h2>

        <p className="mx-auto mt-5 max-w-[640px] text-sm leading-7 text-stone-500">
          The workspace is reading your {inputMode === 'document' ? 'uploaded source content' : 'prompt'},
          applying the selected template structure, and preparing an editable
          professional document.
        </p>

        <div className="mx-auto mt-9 max-w-[520px] space-y-3 text-left">
          <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
            <p className="text-sm font-semibold text-stone-900">
              1. Understanding source content
            </p>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              The AI is identifying the important information and context.
            </p>
          </div>

          <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
            <p className="text-sm font-semibold text-stone-900">
              2. Applying template structure
            </p>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              Sections, tone, and template rules are being applied.
            </p>
          </div>

          <div className="rounded-[22px] border border-stone-200 bg-stone-50 px-5 py-4">
            <p className="text-sm font-semibold text-stone-900">
              3. Preparing editable draft
            </p>
            <p className="mt-1 text-xs leading-6 text-stone-500">
              The final document will open in the editor when ready.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-9 h-2 max-w-[420px] overflow-hidden rounded-full bg-stone-100">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-stone-900" />
        </div>
      </div>
    </section>
  )
}

export default GenerationLoadingView
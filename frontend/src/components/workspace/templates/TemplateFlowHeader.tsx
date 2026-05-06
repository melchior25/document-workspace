import type { ReactNode } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplateFlowHeaderProps = {
  template: TemplateItem
  eyebrow: string
  title: string
  description: ReactNode
  backLabel: string
  onBack: () => void
  children?: ReactNode
}

function TemplateFlowHeader({
  template,
  eyebrow,
  title,
  description,
  backLabel,
  onBack,
  children,
}: TemplateFlowHeaderProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-[0_8px_24px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5 hover:bg-stone-50"
        >
          {backLabel}
        </button>

        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
          {template.title}
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-sm font-semibold text-stone-500">{eyebrow}</p>

          <h2 className="mt-2 max-w-[900px] text-[40px] font-semibold leading-[1.06] tracking-[-0.035em] text-stone-950 md:text-[46px]">
            {title}
          </h2>

          <p className="mt-4 max-w-[820px] text-base leading-7 text-stone-500">
            {description}
          </p>
        </div>

        <div className="rounded-[30px] border border-stone-200/80 bg-stone-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
            Selected template
          </p>

          <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
            {template.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Keep this flow focused: choose input, review source, then generate an
            editable professional draft.
          </p>
        </div>
      </div>

      {children && <div className="mt-8">{children}</div>}
    </div>
  )
}

export default TemplateFlowHeader

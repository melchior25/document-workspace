import type { ReactNode } from 'react'

type TemplateFlowPanelProps = {
  eyebrow: string
  title: string
  children: ReactNode
}

function TemplateFlowPanel({
  eyebrow,
  title,
  children,
}: TemplateFlowPanelProps) {
  return (
    <aside className="h-fit rounded-[30px] border border-stone-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
        {eyebrow}
      </p>

      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-950">
        {title}
      </h3>

      <div className="mt-5">{children}</div>
    </aside>
  )
}

export default TemplateFlowPanel

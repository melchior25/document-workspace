import TemplateCard from './TemplateCard'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplateGridProps = {
  templates: TemplateItem[]
  onTemplateSelect: (template: TemplateItem) => void
}

function TemplateGrid({ templates, onTemplateSelect }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="rounded-[34px] border border-dashed border-stone-300 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(28,25,23,0.045)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-sm font-bold uppercase tracking-[0.16em] text-stone-500">
          No
        </div>

        <h4 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
          No templates found
        </h4>

        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-7 text-stone-500">
          Try a different search term or choose another category. Templates are
          the first step in the guided document creation flow.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  )
}

export default TemplateGrid

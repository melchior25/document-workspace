import TemplateCard from './TemplateCard'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplateGridProps = {
  templates: TemplateItem[]
  onTemplateSelect: (template: TemplateItem) => void
}

function TemplateGrid({ templates, onTemplateSelect }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
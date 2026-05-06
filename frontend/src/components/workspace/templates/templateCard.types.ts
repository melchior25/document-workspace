import type { TemplateItem } from '../../../data/templates/template.types'

export type TemplateCardProps = {
  template: TemplateItem
  onSelect: (template: TemplateItem) => void
}
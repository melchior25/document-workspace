import type { TemplateItem } from '../../data/templates/template.types'
import type { TemplateCategoryTab } from '../../components/workspace/categories/categoryTabs.types'

export function filterTemplatesByCategory(
  templates: TemplateItem[],
  activeCategory: TemplateCategoryTab,
) {
  if (activeCategory === 'all') {
    return templates
  }

  return templates.filter((template) => template.category === activeCategory)
}
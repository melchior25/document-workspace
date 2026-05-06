import type { TemplateItem } from '../../data/templates/template.types'

export function filterTemplatesBySearch(
  templates: TemplateItem[],
  searchQuery: string,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  if (!normalizedQuery) {
    return templates
  }

  return templates.filter((template) => {
    const titleMatch = template.title.toLowerCase().includes(normalizedQuery)
    const descriptionMatch = template.description
      .toLowerCase()
      .includes(normalizedQuery)

    return titleMatch || descriptionMatch
  })
}
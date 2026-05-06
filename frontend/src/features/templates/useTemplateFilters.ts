import { useMemo, useState } from 'react'
import type { TemplateCategoryTab } from '../../components/workspace/categories/categoryTabs.types'
import { templateList } from '../../data/templates/templateList'
import { filterTemplatesByCategory } from './filterTemplatesByCategory'
import { filterTemplatesBySearch } from './filterTemplatesBySearch'

export function useTemplateFilters() {
  const [activeCategory, setActiveCategory] =
    useState<TemplateCategoryTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = useMemo(() => {
    const categoryFiltered = filterTemplatesByCategory(templateList, activeCategory)

    return filterTemplatesBySearch(categoryFiltered, searchQuery)
  }, [activeCategory, searchQuery])

  return {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
  }
}
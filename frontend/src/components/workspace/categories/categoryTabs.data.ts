import type { TemplateCategoryTab } from './categoryTabs.types'

export type CategoryTabItem = {
  id: TemplateCategoryTab
  label: string
}

export const categoryTabs: CategoryTabItem[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'planning', label: 'Planning' },
  { id: 'reports', label: 'Reports' },
  { id: 'summaries', label: 'Summaries' },
  { id: 'communication', label: 'Communication' },
  { id: 'study-teaching', label: 'Study & Teaching' },
  { id: 'presentations', label: 'Presentations' },
]
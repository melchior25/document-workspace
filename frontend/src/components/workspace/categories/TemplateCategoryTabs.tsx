import { categoryTabs } from './categoryTabs.data'
import type { TemplateCategoryTab } from './categoryTabs.types'

type TemplateCategoryTabsProps = {
  activeCategory: TemplateCategoryTab
  onCategoryChange: (category: TemplateCategoryTab) => void
}

function TemplateCategoryTabs({
  activeCategory,
  onCategoryChange,
}: TemplateCategoryTabsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {categoryTabs.map((tab) => {
        const isActive = tab.id === activeCategory

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onCategoryChange(tab.id)}
            className={
              isActive
                ? 'rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm'
                : 'rounded-full border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100'
            }
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default TemplateCategoryTabs
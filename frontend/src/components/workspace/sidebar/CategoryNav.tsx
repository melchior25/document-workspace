type CategoryItem = {
  label: string
  helper: string
}

const categoryItems: CategoryItem[] = [
  {
    label: 'Planning',
    helper: 'Lessons, schedules, projects',
  },
  {
    label: 'Reports',
    helper: 'Progress, status, incidents',
  },
  {
    label: 'Summaries',
    helper: 'Shorten source material',
  },
  {
    label: 'Communication',
    helper: 'Letters and messages',
  },
  {
    label: 'Study & Teaching',
    helper: 'Education-ready documents',
  },
  {
    label: 'Presentations',
    helper: 'Slides and speaking notes',
  },
]

function CategoryNav() {
  return (
    <section aria-label="Template categories">
      <div className="flex items-center justify-between px-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-stone-400">
          Categories
        </p>
        <span className="rounded-full bg-stone-200/70 px-2 py-1 text-[0.68rem] font-semibold text-stone-500">
          {categoryItems.length}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {categoryItems.map((item) => (
          <button key={item.label} type="button" className="nav-item group">
            <span className="flex min-w-0 items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-stone-300 transition group-hover:bg-stone-900" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-700 group-hover:text-stone-950">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-stone-400 group-hover:text-stone-500">
                  {item.helper}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryNav

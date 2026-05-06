function CategoryNav() {
  const items = [
    'Planning',
    'Reports',
    'Summaries',
    'Communication',
    'Study & Teaching',
    'Presentations',
  ]

  return (
    <div className="mt-8">
      <p className="px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-stone-400">
        Categories
      </p>

      <div className="mt-3 space-y-1">
        {items.map((item) => (
          <button key={item} className="nav-item">
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryNav
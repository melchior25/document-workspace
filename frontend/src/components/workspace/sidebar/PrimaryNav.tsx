type PrimaryNavItem = {
  label: string
  helper: string
  active?: boolean
}

const primaryItems: PrimaryNavItem[] = [
  {
    label: 'Home',
    helper: 'Start a new document',
    active: true,
  },
  {
    label: 'Saved documents',
    helper: 'Open previous work',
  },
  {
    label: 'Templates',
    helper: 'Browse document types',
  },
  {
    label: 'AI tools',
    helper: 'Review, summary, compare',
  },
]

function PrimaryNav() {
  return (
    <nav aria-label="Workspace navigation">
      <p className="px-4 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-stone-400">
        Workspace
      </p>

      <div className="mt-3 space-y-1.5">
        {primaryItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={
              item.active
                ? 'flex w-full items-center justify-between rounded-[18px] bg-white px-4 py-3 text-left shadow-sm ring-1 ring-black/5'
                : 'nav-item group'
            }
          >
            <span className="min-w-0">
              <span
                className={
                  item.active
                    ? 'block text-sm font-semibold text-stone-950'
                    : 'block text-sm font-semibold text-stone-700 group-hover:text-stone-950'
                }
              >
                {item.label}
              </span>
              <span
                className={
                  item.active
                    ? 'mt-0.5 block text-xs font-medium text-stone-500'
                    : 'mt-0.5 block text-xs font-medium text-stone-400 group-hover:text-stone-500'
                }
              >
                {item.helper}
              </span>
            </span>

            {item.active && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-stone-950" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default PrimaryNav

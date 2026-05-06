import NotificationButton from './NotificationButton'
import TemplateSearchInput from './TemplateSearchInput'

type WorkspaceTopbarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
}

function WorkspaceTopbar({
  searchQuery,
  onSearchChange,
}: WorkspaceTopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-stone-200/80 bg-white/82 px-4 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between md:px-5">
      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-stone-400">
          Template-first workspace
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-stone-800">
          Choose a structure, add source content, then refine the generated document.
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <TemplateSearchInput value={searchQuery} onChange={onSearchChange} />
        <NotificationButton />
      </div>
    </header>
  )
}

export default WorkspaceTopbar

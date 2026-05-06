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
    <div className="flex items-center justify-between gap-6">
      <TemplateSearchInput
        value={searchQuery}
        onChange={onSearchChange}
      />
      <NotificationButton />
    </div>
  )
}

export default WorkspaceTopbar
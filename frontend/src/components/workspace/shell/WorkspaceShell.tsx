import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceMain from './WorkspaceMain'

function WorkspaceShell() {
  return (
    <div className="min-h-screen bg-[#f4f1eb] px-3 py-3 md:px-5 md:py-5 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[1580px] overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-[0_28px_90px_rgba(28,25,23,0.10)] md:h-[calc(100vh-2.5rem)]">
        <WorkspaceSidebar />
        <WorkspaceMain />
      </div>
    </div>
  )
}

export default WorkspaceShell

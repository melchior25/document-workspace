import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceMain from './WorkspaceMain'

function WorkspaceShell() {
  return (
    <div className="min-h-screen bg-[#f4f1eb] px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-[1560px] overflow-hidden rounded-[34px] border border-stone-200/80 bg-white shadow-[0_28px_90px_rgba(28,25,23,0.10)]">
        <WorkspaceSidebar />
        <WorkspaceMain />
      </div>
    </div>
  )
}

export default WorkspaceShell
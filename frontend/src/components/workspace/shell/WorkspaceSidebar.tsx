import BrandMark from '../sidebar/BrandMark'
import CreateDocumentButton from '../sidebar/CreateDocumentButton'
import PrimaryNav from '../sidebar/PrimaryNav'
import CategoryNav from '../sidebar/CategoryNav'
import UpgradeCard from '../sidebar/UpgradeCard'
import UserProfileCard from '../sidebar/UserProfileCard'

function WorkspaceSidebar() {
  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-stone-200/80 bg-[#faf9f6] px-5 py-6 lg:flex">
      <div className="flex min-h-0 w-full flex-col">
        <BrandMark />
        <CreateDocumentButton />

        <div className="mt-7 min-h-0 flex-1 space-y-7 overflow-y-auto pr-1">
          <PrimaryNav />
          <CategoryNav />
        </div>

        <div className="mt-5 space-y-3">
          <UpgradeCard />
          <UserProfileCard />
        </div>
      </div>
    </aside>
  )
}

export default WorkspaceSidebar

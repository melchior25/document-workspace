import BrandMark from '../sidebar/BrandMark'
import CreateDocumentButton from '../sidebar/CreateDocumentButton'
import PrimaryNav from '../sidebar/PrimaryNav'
import CategoryNav from '../sidebar/CategoryNav'
import UpgradeCard from '../sidebar/UpgradeCard'
import UserProfileCard from '../sidebar/UserProfileCard'

function WorkspaceSidebar() {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-stone-200/80 bg-stone-50/80 px-5 py-6">
      <BrandMark />
      <CreateDocumentButton />
      <PrimaryNav />
      <CategoryNav />
      <UpgradeCard />
      <UserProfileCard />
    </aside>
  )
}

export default WorkspaceSidebar
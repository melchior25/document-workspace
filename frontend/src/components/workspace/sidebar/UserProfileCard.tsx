function UserProfileCard() {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-stone-200/80 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-700">
        MB
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-950">Mel B</p>
        <p className="truncate text-xs font-medium text-stone-500">
          Local workspace
        </p>
      </div>
    </div>
  )
}

export default UserProfileCard

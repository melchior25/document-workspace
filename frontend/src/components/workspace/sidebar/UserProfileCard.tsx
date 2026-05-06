function UserProfileCard() {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-[24px] border border-stone-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-700">
        MB
      </div>

      <div>
        <p className="text-sm font-semibold text-stone-900">Mel B</p>
        <p className="text-xs text-stone-500">document workspace</p>
      </div>
    </div>
  )
}

export default UserProfileCard
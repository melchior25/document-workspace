function PrimaryNav() {
  return (
    <nav className="mt-8 space-y-1">
      <button className="flex w-full items-center rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-stone-900 shadow-sm ring-1 ring-black/5">
        Home
      </button>
      <button className="nav-item">My Documents</button>
      <button className="nav-item">Templates</button>
      <button className="nav-item">Shared with me</button>
      <button className="nav-item">Trash</button>
    </nav>
  )
}

export default PrimaryNav
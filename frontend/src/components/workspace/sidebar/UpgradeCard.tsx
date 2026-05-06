function UpgradeCard() {
  return (
    <div className="rounded-[26px] border border-stone-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-stone-950">Workspace status</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Ready
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-stone-500">
        Generate, edit, review, compare, save, and export documents from one
        guided workspace.
      </p>
    </div>
  )
}

export default UpgradeCard

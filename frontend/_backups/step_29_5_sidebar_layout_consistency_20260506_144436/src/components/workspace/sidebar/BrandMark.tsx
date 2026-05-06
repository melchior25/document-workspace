function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-sm font-semibold text-white">
        DW
      </div>

      <div className="min-w-0">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-stone-400">
          Workspace
        </p>
        <h1 className="truncate text-lg font-semibold tracking-[-0.02em] text-stone-900">
          Document AI
        </h1>
      </div>
    </div>
  )
}

export default BrandMark
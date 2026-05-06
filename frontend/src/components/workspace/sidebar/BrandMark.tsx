function BrandMark() {
  return (
    <div className="flex items-center gap-3 rounded-[24px] bg-white/70 p-2 shadow-[inset_0_0_0_1px_rgba(231,229,228,0.75)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-stone-900 text-sm font-bold tracking-[-0.02em] text-white shadow-[0_12px_30px_rgba(28,25,23,0.18)]">
        DW
      </div>

      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-400">
          Document workspace
        </p>
        <h1 className="truncate text-lg font-semibold tracking-[-0.03em] text-stone-950">
          Document AI
        </h1>
      </div>
    </div>
  )
}

export default BrandMark

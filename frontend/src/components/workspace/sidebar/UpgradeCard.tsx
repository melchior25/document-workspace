function UpgradeCard() {
  return (
    <div className="mt-auto rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-stone-900">
        Unlock more templates
      </p>

      <p className="mt-2 text-sm text-stone-500">
        Access premium layouts and richer document structures.
      </p>

      <button className="mt-4 h-11 w-full rounded-2xl bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800">
        Upgrade
      </button>
    </div>
  )
}

export default UpgradeCard
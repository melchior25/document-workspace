function CreateDocumentButton() {
  return (
    <button
      type="button"
      className="mt-7 flex w-full items-center justify-between rounded-[22px] bg-stone-950 px-4 py-4 text-left text-white shadow-[0_18px_42px_rgba(28,25,23,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
    >
      <span>
        <span className="block text-sm font-semibold">New document</span>
        <span className="mt-1 block text-xs font-medium text-stone-300">
          Choose template and generate
        </span>
      </span>

      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
        +
      </span>
    </button>
  )
}

export default CreateDocumentButton

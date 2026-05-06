function TemplateSectionHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-stone-500">Browse templates</p>
        <h3 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-stone-950">
          Start with a document structure
        </h3>
        <p className="mt-3 max-w-[620px] text-sm leading-7 text-stone-500">
          Pick the closest structure first. The workspace will help you add
          source content, generate a draft, and refine it in the editor.
        </p>
      </div>

      <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-400 shadow-sm">
        Template-first flow
      </div>
    </section>
  )
}

export default TemplateSectionHeader

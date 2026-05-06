type TemplateSearchInputProps = {
  value: string
  onChange: (value: string) => void
}

function TemplateSearchInput({ value, onChange }: TemplateSearchInputProps) {
  return (
    <label className="flex w-full min-w-[220px] max-w-[460px] items-center gap-3 rounded-full border border-stone-200 bg-stone-50/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus-within:border-stone-300 focus-within:bg-white md:w-[360px] lg:w-[440px]">
      <span className="h-2 w-2 shrink-0 rounded-full bg-stone-300" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search templates"
        className="w-full bg-transparent text-sm font-medium text-stone-700 outline-none placeholder:text-stone-400"
      />
    </label>
  )
}

export default TemplateSearchInput

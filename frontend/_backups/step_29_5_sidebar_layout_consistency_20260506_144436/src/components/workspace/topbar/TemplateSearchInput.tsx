type TemplateSearchInputProps = {
  value: string
  onChange: (value: string) => void
}

function TemplateSearchInput({
  value,
  onChange,
}: TemplateSearchInputProps) {
  return (
    <div className="flex w-full max-w-[520px] items-center rounded-full border border-stone-200 bg-stone-50 px-4 py-3 shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search templates"
        className="w-full bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
      />
    </div>
  )
}

export default TemplateSearchInput
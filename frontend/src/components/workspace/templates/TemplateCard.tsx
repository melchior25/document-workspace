import TemplateCardPreview from './TemplateCardPreview'
import type { TemplateCardProps } from './templateCard.types'

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <article
      className="group relative cursor-pointer transition duration-300"
      onClick={() => onSelect(template)}
    >
      <div className="absolute inset-0 rounded-[30px] bg-stone-100 transition duration-300 group-hover:bg-stone-200/60" />

      <div className="relative z-10 mx-4 -mb-14 rounded-[24px] bg-white shadow-[0_26px_70px_rgba(28,25,23,0.12)] transition duration-300 group-hover:-translate-y-3 group-hover:scale-[1.015] group-hover:shadow-[0_42px_110px_rgba(28,25,23,0.16)]">
        <TemplateCardPreview previewKey={template.previewKey} />
      </div>

      <div className="relative z-0 rounded-[30px] border border-stone-200/80 bg-white/82 px-5 pt-20 pb-6 backdrop-blur-sm transition duration-300 group-hover:border-stone-300 group-hover:bg-white">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-stone-400">
            Template
          </span>
          <span className="h-2 w-2 rounded-full bg-stone-300 transition group-hover:bg-stone-900" />
        </div>

        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-stone-950 transition duration-200 group-hover:text-black">
          {template.title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-stone-500 transition duration-200 group-hover:text-stone-600">
          {template.description}
        </p>

        <div className="mt-5 inline-flex text-sm font-semibold text-stone-900">
          Preview and generate
        </div>
      </div>
    </article>
  )
}

export default TemplateCard

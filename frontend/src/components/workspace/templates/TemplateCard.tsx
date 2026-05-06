import TemplateCardPreview from './TemplateCardPreview'
import type { TemplateCardProps } from './templateCard.types'

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <article
      className="group relative cursor-pointer transition duration-300"
      onClick={() => onSelect(template)}
    >
      <div className="absolute inset-0 rounded-[28px] bg-stone-100 transition duration-300 group-hover:bg-stone-200/60" />

      <div className="relative z-10 mx-4 -mb-14 rounded-[24px] bg-white shadow-[0_30px_80px_rgba(28,25,23,0.14)] transition duration-300 group-hover:-translate-y-3 group-hover:scale-[1.02] group-hover:shadow-[0_45px_120px_rgba(28,25,23,0.18)]">
        <TemplateCardPreview previewKey={template.previewKey} />
      </div>

      <div className="relative z-0 rounded-[28px] border border-stone-200 bg-white/80 px-5 pt-20 pb-6 backdrop-blur-sm transition duration-300 group-hover:border-stone-300 group-hover:bg-white">
        <h4 className="text-[15px] font-semibold text-stone-900 transition duration-200 group-hover:text-black">
          {template.title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-stone-500 transition duration-200 group-hover:text-stone-600">
          {template.description}
        </p>
      </div>
    </article>
  )
}

export default TemplateCard
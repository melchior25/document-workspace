import type { TemplatePreviewKey } from '../../../data/templates/template.types'

type Props = {
  previewKey: TemplatePreviewKey
}

function Line({
  w = 'w-full',
  tone = 'bg-stone-200',
}: {
  w?: string
  tone?: string
}) {
  return <div className={`h-[6px] ${w} rounded ${tone}`} />
}

function getBackground(previewKey: string) {
  if (previewKey.includes('plan')) {
    return 'bg-[linear-gradient(180deg,#f6f4ef_0%,#eae3d7_100%)]'
  }
  if (previewKey.includes('report') || previewKey.includes('incident')) {
    return 'bg-[linear-gradient(180deg,#f5f6f7_0%,#e7ebef_100%)]'
  }
  if (previewKey.includes('summary') || previewKey.includes('notes')) {
    return 'bg-[linear-gradient(180deg,#f7f5f2_0%,#ece6dd_100%)]'
  }
  return 'bg-[linear-gradient(180deg,#f7f6f3_0%,#ece7df_100%)]'
}

function TemplateCardPreview({ previewKey }: Props) {
  const shell =
    'h-full rounded-[20px] border border-stone-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(28,25,23,0.08)]'

  const bg = getBackground(previewKey)

  // =========================
  // PLAN (met hero blok)
  // =========================
  if (previewKey.includes('plan') || previewKey === 'pitch-deck') {
    return (
      <div className={`aspect-[1.35/1] ${bg} p-5`}>
        <div className={shell}>
          <div className="flex justify-between">
            <Line w="w-1/3" tone="bg-stone-300" />
            <div className="h-6 w-16 rounded bg-stone-200" />
          </div>

          {/* HERO BLOCK */}
          <div className="mt-4 h-24 rounded-xl bg-stone-300" />

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-stone-100" />
            <div className="h-10 rounded bg-stone-100" />
            <div className="h-10 rounded bg-stone-100" />
          </div>

          <div className="mt-4 space-y-2">
            <Line />
            <Line w="w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  // =========================
  // REPORT (met structuur + hero)
  // =========================
  if (
    previewKey.includes('report') ||
    previewKey.includes('incident') ||
    previewKey.includes('memo')
  ) {
    return (
      <div className={`aspect-[1.35/1] ${bg} p-5`}>
        <div className={shell}>
          <div className="mb-4 space-y-2">
            <Line w="w-1/3" tone="bg-stone-300" />
            <Line w="w-2/3" />
          </div>

          {/* HERO BLOCK */}
          <div className="mb-4 h-20 rounded-lg bg-stone-200" />

          <div className="space-y-2">
            <Line />
            <Line />
            <Line w="w-5/6" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <Line w="w-1/4" tone="bg-stone-300" />
              <Line />
              <Line w="w-4/5" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================
  // SUMMARY / NOTES (media focus)
  // =========================
  if (previewKey.includes('summary') || previewKey.includes('notes')) {
    return (
      <div className={`aspect-[1.35/1] ${bg} p-5`}>
        <div className={shell}>
          <Line w="w-1/2" tone="bg-stone-300" />

          <div className="mt-4 flex gap-3">
            {/* HERO IMAGE BLOCK */}
            <div className="h-16 w-16 rounded bg-stone-300" />

            <div className="flex-1 space-y-2">
              <Line />
              <Line w="w-4/5" />
              <Line w="w-3/5" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Line />
            <Line w="w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  // =========================
  // DEFAULT
  // =========================
  return (
    <div className={`aspect-[1.35/1] ${bg} p-5`}>
      <div className={shell}>
        <Line w="w-1/3" tone="bg-stone-300" />

        <div className="mt-4 h-20 rounded-lg bg-stone-200" />

        <div className="mt-4 space-y-2">
          <Line />
          <Line />
        </div>
      </div>
    </div>
  )
}

export default TemplateCardPreview
import type {
  ExportFormat,
  ExportResult,
} from '../../../features/export/export.types'

type ExportPanelProps = {
  selectedFormat: ExportFormat
  exportResult: ExportResult | null
  isExporting: boolean
  exportError: string | null
  onFormatChange: (format: ExportFormat) => void
  onExport: () => void
}

const exportOptions: Array<{
  format: ExportFormat
  label: string
  description: string
}> = [
  {
    format: 'pdf',
    label: 'PDF',
    description: 'Best for final sharing and printing.',
  },
  {
    format: 'docx',
    label: 'Word',
    description: 'Best for continued editing in Microsoft Word.',
  },
  {
    format: 'pptx',
    label: 'PowerPoint',
    description: 'Best for presentation-based templates.',
  },
  {
    format: 'xlsx',
    label: 'Excel',
    description: 'Best for worksheet or planning-based outputs.',
  },
]

function getDownloadLabel(format: ExportFormat) {
  if (format === 'pdf') return 'Download PDF'
  if (format === 'docx') return 'Download Word'
  if (format === 'pptx') return 'Download PowerPoint'
  return 'Download Excel'
}

function ExportPanel({
  selectedFormat,
  exportResult,
  isExporting,
  exportError,
  onFormatChange,
  onExport,
}: ExportPanelProps) {
  const downloadHref = exportResult?.downloadUrl
    ? `http://localhost:5000${exportResult.downloadUrl}`
    : null

  return (
    <div className="mt-8 border-t border-stone-200 pt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
        Export document
      </p>

      <div className="mt-5 space-y-3">
        {exportOptions.map((option) => {
          const isActive = option.format === selectedFormat

          return (
            <button
              key={option.format}
              type="button"
              onClick={() => onFormatChange(option.format)}
              className={
                isActive
                  ? 'w-full rounded-[22px] border border-stone-900 bg-stone-900 px-4 py-4 text-left text-white transition'
                  : 'w-full rounded-[22px] border border-stone-200 bg-white px-4 py-4 text-left text-stone-700 transition hover:bg-stone-50'
              }
            >
              <p className="text-sm font-semibold">{option.label}</p>
              <p
                className={
                  isActive
                    ? 'mt-2 text-xs leading-6 text-stone-200'
                    : 'mt-2 text-xs leading-6 text-stone-500'
                }
              >
                {option.description}
              </p>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onExport}
        disabled={isExporting}
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isExporting ? 'Preparing export...' : 'Prepare export'}
      </button>

      {exportError && (
        <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {exportError}
        </div>
      )}

      {exportResult && (
        <div className="mt-4 rounded-[20px] border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-semibold text-stone-900">
            Export ready
          </p>

          <p className="mt-2 text-sm leading-7 text-stone-500">
            {exportResult.message}
          </p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
            {exportResult.fileName}
          </p>

          {downloadHref && (
            <a
              href={downloadHref}
              className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              {getDownloadLabel(exportResult.exportFormat)}
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ExportPanel
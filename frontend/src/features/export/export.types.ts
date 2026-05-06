export type ExportFormat = 'pdf' | 'docx' | 'pptx' | 'xlsx'

export type ExportRequest = {
  documentTitle: string
  templateTitle: string
  exportFormat: ExportFormat
  title: string
  summary: string
  mainContent: string
  notes: string
}

export type ExportResult = {
  id: string
  status: string
  exportFormat: ExportFormat
  fileName: string
  downloadUrl: string | null
  message: string
  createdAt: string
}
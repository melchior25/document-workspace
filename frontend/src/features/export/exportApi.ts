import type { ExportRequest, ExportResult } from './export.types'

type ExportResponse = {
  success: boolean
  exportResult: ExportResult
}

export async function exportDocument(
  payload: ExportRequest,
): Promise<ExportResult> {
  const response = await fetch('http://localhost:5000/api/export/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to prepare document export.')
  }

  const data = (await response.json()) as ExportResponse

  return data.exportResult
}
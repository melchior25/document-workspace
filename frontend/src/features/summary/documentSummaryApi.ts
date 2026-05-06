export type SmartSummaryResult = {
  shortSummary: string
  keyPoints: string[]
  actionItems: string[]
  importantNotes: string[]
  quickRecommendation: string
}

type SummarizeDocumentPayload = {
  title: string
  templateTitle: string
  templateCategory: string
  tone: string
  summary: string
  mainContent: string
  notes: string
}

type SummarizeDocumentResponse = {
  success: boolean
  summary: SmartSummaryResult
}

export async function summarizeDocument(
  payload: SummarizeDocumentPayload,
): Promise<SmartSummaryResult> {
  const response = await fetch('http://localhost:5000/api/summary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to summarize document.')
  }

  const data = (await response.json()) as SummarizeDocumentResponse

  return data.summary
}
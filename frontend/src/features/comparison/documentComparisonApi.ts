export type DocumentComparisonResult = {
  summary: string
  mainDifferences: string[]
  overlap: string[]
  missingFromA: string[]
  missingFromB: string[]
  improvementSuggestions: string[]
  finalRecommendation: string
}

type CompareDocumentsPayload = {
  titleA: string
  titleB: string
  documentA: string
  documentB: string
  tone: string
}

type CompareDocumentsResponse = {
  success: boolean
  comparison: DocumentComparisonResult
}

export async function compareDocuments(
  payload: CompareDocumentsPayload,
): Promise<DocumentComparisonResult> {
  const response = await fetch('http://localhost:5000/api/comparison', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to compare documents.')
  }

  const data = (await response.json()) as CompareDocumentsResponse

  return data.comparison
}
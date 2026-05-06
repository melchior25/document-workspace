export type DocumentReviewResult = {
  overallScore: number
  strengths: string[]
  issues: string[]
  missingPoints: string[]
  recommendations: string[]
  finalComment: string
}

type ReviewDocumentPayload = {
  title: string
  templateTitle: string
  templateCategory: string
  tone: string
  summary: string
  mainContent: string
  notes: string
}

type ReviewDocumentResponse = {
  success: boolean
  review: DocumentReviewResult
}

export async function reviewDocument(
  payload: ReviewDocumentPayload,
): Promise<DocumentReviewResult> {
  const response = await fetch('http://localhost:5000/api/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to review document.')
  }

  const data = (await response.json()) as ReviewDocumentResponse

  return data.review
}
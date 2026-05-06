import type {
  CorrectionRequest,
  CorrectionSuggestion,
} from './correction.types'

type CorrectionResponse = {
  success: boolean
  suggestion: CorrectionSuggestion
}

export async function requestCorrectionSuggestion(
  payload: CorrectionRequest,
): Promise<CorrectionSuggestion> {
  const response = await fetch('http://localhost:5000/api/correction/suggest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to request correction suggestion.')
  }

  const data = (await response.json()) as CorrectionResponse

  return data.suggestion
}
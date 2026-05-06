import type {
  GeneratedDocument,
  GenerationRequest,
} from './generation.types'

type GenerationResponse = {
  success: boolean
  document: GeneratedDocument
}

export async function generateDocument(
  payload: GenerationRequest,
): Promise<GeneratedDocument> {
  const response = await fetch('http://localhost:5000/api/generation/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to prepare document generation.')
  }

  const data = (await response.json()) as GenerationResponse

  return data.document
}
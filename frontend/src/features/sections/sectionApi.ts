type RegenerateSectionPayload = {
  templateId: string
  templateTitle: string
  templateCategory: string
  inputMode: string
  sectionTitle: string
  fullDocumentText: string
  tone: string
}

type RegenerateSectionResponse = {
  success: boolean
  content: string
}

export async function regenerateSection(
  payload: RegenerateSectionPayload,
): Promise<string> {
  const response = await fetch('http://localhost:5000/api/sections/regenerate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to regenerate section.')
  }

  const data = (await response.json()) as RegenerateSectionResponse

  return data.content
}
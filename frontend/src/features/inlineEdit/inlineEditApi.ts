type ImproveSelectionPayload = {
  selectedText: string
  sectionHeading: string
  documentTitle: string
  templateTitle: string
  tone: string
}

type ImproveSelectionResponse = {
  success: boolean
  improvedText: string
}

export async function improveSelectedText(
  payload: ImproveSelectionPayload,
): Promise<string> {
  const response = await fetch(
    'http://localhost:5000/api/inline-edit/improve-selection',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    throw new Error('Failed to improve selected text.')
  }

  const data = (await response.json()) as ImproveSelectionResponse

  return data.improvedText
}
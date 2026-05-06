import type {
  SaveDocumentRequest,
  SavedDocument,
} from './documentLibrary.types'

type SaveDocumentResponse = {
  success: boolean
  document: SavedDocument
}

type ListDocumentsResponse = {
  success: boolean
  documents: SavedDocument[]
}

type GetDocumentResponse = {
  success: boolean
  document: SavedDocument
}

type DeleteDocumentResponse = {
  success: boolean
  deletedId: string
}

export async function saveGeneratedDocument(
  payload: SaveDocumentRequest,
): Promise<SavedDocument> {
  const response = await fetch('http://localhost:5000/api/documents/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to save document.')
  }

  const data = (await response.json()) as SaveDocumentResponse

  return data.document
}

export async function getSavedDocuments(): Promise<SavedDocument[]> {
  const response = await fetch('http://localhost:5000/api/documents')

  if (!response.ok) {
    throw new Error('Failed to fetch saved documents.')
  }

  const data = (await response.json()) as ListDocumentsResponse

  return data.documents
}

export async function getSavedDocumentById(
  id: string,
): Promise<SavedDocument> {
  const response = await fetch(`http://localhost:5000/api/documents/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch saved document.')
  }

  const data = (await response.json()) as GetDocumentResponse

  return data.document
}

export async function renameSavedDocument(
  id: string,
  title: string,
): Promise<SavedDocument> {
  const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })

  if (!response.ok) {
    throw new Error('Failed to rename document.')
  }

  const data = (await response.json()) as SaveDocumentResponse

  return data.document
}

export async function deleteSavedDocument(id: string): Promise<string> {
  const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete document.')
  }

  const data = (await response.json()) as DeleteDocumentResponse

  return data.deletedId
}
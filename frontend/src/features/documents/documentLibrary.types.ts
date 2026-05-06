import type { TemplateCategory } from '../../data/templates/template.types'
import type { TemplateInputMode } from '../../components/workspace/templates/TemplateInputModeView'
import type { GeneratedSection } from '../generation/generation.types'

export type SaveDocumentRequest = {
  documentId: string
  title: string
  templateTitle: string
  templateCategory: TemplateCategory
  inputMode: TemplateInputMode
  summary: string
  sections: GeneratedSection[]
  notes: string
}

export type SavedDocument = SaveDocumentRequest & {
  id: string
  savedAt: string
  updatedAt: string
}
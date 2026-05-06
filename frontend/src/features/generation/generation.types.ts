import type { TemplateCategory } from '../../data/templates/template.types'
import type { TemplateInputMode } from '../../components/workspace/templates/TemplateInputModeView'

export type GenerationRequest = {
  templateId: string
  templateTitle: string
  templateCategory: TemplateCategory
  inputMode: TemplateInputMode
  promptText?: string
  documentContext?: string
}

export type GeneratedSection = {
  heading: string
  content: string
}

export type GenerationInstruction = {
  templateId: string
  templateTitle: string
  templateCategory: TemplateCategory
  inputMode: TemplateInputMode
  tone: string
  purpose: string
  requiredSections: string[]
  sourceInput: string
  sourceMeta?: {
    mode: string
    chunkCount: number
    totalCharacters: number
  }
  instruction: string
}

export type GeneratedDocument = {
  id: string
  templateId: string
  templateTitle: string
  templateCategory: TemplateCategory
  inputMode: TemplateInputMode
  status: string
  title: string
  summary: string
  mainContent: string
  notes: string
  generatedSections: GeneratedSection[]
  generationInstruction: GenerationInstruction
  sourcePreview: string | null
  createdAt: string
}
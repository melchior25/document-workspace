export type CorrectionRequest = {
  request: string
  documentTitle: string
  summary: string
  mainContent: string
  notes: string
}

export type CorrectionSuggestion = {
  id: string
  request: string
  suggestion: string
  createdAt: string
}
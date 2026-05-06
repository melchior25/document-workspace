import { useRef, useState, type SyntheticEvent } from 'react'
import { requestCorrectionSuggestion } from '../../../../features/correction/correctionApi'
import type { CorrectionSuggestion } from '../../../../features/correction/correction.types'
import {
  compareDocuments,
  type DocumentComparisonResult,
} from '../../../../features/comparison/documentComparisonApi'
import { saveGeneratedDocument } from '../../../../features/documents/documentLibraryApi'
import type { SavedDocument } from '../../../../features/documents/documentLibrary.types'
import { exportDocument } from '../../../../features/export/exportApi'
import type {
  ExportFormat,
  ExportResult,
} from '../../../../features/export/export.types'
import type { GeneratedDocument } from '../../../../features/generation/generation.types'
import { improveSelectedText } from '../../../../features/inlineEdit/inlineEditApi'
import {
  reviewDocument,
  type DocumentReviewResult,
} from '../../../../features/review/documentReviewApi'
import {
  summarizeDocument,
  type SmartSummaryResult,
} from '../../../../features/summary/documentSummaryApi'
import { regenerateSection } from '../../../../features/sections/sectionApi'
import type {
  EditableSection,
  SelectedTextState,
  SpeechRecognition,
  SpeechRecognitionConstructor,
} from './generatedDocument.types'

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

type UseGeneratedDocumentEditorArgs = {
  document: GeneratedDocument
  onBack: () => void
}

export function useGeneratedDocumentEditor({
  document,
  onBack,
}: UseGeneratedDocumentEditorArgs) {
  const [title, setTitle] = useState(document.title)
  const [summary, setSummary] = useState(document.summary)
  const [notes, setNotes] = useState(document.notes)
  const [selectedTone, setSelectedTone] = useState('Professional')

  const [editableSections, setEditableSections] = useState<EditableSection[]>(
    document.generatedSections.length > 0
      ? document.generatedSections
      : [{ heading: 'Main Content', content: document.mainContent }],
  )

  const [savedDocument, setSavedDocument] = useState<SavedDocument | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [assistantPrompt, setAssistantPrompt] = useState('')
  const [assistantMessages, setAssistantMessages] = useState<
    CorrectionSuggestion[]
  >([])
  const [isRequestingCorrection, setIsRequestingCorrection] = useState(false)
  const [correctionError, setCorrectionError] = useState<string | null>(null)

  const [isListeningCorrection, setIsListeningCorrection] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldKeepListeningRef = useRef(false)

  const [selectedExportFormat, setSelectedExportFormat] =
    useState<ExportFormat>('pdf')
  const [exportResult, setExportResult] = useState<ExportResult | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const [selectedText, setSelectedText] = useState<SelectedTextState>(null)
  const [isImprovingSelection, setIsImprovingSelection] = useState(false)
  const [inlineEditError, setInlineEditError] = useState<string | null>(null)
  const [regeneratingSectionIndex, setRegeneratingSectionIndex] = useState<
    number | null
  >(null)

  const [documentReview, setDocumentReview] =
    useState<DocumentReviewResult | null>(null)
  const [isReviewingDocument, setIsReviewingDocument] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)

  const [smartSummary, setSmartSummary] = useState<SmartSummaryResult | null>(
    null,
  )
  const [isSummarizingDocument, setIsSummarizingDocument] = useState(false)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const [comparisonInput, setComparisonInput] = useState('')
  const [comparisonResult, setComparisonResult] =
    useState<DocumentComparisonResult | null>(null)
  const [isComparingDocument, setIsComparingDocument] = useState(false)
  const [comparisonError, setComparisonError] = useState<string | null>(null)

  const sourceMeta = document.generationInstruction.sourceMeta

  const combinedMainContent = editableSections
    .map((section) => `${section.heading}\n${section.content}`)
    .join('\n\n')

  const fullCurrentDocumentText = [
    title,
    '',
    'Summary:',
    summary,
    '',
    'Content:',
    combinedMainContent,
    '',
    'Notes:',
    notes,
  ].join('\n')

  const handleSectionChange = (
    index: number,
    field: 'heading' | 'content',
    value: string,
  ) => {
    setEditableSections((currentSections) =>
      currentSections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section,
      ),
    )
  }

  const handleSectionTextSelect = (
    index: number,
    event: SyntheticEvent<HTMLTextAreaElement>,
  ) => {
    const target = event.currentTarget
    const start = target.selectionStart
    const end = target.selectionEnd
    const text = target.value.slice(start, end)

    if (!text.trim()) {
      setSelectedText(null)
      return
    }

    setSelectedText({ sectionIndex: index, start, end, text })
    setInlineEditError(null)
  }

  const handleImproveSelection = async () => {
    if (!selectedText) return

    const section = editableSections[selectedText.sectionIndex]

    setIsImprovingSelection(true)
    setInlineEditError(null)

    try {
      const improvedText = await improveSelectedText({
        selectedText: selectedText.text,
        sectionHeading: section.heading,
        documentTitle: title,
        templateTitle: document.templateTitle,
        tone: selectedTone,
      })

      setEditableSections((currentSections) =>
        currentSections.map((currentSection, index) => {
          if (index !== selectedText.sectionIndex) return currentSection

          const before = currentSection.content.slice(0, selectedText.start)
          const after = currentSection.content.slice(selectedText.end)

          return {
            ...currentSection,
            content: `${before}${improvedText}${after}`,
          }
        }),
      )

      setSelectedText(null)
    } catch {
      setInlineEditError('Could not improve the selected text.')
    } finally {
      setIsImprovingSelection(false)
    }
  }

  const handleRegenerateSection = async (index: number) => {
    const section = editableSections[index]

    setRegeneratingSectionIndex(index)

    try {
      const fullText = editableSections
        .map((currentSection) => {
          return `${currentSection.heading}\n${currentSection.content}`
        })
        .join('\n\n')

      const newContent = await regenerateSection({
        templateId: document.templateId,
        templateTitle: document.templateTitle,
        templateCategory: document.templateCategory,
        inputMode: document.inputMode,
        sectionTitle: section.heading,
        fullDocumentText: fullText,
        tone: selectedTone,
      })

      setEditableSections((currentSections) =>
        currentSections.map((currentSection, sectionIndex) =>
          sectionIndex === index
            ? { ...currentSection, content: newContent }
            : currentSection,
        ),
      )
    } catch {
      alert('Failed to regenerate section.')
    } finally {
      setRegeneratingSectionIndex(null)
    }
  }

  const handleReviewDocument = async () => {
    setIsReviewingDocument(true)
    setReviewError(null)

    try {
      const review = await reviewDocument({
        title,
        templateTitle: document.templateTitle,
        templateCategory: document.templateCategory,
        tone: selectedTone,
        summary,
        mainContent: combinedMainContent,
        notes,
      })

      setDocumentReview(review)
    } catch {
      setReviewError('Could not review this document.')
    } finally {
      setIsReviewingDocument(false)
    }
  }

  const handleSummarizeDocument = async () => {
    setIsSummarizingDocument(true)
    setSummaryError(null)

    try {
      const result = await summarizeDocument({
        title,
        templateTitle: document.templateTitle,
        templateCategory: document.templateCategory,
        tone: selectedTone,
        summary,
        mainContent: combinedMainContent,
        notes,
      })

      setSmartSummary(result)
    } catch {
      setSummaryError('Could not summarize this document.')
    } finally {
      setIsSummarizingDocument(false)
    }
  }

  const handleCompareDocument = async () => {
    if (!comparisonInput.trim()) {
      setComparisonError('Paste another document or version to compare.')
      return
    }

    setIsComparingDocument(true)
    setComparisonError(null)

    try {
      const result = await compareDocuments({
        titleA: title,
        titleB: 'Comparison document',
        documentA: fullCurrentDocumentText,
        documentB: comparisonInput,
        tone: selectedTone,
      })

      setComparisonResult(result)
    } catch {
      setComparisonError('Could not compare the documents.')
    } finally {
      setIsComparingDocument(false)
    }
  }

  const handleSaveDocument = async () => {
    setIsSaving(true)
    setSaveError(null)

    try {
      const saved = await saveGeneratedDocument({
        documentId: document.id,
        title,
        templateTitle: document.templateTitle,
        templateCategory: document.templateCategory,
        inputMode: document.inputMode,
        summary,
        sections: editableSections,
        notes,
      })

      setSavedDocument(saved)
    } catch {
      setSaveError('Could not save this document.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCorrectionVoiceInput = () => {
    setVoiceError(null)

    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionApi) {
      setVoiceError(
        'Voice input is not supported in this browser. You can still type your correction request.',
      )
      return
    }

    if (isListeningCorrection) {
      shouldKeepListeningRef.current = false
      recognitionRef.current?.stop()
      setIsListeningCorrection(false)
      return
    }

    const recognition = new SpeechRecognitionApi()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event) => {
      let finalTranscript = ''

      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index]

        if (result.isFinal) {
          finalTranscript += result[0].transcript
        }
      }

      if (!finalTranscript.trim()) return

      setAssistantPrompt((currentValue) => {
        if (!currentValue.trim()) return finalTranscript.trim()
        return `${currentValue.trim()}\n\n${finalTranscript.trim()}`
      })
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') return

      setVoiceError(`Voice input error: ${event.error}`)
      shouldKeepListeningRef.current = false
      setIsListeningCorrection(false)
    }

    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        recognition.start()
        return
      }

      setIsListeningCorrection(false)
    }

    recognitionRef.current = recognition
    shouldKeepListeningRef.current = true
    recognition.start()
    setIsListeningCorrection(true)
  }

  const handleAssistantSubmit = async () => {
    const trimmedPrompt = assistantPrompt.trim()
    if (!trimmedPrompt) return

    setIsRequestingCorrection(true)
    setCorrectionError(null)

    try {
      const suggestion = await requestCorrectionSuggestion({
        request: `${trimmedPrompt}\n\nUse this tone: ${selectedTone}`,
        documentTitle: title,
        summary,
        mainContent: combinedMainContent,
        notes,
      })

      setAssistantMessages((currentMessages) => [
        suggestion,
        ...currentMessages,
      ])
      setAssistantPrompt('')
    } catch {
      setCorrectionError('Could not connect to the correction endpoint.')
    } finally {
      setIsRequestingCorrection(false)
    }
  }

  const handleApplySuggestion = (suggestion: CorrectionSuggestion) => {
    setNotes((currentNotes) => {
      return `${currentNotes}\n\nApplied suggestion:\n${suggestion.suggestion}`
    })
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportError(null)
    setExportResult(null)

    try {
      const result = await exportDocument({
        documentTitle: document.title,
        templateTitle: document.templateTitle,
        exportFormat: selectedExportFormat,
        title,
        summary,
        mainContent: combinedMainContent,
        notes,
      })

      setExportResult(result)
    } catch {
      setExportError('Could not connect to the export endpoint.')
    } finally {
      setIsExporting(false)
    }
  }

  return {
    document,
    onBack,

    title,
    setTitle,
    summary,
    setSummary,
    notes,
    setNotes,
    selectedTone,
    setSelectedTone,
    editableSections,
    selectedText,
    sourceMeta,

    savedDocument,
    isSaving,
    saveError,

    assistantPrompt,
    setAssistantPrompt,
    assistantMessages,
    isRequestingCorrection,
    correctionError,

    isListeningCorrection,
    voiceError,

    selectedExportFormat,
    setSelectedExportFormat,
    exportResult,
    isExporting,
    exportError,

    isImprovingSelection,
    inlineEditError,
    regeneratingSectionIndex,

    documentReview,
    isReviewingDocument,
    reviewError,

    smartSummary,
    isSummarizingDocument,
    summaryError,

    comparisonInput,
    setComparisonInput,
    comparisonResult,
    isComparingDocument,
    comparisonError,

    handleSectionChange,
    handleSectionTextSelect,
    handleImproveSelection,
    handleRegenerateSection,
    handleReviewDocument,
    handleSummarizeDocument,
    handleCompareDocument,
    handleSaveDocument,
    handleCorrectionVoiceInput,
    handleAssistantSubmit,
    handleApplySuggestion,
    handleExport,
  }
}

export type GeneratedDocumentEditor = ReturnType<typeof useGeneratedDocumentEditor>
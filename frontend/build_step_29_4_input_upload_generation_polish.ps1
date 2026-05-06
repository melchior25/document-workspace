$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "Build Step 29.4 - Input / Upload / Generation polish" -ForegroundColor Cyan
Write-Host "This script updates the Step 29.4 workspace UI files only." -ForegroundColor DarkCyan
Write-Host ""

$Root = Get-Location
$BackupRoot = Join-Path $Root ("backup_step_29_4_" + (Get-Date -Format "yyyyMMdd_HHmmss"))

$FilesToBackup = @(
  "src\components\workspace\templates\TemplateInputModeView.tsx",
  "src\components\workspace\templates\PromptInputView.tsx",
  "src\components\workspace\templates\DocumentUploadView.tsx",
  "src\components\workspace\templates\GenerationPrepView.tsx",
  "src\components\workspace\templates\GenerationLoadingView.tsx",
  "src\components\workspace\templates\TemplateFlowHeader.tsx",
  "src\components\workspace\templates\TemplateFlowPanel.tsx"
)

foreach ($File in $FilesToBackup) {
  if (Test-Path $File) {
    $Target = Join-Path $BackupRoot $File
    $TargetDir = Split-Path $Target -Parent
    New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null
    Copy-Item $File $Target -Force
  }
}

function Write-ProjectFile {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content
  )

  $Directory = Split-Path $Path -Parent

  if ($Directory -and !(Test-Path $Directory)) {
    New-Item -ItemType Directory -Force -Path $Directory | Out-Null
  }

  Set-Content -Path $Path -Value $Content -Encoding UTF8
  Write-Host "Updated $Path" -ForegroundColor Green
}

Write-ProjectFile -Path "src\components\workspace\templates\TemplateFlowHeader.tsx" -Content @'
import type { ReactNode } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplateFlowHeaderProps = {
  template: TemplateItem
  eyebrow: string
  title: string
  description: ReactNode
  backLabel: string
  onBack: () => void
  children?: ReactNode
}

function TemplateFlowHeader({
  template,
  eyebrow,
  title,
  description,
  backLabel,
  onBack,
  children,
}: TemplateFlowHeaderProps) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-[0_8px_24px_rgba(28,25,23,0.04)] transition hover:-translate-y-0.5 hover:bg-stone-50"
        >
          {backLabel}
        </button>

        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
          {template.title}
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <p className="text-sm font-semibold text-stone-500">{eyebrow}</p>

          <h2 className="mt-2 max-w-[900px] text-[40px] font-semibold leading-[1.06] tracking-[-0.035em] text-stone-950 md:text-[46px]">
            {title}
          </h2>

          <p className="mt-4 max-w-[820px] text-base leading-7 text-stone-500">
            {description}
          </p>
        </div>

        <div className="rounded-[30px] border border-stone-200/80 bg-stone-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
            Selected template
          </p>

          <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
            {template.title}
          </p>

          <p className="mt-2 text-sm leading-6 text-stone-500">
            Keep this flow focused: choose input, review source, then generate an
            editable professional draft.
          </p>
        </div>
      </div>

      {children && <div className="mt-8">{children}</div>}
    </div>
  )
}

export default TemplateFlowHeader
'@

Write-ProjectFile -Path "src\components\workspace\templates\TemplateFlowPanel.tsx" -Content @'
import type { ReactNode } from 'react'

type TemplateFlowPanelProps = {
  eyebrow: string
  title: string
  children: ReactNode
}

function TemplateFlowPanel({
  eyebrow,
  title,
  children,
}: TemplateFlowPanelProps) {
  return (
    <aside className="h-fit rounded-[30px] border border-stone-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
        {eyebrow}
      </p>

      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-950">
        {title}
      </h3>

      <div className="mt-5">{children}</div>
    </aside>
  )
}

export default TemplateFlowPanel
'@

Write-ProjectFile -Path "src\components\workspace\templates\TemplateInputModeView.tsx" -Content @'
import type { TemplateItem } from '../../../data/templates/template.types'
import TemplateFlowHeader from './TemplateFlowHeader'

type TemplateInputMode = 'prompt' | 'document'

type TemplateInputModeViewProps = {
  template: TemplateItem
  onBack: () => void
  onSelectMode: (mode: TemplateInputMode) => void
}

function TemplateInputModeView({
  template,
  onBack,
  onSelectMode,
}: TemplateInputModeViewProps) {
  return (
    <section className="flex flex-col">
      <TemplateFlowHeader
        template={template}
        eyebrow="Choose input method"
        title="Start with your own text or with an existing document"
        backLabel="Back to preview"
        onBack={onBack}
        description={
          <>
            Choose how the workspace should receive content for the{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            template. Both paths lead to the same final review screen before
            generation starts.
          </>
        }
      >
        <div className="grid gap-3 rounded-[28px] border border-stone-200/80 bg-white p-3 shadow-[0_18px_50px_rgba(28,25,23,0.045)] md:grid-cols-3">
          {[
            ['1', 'Input', 'Choose prompt or upload.'],
            ['2', 'Review', 'Check the selected source.'],
            ['3', 'Generate', 'Open the editable document.'],
          ].map(([number, label, copy]) => (
            <div
              key={number}
              className="rounded-[22px] bg-stone-50 px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-900 shadow-sm">
                  {number}
                </span>
                <p className="text-sm font-semibold text-stone-950">{label}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-500">{copy}</p>
            </div>
          ))}
        </div>
      </TemplateFlowHeader>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => onSelectMode('prompt')}
          className="group rounded-[34px] border border-stone-200/80 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.055)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-lg font-semibold text-white shadow-[0_14px_30px_rgba(28,25,23,0.18)]">
              T
            </div>

            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
              Best for new content
            </span>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 1
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
              Prompt / Text
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Type or speak what the document should contain. This is ideal for
              lesson plans, letters, reports, ideas, notes, or rough instructions.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
            <div className="rounded-[20px] bg-white p-4 shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="space-y-3">
                <div className="h-[7px] w-32 rounded-full bg-stone-300" />
                <div className="h-[7px] w-full rounded-full bg-stone-200" />
                <div className="h-[7px] w-11/12 rounded-full bg-stone-200" />
                <div className="h-[7px] w-8/12 rounded-full bg-stone-200" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Typed notes', 'Voice input', 'Instructions'].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with prompt
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMode('document')}
          className="group rounded-[34px] border border-stone-200/80 bg-white p-7 text-left shadow-[0_18px_50px_rgba(28,25,23,0.055)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_28px_80px_rgba(28,25,23,0.10)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-lg font-semibold text-stone-950 shadow-sm">
              D
            </div>

            <span className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-500">
              Best for source files
            </span>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
              Option 2
            </p>

            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
              Upload Document
            </h3>

            <p className="mt-4 text-sm leading-7 text-stone-500">
              Upload one or more existing files. The workspace extracts readable
              text and uses it as the source for the selected template.
            </p>
          </div>

          <div className="mt-8 rounded-[26px] border border-dashed border-stone-300 bg-stone-50 p-5">
            <div className="flex min-h-[148px] flex-col items-center justify-center rounded-[20px] bg-white text-center shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-sm font-bold text-stone-700">
                PDF
              </div>

              <p className="mt-4 text-sm font-semibold text-stone-800">
                Browse and extract text
              </p>

              <p className="mt-2 text-xs leading-5 text-stone-400">
                PDF, DOCX, TXT, MD and CSV
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Reports', 'Plans', 'Notes'].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition group-hover:bg-stone-800">
            Continue with document
          </div>
        </button>
      </div>
    </section>
  )
}

export default TemplateInputModeView
export type { TemplateInputMode }
'@

Write-ProjectFile -Path "src\components\workspace\templates\PromptInputView.tsx" -Content @'
import { useRef, useState } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'
import TemplateFlowHeader from './TemplateFlowHeader'
import TemplateFlowPanel from './TemplateFlowPanel'

type PromptInputViewProps = {
  template: TemplateItem
  onBack: () => void
  onContinue: (promptText: string) => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

type SpeechRecognitionEventResult = {
  transcript: string
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      [index: number]: SpeechRecognitionEventResult
    }
  }
}

type SpeechRecognitionErrorEventLike = {
  error: string
}

type SpeechRecognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

function PromptInputView({
  template,
  onBack,
  onContinue,
}: PromptInputViewProps) {
  const [promptValue, setPromptValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const shouldKeepListeningRef = useRef(false)

  const trimmedPrompt = promptValue.trim()
  const canContinue = trimmedPrompt.length > 0
  const wordCount = trimmedPrompt ? trimmedPrompt.split(/\s+/).length : 0

  const handleVoiceInput = () => {
    setVoiceError(null)

    const SpeechRecognitionApi =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognitionApi) {
      setVoiceError(
        'Voice input is not supported in this browser. You can still type your prompt.',
      )
      return
    }

    if (isListening) {
      shouldKeepListeningRef.current = false
      recognitionRef.current?.stop()
      setIsListening(false)
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

      setPromptValue((currentValue) => {
        if (!currentValue.trim()) {
          return finalTranscript.trim()
        }

        return `${currentValue.trim()}\n\n${finalTranscript.trim()}`
      })
    }

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        return
      }

      setVoiceError(`Voice input error: ${event.error}`)
      shouldKeepListeningRef.current = false
      setIsListening(false)
    }

    recognition.onend = () => {
      if (shouldKeepListeningRef.current) {
        recognition.start()
        return
      }

      setIsListening(false)
    }

    recognitionRef.current = recognition
    shouldKeepListeningRef.current = true
    recognition.start()
    setIsListening(true)
  }

  const handleContinue = () => {
    if (!canContinue) return
    onContinue(trimmedPrompt)
  }

  return (
    <section className="flex flex-col">
      <TemplateFlowHeader
        template={template}
        eyebrow="Prompt / Text"
        title="Describe the document clearly, then review before generating"
        backLabel="Back to input methods"
        onBack={onBack}
        description={
          <>
            Add the details, context, tone, and goal for your{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>
            . You can type, paste notes, or use voice input.
          </>
        }
      />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[34px] border border-stone-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Source input
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-stone-950">
                Prompt editor
              </h3>
            </div>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={
                isListening
                  ? 'inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(220,38,38,0.22)] transition hover:bg-red-700'
                  : 'inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-5 text-sm font-semibold text-stone-700 transition hover:-translate-y-0.5 hover:bg-stone-100'
              }
            >
              {isListening ? 'Stop listening' : 'Use voice input'}
            </button>
          </div>

          {voiceError && (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
              {voiceError}
            </div>
          )}

          {isListening && (
            <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              Listening continuously. Speak until you are done, then press Stop listening.
            </div>
          )}

          <div className="mt-8 rounded-[30px] border border-stone-200/80 bg-stone-50 p-4">
            <textarea
              value={promptValue}
              onChange={(event) => setPromptValue(event.target.value)}
              placeholder="Example: Create a professional weekly progress report for my class. Include what we practiced, what went well, challenges, next steps, and a short note for parents..."
              className="min-h-[360px] w-full resize-none rounded-[24px] border border-stone-200 bg-white px-5 py-5 text-sm leading-7 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-300 focus:shadow-[0_0_0_4px_rgba(231,229,228,0.65)]"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
            <span>{wordCount} words</span>
            <span>{promptValue.length} characters</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Continue to generate
            </button>

            <button
              type="button"
              onClick={() => setPromptValue('')}
              disabled={!promptValue}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Clear prompt
            </button>
          </div>
        </div>

        <TemplateFlowPanel eyebrow="Prompt guide" title="A strong prompt includes">
          <div className="space-y-5">
            {[
              [
                'Goal',
                'Explain what the document must achieve and who will read it.',
              ],
              [
                'Important details',
                'Add names, dates, lesson topics, decisions, problems, or outcomes.',
              ],
              [
                'Tone',
                'Mention whether it should feel formal, simple, warm, strict, or professional.',
              ],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[22px] bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-950">{title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[22px] border border-stone-200 bg-white p-4">
            <p className="text-sm font-semibold text-stone-950">
              Before continuing
            </p>

            <p className="mt-2 text-sm leading-7 text-stone-500">
              Quickly scan the prompt for missing context. The next screen is the
              final check before the backend generation call starts.
            </p>
          </div>
        </TemplateFlowPanel>
      </div>
    </section>
  )
}

export default PromptInputView
'@

Write-ProjectFile -Path "src\components\workspace\templates\DocumentUploadView.tsx" -Content @'
import { useRef, useState } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'
import {
  extractUploadedDocument,
  extractUploadedDocuments,
} from '../../../features/uploads/uploadApi'
import type { UploadedDocumentExtraction } from '../../../features/uploads/upload.types'
import TemplateFlowHeader from './TemplateFlowHeader'
import TemplateFlowPanel from './TemplateFlowPanel'

type DocumentUploadViewProps = {
  template: TemplateItem
  onBack: () => void
  onContinue: (extraction: UploadedDocumentExtraction) => void
}

function DocumentUploadView({
  template,
  onBack,
  onContinue,
}: DocumentUploadViewProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([])
  const [extraction, setExtraction] = useState<UploadedDocumentExtraction | null>(
    null,
  )
  const [isExtracting, setIsExtracting] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)

    setSelectedFileNames(fileArray.map((file) => file.name))
    setExtraction(null)
    setUploadError(null)
    setIsExtracting(true)

    try {
      const result =
        fileArray.length === 1
          ? await extractUploadedDocument(fileArray[0])
          : await extractUploadedDocuments(fileArray)

      setExtraction(result)
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : 'Could not extract readable text from the selected files.',
      )
    } finally {
      setIsExtracting(false)
    }
  }

  const selectedLabel =
    selectedFileNames.length === 0
      ? 'Choose document files'
      : selectedFileNames.length === 1
        ? selectedFileNames[0]
        : `${selectedFileNames.length} files selected`

  const hasFailedFiles = Boolean(extraction?.failedFiles?.length)

  return (
    <section className="flex flex-col">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt,.md,.csv"
        className="hidden"
        onChange={(event) => handleFileSelect(event.target.files)}
      />

      <TemplateFlowHeader
        template={template}
        eyebrow="Upload / Document"
        title="Upload source files and turn them into a structured draft"
        backLabel="Back to input methods"
        onBack={onBack}
        description={
          <>
            Upload PDF, DOCX, TXT, MD or CSV files. The workspace extracts readable
            text and combines it as source context for the{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            template.
          </>
        }
      />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="rounded-[34px] border border-stone-200/80 bg-white p-7 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
          <div className="rounded-[30px] border border-dashed border-stone-300 bg-stone-50 p-5">
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] bg-white px-6 text-center shadow-[inset_0_0_0_1px_rgba(231,229,228,0.8)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-stone-950 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_16px_36px_rgba(28,25,23,0.16)]">
                Doc
              </div>

              <p className="mt-6 max-w-[520px] text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {selectedLabel}
              </p>

              <p className="mt-3 max-w-[480px] text-sm leading-7 text-stone-500">
                Select up to 10 related files. Text-based PDFs, DOCX and TXT files
                work best. Scanned image-only PDFs need OCR later.
              </p>

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-stone-800"
              >
                Choose files
              </button>
            </div>
          </div>

          {selectedFileNames.length > 0 && (
            <div className="mt-5 rounded-[24px] border border-stone-200/80 bg-stone-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Selected files
                </p>

                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  {selectedFileNames.length} total
                </p>
              </div>

              <div className="mt-4 space-y-2">
                {selectedFileNames.map((fileName) => (
                  <div
                    key={fileName}
                    className="flex items-center gap-3 rounded-[18px] bg-white px-4 py-3 text-sm text-stone-600"
                  >
                    <span className="h-2 w-2 rounded-full bg-stone-300" />
                    <span className="truncate">{fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isExtracting && (
            <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-600">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-stone-900" />
              Extracting readable document text...
            </div>
          )}

          {uploadError && (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-7 text-red-700">
              {uploadError}
            </div>
          )}

          {extraction && (
            <div className="mt-6 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                    Extraction ready
                  </p>

                  <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                    {extraction.fileName}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 shadow-sm">
                  {extraction.characterCount} characters
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Files
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-900">
                    {extraction.fileCount || 1}
                  </p>
                </div>

                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Type
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold text-stone-900">
                    {extraction.extension || extraction.mimeType}
                  </p>
                </div>

                <div className="rounded-[18px] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                    Status
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-900">
                    Ready
                  </p>
                </div>
              </div>

              {hasFailedFiles && (
                <div className="mt-4 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                  Some files could not be fully extracted. The readable content
                  that was extracted can still be used.
                </div>
              )}

              <div className="mt-4 max-h-[240px] overflow-auto rounded-[20px] bg-white p-4 text-left text-sm leading-7 text-stone-600">
                {extraction.extractedText.slice(0, 1600)}
                {extraction.extractedText.length > 1600 ? '...' : ''}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!extraction}
              onClick={() => extraction && onContinue(extraction)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Continue to generate
            </button>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Choose different files
            </button>
          </div>
        </div>

        <TemplateFlowPanel eyebrow="Upload guide" title="Use clean source files">
          <div className="space-y-5">
            {[
              [
                'Combine related files',
                'Upload notes, reports, plans or lesson files together so the AI can use the full context.',
              ],
              [
                'Keep the topic focused',
                'Avoid mixing unrelated subjects. Better source files produce better final documents.',
              ],
              [
                'Check the preview',
                'After extraction, scan the text preview before continuing to generation.',
              ],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[22px] bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-950">{title}</p>
                <p className="mt-2 text-sm leading-7 text-stone-500">{copy}</p>
              </div>
            ))}
          </div>
        </TemplateFlowPanel>
      </div>
    </section>
  )
}

export default DocumentUploadView
'@

Write-ProjectFile -Path "src\components\workspace\templates\GenerationPrepView.tsx" -Content @'
import type { TemplateItem } from '../../../data/templates/template.types'
import type { GeneratedDocument } from '../../../features/generation/generation.types'
import type { TemplateInputMode } from './TemplateInputModeView'
import TemplateFlowHeader from './TemplateFlowHeader'

type GenerationPrepViewProps = {
  template: TemplateItem
  inputMode: TemplateInputMode
  generatedDocument: GeneratedDocument | null
  isGenerating: boolean
  errorMessage: string | null
  onBack: () => void
  onGenerate: () => void
}

function GenerationPrepView({
  template,
  inputMode,
  generatedDocument,
  isGenerating,
  errorMessage,
  onBack,
  onGenerate,
}: GenerationPrepViewProps) {
  const inputModeLabel =
    inputMode === 'prompt' ? 'Prompt / Text' : 'Upload Document'

  return (
    <section className="flex flex-col">
      <TemplateFlowHeader
        template={template}
        eyebrow="Generation check"
        title="Final review before the workspace creates your document"
        backLabel="Back"
        onBack={onBack}
        description={
          <>
            Your selected template and source input are ready. Start generation
            when you are ready to create the editable{' '}
            <span className="font-semibold text-stone-700">
              {template.title}
            </span>{' '}
            draft.
          </>
        }
      />

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[34px] border border-stone-200/80 bg-white p-8 shadow-[0_18px_50px_rgba(28,25,23,0.055)]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-stone-500">
                Ready to generate
              </p>

              <h3 className="mt-2 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] text-stone-950">
                Everything is prepared
              </h3>

              <p className="mt-4 max-w-[680px] text-sm leading-7 text-stone-500">
                The backend will now receive the selected template, input method,
                and source content. The result opens directly in the editor.
              </p>
            </div>

            <span className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Final check
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Template
              </p>

              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {template.title}
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                The final draft will follow this document structure.
              </p>
            </div>

            <div className="rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Input mode
              </p>

              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-stone-950">
                {inputModeLabel}
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-500">
                Source content has been prepared for generation.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-stone-200/80 bg-white p-3">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                [
                  '1',
                  'Read source',
                  inputMode === 'document'
                    ? 'Use extracted document text.'
                    : 'Use your prompt instructions.',
                ],
                ['2', 'Shape structure', 'Apply the selected template rules.'],
                ['3', 'Open editor', 'Create an editable professional draft.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="rounded-[22px] bg-stone-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-900 shadow-sm">
                      {number}
                    </span>

                    <p className="text-sm font-semibold text-stone-950">
                      {title}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-stone-500">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium leading-7 text-red-700">
              {errorMessage}
            </div>
          )}

          {generatedDocument && (
            <div className="mt-6 rounded-[26px] border border-stone-200/80 bg-stone-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                Last generated draft
              </p>

              <p className="mt-3 text-lg font-semibold text-stone-950">
                {generatedDocument.title}
              </p>

              <p className="mt-2 text-sm leading-7 text-stone-500">
                {generatedDocument.summary}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(28,25,23,0.16)] transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGenerating ? 'Generating...' : 'Generate document'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Review input again
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[32px] border border-stone-200/80 bg-stone-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            What happens next
          </p>

          <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-stone-950">
            The editor opens automatically
          </h3>

          <div className="mt-5 space-y-4">
            {[
              'You can edit title, summary, sections, and notes.',
              'You can regenerate sections or improve selected text.',
              'You can save, review, compare, and export after generation.',
            ].map((item) => (
              <div key={item} className="flex gap-3 rounded-[22px] bg-white p-4">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-stone-400" />
                <p className="text-sm leading-7 text-stone-500">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default GenerationPrepView
'@

Write-ProjectFile -Path "src\components\workspace\templates\GenerationLoadingView.tsx" -Content @'
import type { TemplateItem } from '../../../data/templates/template.types'
import type { TemplateInputMode } from './TemplateInputModeView'

type GenerationLoadingViewProps = {
  template: TemplateItem
  inputMode: TemplateInputMode
}

function GenerationLoadingView({
  template,
  inputMode,
}: GenerationLoadingViewProps) {
  const sourceLabel =
    inputMode === 'document' ? 'uploaded source content' : 'prompt instructions'

  return (
    <section className="flex min-h-[660px] items-center justify-center">
      <div className="w-full max-w-[920px] rounded-[42px] border border-stone-200/80 bg-white p-10 text-center shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-stone-950 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_46px_rgba(28,25,23,0.22)]">
          Doc
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
          Generating document
        </p>

        <h2 className="mx-auto mt-4 max-w-[720px] text-[42px] font-semibold leading-[1.05] tracking-[-0.045em] text-stone-950 md:text-[48px]">
          Building your {template.title}
        </h2>

        <p className="mx-auto mt-5 max-w-[660px] text-sm leading-7 text-stone-500">
          The workspace is reading your {sourceLabel}, applying the selected
          template structure, and preparing an editable professional document.
        </p>

        <div className="mx-auto mt-10 max-w-[620px] rounded-[30px] border border-stone-200/80 bg-stone-50 p-3 text-left">
          <div className="grid gap-3">
            {[
              [
                'Understanding source content',
                'Identifying the important information and context.',
              ],
              [
                'Applying template structure',
                'Organizing sections, tone, and document rules.',
              ],
              [
                'Preparing editable draft',
                'Creating the document that will open in the editor.',
              ],
            ].map(([title, copy], index) => (
              <div
                key={title}
                className="flex gap-4 rounded-[24px] bg-white p-5 shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-950 text-xs font-bold text-white">
                  {index + 1}
                </span>

                <div>
                  <p className="text-sm font-semibold text-stone-950">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-6 text-stone-500">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-9 max-w-[460px]">
          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-stone-950" />
          </div>

          <div className="mt-4 flex justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-900" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-400" />
            <span className="h-2 w-2 animate-pulse rounded-full bg-stone-300" />
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[560px] text-xs font-medium uppercase tracking-[0.16em] text-stone-400">
          Please keep this page open while generation completes
        </p>
      </div>
    </section>
  )
}

export default GenerationLoadingView
'@

Write-Host ""
Write-Host "Step 29.4 script completed successfully." -ForegroundColor Green
Write-Host "Backup folder created only for files that already existed:" -ForegroundColor DarkGreen
Write-Host $BackupRoot -ForegroundColor DarkGreen
Write-Host ""
Write-Host "Next: run npm run dev and test the input, upload, prep, and loading flow." -ForegroundColor Cyan

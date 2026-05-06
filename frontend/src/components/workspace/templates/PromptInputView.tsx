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

import { useRef, useState } from 'react'
import type { TemplateItem } from '../../../data/templates/template.types'

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

  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          Back to input methods
        </button>

        <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {template.title}
        </div>
      </div>

      <div className="mt-10">
        <p className="text-sm font-medium text-stone-500">Prompt / Text</p>
        <h2 className="mt-2 text-[40px] font-semibold leading-[1.1] tracking-[-0.02em] text-stone-900">
          Describe or speak what should go into this document
        </h2>
        <p className="mt-4 max-w-[820px] text-base leading-7 text-stone-500">
          Speak as long as needed. When you are done, press{' '}
          <span className="font-semibold text-stone-700">Stop listening</span>,
          review the text, then continue.
        </p>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-[32px] border border-stone-200 bg-white p-7 shadow-[0_18px_50px_rgba(28,25,23,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                Input
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-stone-900">
                Prompt editor
              </h3>
            </div>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={
                isListening
                  ? 'inline-flex h-11 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700'
                  : 'inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100'
              }
            >
              {isListening ? 'Stop listening' : 'Use voice input'}
            </button>
          </div>

          {voiceError && (
            <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {voiceError}
            </div>
          )}

          {isListening && (
            <div className="mt-5 rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-600">
              Listening continuously... speak until you are done, then press Stop listening.
            </div>
          )}

          <div className="mt-8 rounded-[28px] border border-stone-200 bg-stone-50 p-4">
            <textarea
              value={promptValue}
              onChange={(event) => setPromptValue(event.target.value)}
              placeholder="Describe the document you want to generate..."
              className="min-h-[320px] w-full resize-none rounded-[22px] border border-stone-200 bg-white px-5 py-5 text-sm leading-7 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-stone-300"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onContinue(promptValue)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
            >
              Continue to generate
            </button>

            <button
              type="button"
              onClick={() => setPromptValue('')}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              Clear prompt
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            Voice tips
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-semibold text-stone-900">
                Speak until finished
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                The microphone keeps listening until you press Stop listening.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-900">
                Review before generating
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-500">
                After speaking, quickly check the text and correct anything that was misunderstood.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default PromptInputView
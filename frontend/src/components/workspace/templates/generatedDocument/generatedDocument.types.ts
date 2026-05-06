export type EditableSection = {
  heading: string
  content: string
}

export type SelectedTextState = {
  sectionIndex: number
  start: number
  end: number
  text: string
} | null

export type SpeechRecognitionConstructor = new () => SpeechRecognition

export type SpeechRecognitionEventResult = {
  transcript: string
}

export type SpeechRecognitionEventLike = {
  resultIndex: number
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      [index: number]: SpeechRecognitionEventResult
    }
  }
}

export type SpeechRecognitionErrorEventLike = {
  error: string
}

export type SpeechRecognition = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
}

export const toneOptions = [
  'Professional',
  'Formal',
  'Simple',
  'Persuasive',
  'Student-friendly',
  'Executive',
  'Teacher-friendly',
]
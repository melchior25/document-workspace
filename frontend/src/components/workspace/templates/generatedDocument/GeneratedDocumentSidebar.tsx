import ExportPanel from '../ExportPanel'
import { toneOptions } from './generatedDocument.types'
import type { GeneratedDocumentEditor } from './useGeneratedDocumentEditor'

type GeneratedDocumentSidebarProps = {
  editor: GeneratedDocumentEditor
}

function GeneratedDocumentSidebar({ editor }: GeneratedDocumentSidebarProps) {
  const {
    savedDocument,
    isSaving,
    saveError,
    handleSaveDocument,

    documentReview,
    isReviewingDocument,
    reviewError,
    handleReviewDocument,

    smartSummary,
    isSummarizingDocument,
    summaryError,
    handleSummarizeDocument,

    comparisonInput,
    setComparisonInput,
    comparisonResult,
    isComparingDocument,
    comparisonError,
    handleCompareDocument,

    selectedTone,
    setSelectedTone,

    assistantPrompt,
    setAssistantPrompt,
    assistantMessages,
    isRequestingCorrection,
    correctionError,
    isListeningCorrection,
    voiceError,
    handleCorrectionVoiceInput,
    handleAssistantSubmit,
    handleApplySuggestion,

    selectedExportFormat,
    setSelectedExportFormat,
    exportResult,
    isExporting,
    exportError,
    handleExport,
  } = editor

  return (
    <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[30px] border border-stone-200 bg-white p-5 shadow-[0_20px_60px_rgba(28,25,23,0.07)]">
      <PanelTitle>Document actions</PanelTitle>

      <div className="mt-5 space-y-3">
        <PrimaryButton onClick={handleSaveDocument} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save document'}
        </PrimaryButton>

        <SecondaryButton
          onClick={handleReviewDocument}
          disabled={isReviewingDocument}
        >
          {isReviewingDocument ? 'Reviewing...' : 'Review document'}
        </SecondaryButton>

        <SecondaryButton
          onClick={handleSummarizeDocument}
          disabled={isSummarizingDocument}
        >
          {isSummarizingDocument ? 'Summarizing...' : 'Smart summary'}
        </SecondaryButton>

        {savedDocument && (
          <SuccessBox>
            Saved successfully as{' '}
            <span className="font-semibold">{savedDocument.title}</span>
          </SuccessBox>
        )}

        {saveError && <ErrorBox message={saveError} />}
        {reviewError && <ErrorBox message={reviewError} />}
        {summaryError && <ErrorBox message={summaryError} />}

        {smartSummary && (
          <ResultCard title="Smart Summary">
            <p className="text-sm leading-7 text-stone-600">
              {smartSummary.shortSummary}
            </p>

            <div className="mt-4 space-y-4">
              <ReviewList title="Key points" items={smartSummary.keyPoints} />
              <ReviewList
                title="Action items"
                items={smartSummary.actionItems}
              />
              <ReviewList
                title="Important notes"
                items={smartSummary.importantNotes}
              />

              <TextBlock
                title="Quick recommendation"
                text={smartSummary.quickRecommendation}
              />
            </div>
          </ResultCard>
        )}

        {documentReview && (
          <ResultCard
            title="Review"
            rightLabel={`${documentReview.overallScore}/100`}
          >
            <div className="space-y-4">
              <ReviewList title="Strengths" items={documentReview.strengths} />
              <ReviewList title="Issues" items={documentReview.issues} />
              <ReviewList
                title="Missing points"
                items={documentReview.missingPoints}
              />
              <ReviewList
                title="Recommendations"
                items={documentReview.recommendations}
              />

              <p className="text-sm leading-7 text-stone-500">
                {documentReview.finalComment}
              </p>
            </div>
          </ResultCard>
        )}
      </div>

      <PanelSection title="Compare document">
        <textarea
          value={comparisonInput}
          onChange={(event) => setComparisonInput(event.target.value)}
          placeholder="Paste another document or version here to compare against the current document."
          className="min-h-[135px] w-full resize-y rounded-[20px] border border-stone-200 bg-white px-4 py-4 text-sm leading-7 text-stone-700 outline-none placeholder:text-stone-400 focus:border-stone-300"
        />

        <PrimaryButton
          className="mt-4"
          onClick={handleCompareDocument}
          disabled={isComparingDocument}
        >
          {isComparingDocument ? 'Comparing...' : 'Compare documents'}
        </PrimaryButton>

        {comparisonError && <ErrorBox message={comparisonError} />}

        {comparisonResult && (
          <ResultCard title="Comparison result">
            <p className="text-sm leading-7 text-stone-600">
              {comparisonResult.summary}
            </p>

            <div className="mt-4 space-y-4">
              <ReviewList
                title="Main differences"
                items={comparisonResult.mainDifferences}
              />
              <ReviewList title="Overlap" items={comparisonResult.overlap} />
              <ReviewList
                title="Missing from current"
                items={comparisonResult.missingFromA}
              />
              <ReviewList
                title="Missing from pasted"
                items={comparisonResult.missingFromB}
              />
              <ReviewList
                title="Suggestions"
                items={comparisonResult.improvementSuggestions}
              />

              <TextBlock
                title="Final recommendation"
                text={comparisonResult.finalRecommendation}
              />
            </div>
          </ResultCard>
        )}
      </PanelSection>

      <PanelSection title="Tone control">
        <label className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
          Editing tone
        </label>

        <select
          value={selectedTone}
          onChange={(event) => setSelectedTone(event.target.value)}
          className="mt-3 h-11 w-full rounded-full border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 outline-none"
        >
          {toneOptions.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>

        <p className="mt-3 text-xs leading-6 text-stone-500">
          Used for inline improvement, section regeneration and correction
          suggestions.
        </p>
      </PanelSection>

      <PanelSection title="AI correction assistant">
        <button
          type="button"
          onClick={handleCorrectionVoiceInput}
          className={
            isListeningCorrection
              ? 'inline-flex h-10 items-center justify-center rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700'
              : 'inline-flex h-10 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50'
          }
        >
          {isListeningCorrection ? 'Stop listening' : 'Use voice input'}
        </button>

        {voiceError && <ErrorBox message={voiceError} />}

        {isListeningCorrection && (
          <div className="mt-4 rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-600">
            Listening continuously... speak your correction request, then press
            Stop listening.
          </div>
        )}

        <textarea
          value={assistantPrompt}
          onChange={(event) => setAssistantPrompt(event.target.value)}
          placeholder="Example: Make the executive summary shorter and improve the recommendations section."
          className="mt-4 min-h-[115px] w-full resize-y rounded-[20px] border border-stone-200 bg-white px-4 py-4 text-sm leading-7 text-stone-700 outline-none placeholder:text-stone-400 focus:border-stone-300"
        />

        <PrimaryButton
          className="mt-4"
          onClick={handleAssistantSubmit}
          disabled={isRequestingCorrection}
        >
          {isRequestingCorrection ? 'Preparing...' : 'Prepare suggestion'}
        </PrimaryButton>

        {correctionError && <ErrorBox message={correctionError} />}

        <div className="mt-5 space-y-4">
          {assistantMessages.map((message) => (
            <ResultCard key={message.id} title="Suggestion">
              <TextBlock title="Request" text={message.request} />

              <div className="mt-4">
                <TextBlock title="Suggestion" text={message.suggestion} />
              </div>

              <SecondaryButton
                className="mt-5"
                onClick={() => handleApplySuggestion(message)}
              >
                Apply suggestion to notes
              </SecondaryButton>
            </ResultCard>
          ))}
        </div>
      </PanelSection>

      <ExportPanel
        selectedFormat={selectedExportFormat}
        exportResult={exportResult}
        isExporting={isExporting}
        exportError={exportError}
        onFormatChange={setSelectedExportFormat}
        onExport={handleExport}
      />
    </aside>
  )
}

function PanelTitle({ children }: { children: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
      {children}
    </p>
  )
}

function PanelSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mt-8 border-t border-stone-200 pt-6">
      <PanelTitle>{title}</PanelTitle>
      <div className="mt-5 rounded-[24px] border border-stone-200 bg-stone-50 p-4">
        {children}
      </div>
    </div>
  )
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-full items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  )
}

function SecondaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 w-full items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  )
}

function ResultCard({
  title,
  rightLabel,
  children,
}: {
  title: string
  rightLabel?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[22px] border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">
          {title}
        </p>

        {rightLabel && (
          <p className="rounded-full bg-stone-50 px-3 py-1 text-xs font-bold text-stone-700">
            {rightLabel}
          </p>
        )}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  )
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
        {title}
      </p>
      <ul className="mt-2 space-y-1 text-sm leading-6 text-stone-600">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function TextBlock({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-400">
        {title}
      </p>
      <p className="mt-2 whitespace-pre-line text-sm leading-7 text-stone-600">
        {text}
      </p>
    </div>
  )
}

function SuccessBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-7 text-emerald-800">
      {children}
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  )
}

export default GeneratedDocumentSidebar
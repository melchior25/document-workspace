$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Build Step 30: Final polish + production feel ===" -ForegroundColor Cyan
Write-Host "Updating workspace polish files..." -ForegroundColor Yellow

$ProjectRoot = Get-Location

function Write-ProjectFile {
  param(
    [Parameter(Mandatory = $true)][string]$Path,
    [Parameter(Mandatory = $true)][string]$Content
  )

  $FullPath = Join-Path $ProjectRoot $Path
  $Directory = Split-Path $FullPath -Parent

  if (-not (Test-Path $Directory)) {
    New-Item -ItemType Directory -Path $Directory -Force | Out-Null
  }

  $Content | Set-Content -Path $FullPath -Encoding UTF8
  Write-Host "Updated $Path" -ForegroundColor Green
}

Write-ProjectFile -Path "src\components\workspace\templates\TemplateGrid.tsx" -Content @'
import TemplateCard from './TemplateCard'
import type { TemplateItem } from '../../../data/templates/template.types'

type TemplateGridProps = {
  templates: TemplateItem[]
  onTemplateSelect: (template: TemplateItem) => void
}

function TemplateGrid({ templates, onTemplateSelect }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="rounded-[34px] border border-dashed border-stone-300 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(28,25,23,0.045)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-sm font-bold uppercase tracking-[0.16em] text-stone-500">
          No
        </div>

        <h4 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
          No templates found
        </h4>

        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-7 text-stone-500">
          Try a different search term or choose another category. Templates are
          the first step in the guided document creation flow.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
        />
      ))}
    </div>
  )
}

export default TemplateGrid
'@

Write-ProjectFile -Path "src\components\workspace\templates\TemplateSectionHeader.tsx" -Content @'
function TemplateSectionHeader() {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-stone-500">Browse templates</p>
        <h3 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-stone-950">
          Start with a document structure
        </h3>
        <p className="mt-3 max-w-[620px] text-sm leading-7 text-stone-500">
          Pick the closest structure first. The workspace will help you add
          source content, generate a draft, and refine it in the editor.
        </p>
      </div>

      <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-stone-400 shadow-sm">
        Template-first flow
      </div>
    </section>
  )
}

export default TemplateSectionHeader
'@

Write-ProjectFile -Path "src\components\workspace\templates\TemplateCard.tsx" -Content @'
import TemplateCardPreview from './TemplateCardPreview'
import type { TemplateCardProps } from './templateCard.types'

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <article
      className="group relative cursor-pointer transition duration-300"
      onClick={() => onSelect(template)}
    >
      <div className="absolute inset-0 rounded-[30px] bg-stone-100 transition duration-300 group-hover:bg-stone-200/60" />

      <div className="relative z-10 mx-4 -mb-14 rounded-[24px] bg-white shadow-[0_26px_70px_rgba(28,25,23,0.12)] transition duration-300 group-hover:-translate-y-3 group-hover:scale-[1.015] group-hover:shadow-[0_42px_110px_rgba(28,25,23,0.16)]">
        <TemplateCardPreview previewKey={template.previewKey} />
      </div>

      <div className="relative z-0 rounded-[30px] border border-stone-200/80 bg-white/82 px-5 pt-20 pb-6 backdrop-blur-sm transition duration-300 group-hover:border-stone-300 group-hover:bg-white">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-stone-400">
            Template
          </span>
          <span className="h-2 w-2 rounded-full bg-stone-300 transition group-hover:bg-stone-900" />
        </div>

        <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-stone-950 transition duration-200 group-hover:text-black">
          {template.title}
        </h4>

        <p className="mt-2 text-sm leading-6 text-stone-500 transition duration-200 group-hover:text-stone-600">
          {template.description}
        </p>

        <div className="mt-5 inline-flex text-sm font-semibold text-stone-900">
          Preview and generate
        </div>
      </div>
    </article>
  )
}

export default TemplateCard
'@

Write-ProjectFile -Path "src\components\workspace\templates\GeneratedDocumentView.tsx" -Content @'
import type { GeneratedDocument } from '../../../features/generation/generation.types'
import GeneratedDocumentCanvas from './generatedDocument/GeneratedDocumentCanvas'
import GeneratedDocumentSidebar from './generatedDocument/GeneratedDocumentSidebar'
import { useGeneratedDocumentEditor } from './generatedDocument/useGeneratedDocumentEditor'

type GeneratedDocumentViewProps = {
  document: GeneratedDocument
  onBack: () => void
}

function GeneratedDocumentView({
  document,
  onBack,
}: GeneratedDocumentViewProps) {
  const editor = useGeneratedDocumentEditor({ document, onBack })

  return (
    <section className="flex flex-col">
      <div className="rounded-[30px] border border-stone-200/80 bg-white px-5 py-4 shadow-sm md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              Editable document workspace
            </p>
            <h2 className="mt-1 truncate text-xl font-semibold tracking-[-0.025em] text-stone-950">
              {editor.title || document.title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={editor.onBack}
              className="inline-flex h-11 items-center justify-center rounded-full border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 hover:text-stone-950"
            >
              Back to generation
            </button>

            <div className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              AI-assisted editor
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_390px]">
        <GeneratedDocumentCanvas editor={editor} />
        <GeneratedDocumentSidebar editor={editor} />
      </div>
    </section>
  )
}

export default GeneratedDocumentView
'@

Write-ProjectFile -Path "src\components\workspace\templates\generatedDocument\GeneratedDocumentCanvas.tsx" -Content @'
import type { GeneratedDocumentEditor } from './useGeneratedDocumentEditor'

type GeneratedDocumentCanvasProps = {
  editor: GeneratedDocumentEditor
}

function GeneratedDocumentCanvas({ editor }: GeneratedDocumentCanvasProps) {
  const {
    document,
    title,
    setTitle,
    summary,
    setSummary,
    notes,
    setNotes,
    editableSections,
    selectedText,
    selectedTone,
    sourceMeta,
    isImprovingSelection,
    inlineEditError,
    regeneratingSectionIndex,
    handleSectionChange,
    handleSectionTextSelect,
    handleImproveSelection,
    handleRegenerateSection,
  } = editor

  return (
    <div className="rounded-[38px] border border-stone-200/80 bg-[#eee8dd] p-4 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
      <div className="rounded-[32px] bg-white px-6 py-8 shadow-[0_26px_90px_rgba(28,25,23,0.10)] md:px-10 md:py-10">
        <div className="mx-auto max-w-[880px]">
          <div className="border-b border-stone-200 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
                Professional Draft
              </p>

              <span className="rounded-full bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-500 ring-1 ring-stone-200">
                {editableSections.length} sections
              </span>
            </div>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Document title"
              className="mt-5 w-full border-none bg-transparent text-[38px] font-semibold leading-[1.08] tracking-[-0.045em] text-stone-950 outline-none md:text-[44px]"
            />

            <p className="mt-5 max-w-[720px] text-sm leading-7 text-stone-500">
              Generated from the <strong>{document.templateTitle}</strong>{' '}
              template using a{' '}
              <strong>{document.generationInstruction.tone}</strong> tone.
            </p>

            {sourceMeta && (
              <div className="mt-7 grid gap-3 md:grid-cols-3">
                <MetaCard label="Source mode" value={sourceMeta.mode} />
                <MetaCard label="Chunks" value={sourceMeta.chunkCount} />
                <MetaCard
                  label="Source size"
                  value={`${sourceMeta.totalCharacters} chars`}
                />
              </div>
            )}
          </div>

          <div className="mt-10">
            <SectionLabel>Executive Summary</SectionLabel>

            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              aria-label="Executive summary"
              className="mt-4 min-h-[170px] w-full resize-y rounded-[26px] border border-stone-200 bg-stone-50 px-6 py-5 text-[15px] leading-8 text-stone-700 outline-none transition focus:border-stone-300 focus:bg-white focus:shadow-[0_12px_36px_rgba(28,25,23,0.06)]"
            />
          </div>

          <div className="mt-12 space-y-6">
            {editableSections.map((section, index) => {
              const isSelectedSection = selectedText?.sectionIndex === index
              const hasSelection = isSelectedSection && selectedText

              return (
                <section
                  key={`${section.heading}-${index}`}
                  className="rounded-[30px] border border-stone-200/90 bg-white p-5 shadow-[0_12px_34px_rgba(28,25,23,0.04)] transition hover:border-stone-300"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-stone-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-stone-400 ring-1 ring-stone-200">
                      Section {index + 1}
                    </span>
                  </div>

                  <input
                    value={section.heading}
                    onChange={(event) =>
                      handleSectionChange(
                        index,
                        'heading',
                        event.target.value,
                      )
                    }
                    aria-label={`Section ${index + 1} heading`}
                    className="w-full border-b border-stone-200 bg-transparent pb-4 text-[22px] font-semibold tracking-[-0.03em] text-stone-950 outline-none"
                  />

                  <textarea
                    value={section.content}
                    onChange={(event) =>
                      handleSectionChange(
                        index,
                        'content',
                        event.target.value,
                      )
                    }
                    onSelect={(event) => handleSectionTextSelect(index, event)}
                    onMouseUp={(event) => handleSectionTextSelect(index, event)}
                    onKeyUp={(event) => handleSectionTextSelect(index, event)}
                    aria-label={`Section ${index + 1} content`}
                    className="mt-5 min-h-[220px] w-full resize-y border-none bg-transparent text-[15px] leading-8 text-stone-700 outline-none placeholder:text-stone-400"
                  />

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-stone-50 px-4 py-3">
                    <p className="text-xs leading-6 text-stone-500">
                      {hasSelection
                        ? `Selected text ready for ${selectedTone} improvement.`
                        : 'Select text inside this section to enable inline improvement.'}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleImproveSelection}
                        disabled={!hasSelection || isImprovingSelection}
                        className="inline-flex h-9 items-center justify-center rounded-full bg-stone-950 px-4 text-xs font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        {isImprovingSelection
                          ? 'Improving...'
                          : 'Improve selection'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRegenerateSection(index)}
                        disabled={regeneratingSectionIndex === index}
                        className="inline-flex h-9 items-center justify-center rounded-full border border-stone-200 bg-white px-4 text-xs font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {regeneratingSectionIndex === index
                          ? 'Regenerating...'
                          : 'Regenerate section'}
                      </button>
                    </div>
                  </div>
                </section>
              )
            })}
          </div>

          {inlineEditError && (
            <div className="mt-6 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {inlineEditError}
            </div>
          )}

          <div className="mt-12">
            <SectionLabel>Final Notes</SectionLabel>

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              aria-label="Final notes"
              className="mt-4 min-h-[190px] w-full resize-y rounded-[26px] border border-stone-200 bg-stone-50 px-6 py-5 text-[15px] leading-8 text-stone-700 outline-none transition focus:border-stone-300 focus:bg-white focus:shadow-[0_12px_36px_rgba(28,25,23,0.06)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-stone-900">{value}</p>
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
      {children}
    </p>
  )
}

export default GeneratedDocumentCanvas
'@

Write-ProjectFile -Path "src\components\workspace\templates\generatedDocument\GeneratedDocumentSidebar.tsx" -Content @'
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
    <aside className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-[32px] border border-stone-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(28,25,23,0.07)]">
      <div className="rounded-[26px] bg-stone-50 px-4 py-4">
        <PanelTitle>Document actions</PanelTitle>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          Save, review, summarize, compare, correct, and export the current draft.
        </p>
      </div>

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
          <div className="mt-4 flex items-center gap-3 rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            Listening continuously. Speak your correction request, then press
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
      <div className="mt-5 rounded-[24px] border border-stone-200/80 bg-stone-50 p-4">
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
      className={`inline-flex h-11 w-full items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
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
    <div className="rounded-[24px] border border-stone-200/80 bg-white p-5 shadow-sm">
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
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
            <span>{item}</span>
          </li>
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
'@

Write-ProjectFile -Path "src\index.css" -Content @'
@import "tailwindcss";

:root {
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #1f2937;
  background: #f5f3ee;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100vh;
}

html {
  background: #f5f3ee;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.75), transparent 32%),
    radial-gradient(circle at bottom right, rgba(231, 229, 228, 0.54), transparent 38%),
    linear-gradient(180deg, #f8f6f2 0%, #f3f0ea 100%);
  color: #1f2937;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 3px solid rgba(120, 113, 108, 0.22);
  outline-offset: 2px;
}

button:disabled {
  cursor: not-allowed;
}

::selection {
  background: rgba(120, 113, 108, 0.22);
  color: rgb(28 25 23);
}

::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 162, 158, 0.55);
  border: 3px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 113, 108, 0.72);
  border: 3px solid transparent;
  background-clip: content-box;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

.nav-item {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 1.125rem;
  padding: 0.75rem 1rem;
  text-align: left;
  color: rgb(87 83 78);
  background: transparent;
  border: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.82);
  color: rgb(28 25 23);
  transform: translateX(2px);
}
'@

Write-Host ""
Write-Host "Step 30 files updated successfully." -ForegroundColor Green
Write-Host "Run npm run dev and test the full workspace flow." -ForegroundColor Cyan

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
    <div className="rounded-[36px] border border-stone-200 bg-[#eee8dd] p-4 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
      <div className="rounded-[30px] bg-white px-7 py-9 shadow-[0_26px_90px_rgba(28,25,23,0.10)] md:px-10">
        <div className="mx-auto max-w-[860px]">
          <div className="border-b border-stone-200 pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400">
              Professional Draft
            </p>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
              className="mt-4 min-h-[170px] w-full resize-y rounded-[24px] border border-stone-200 bg-stone-50 px-6 py-5 text-[15px] leading-8 text-stone-700 outline-none transition focus:border-stone-300 focus:bg-white focus:shadow-[0_12px_36px_rgba(28,25,23,0.06)]"
            />
          </div>

          <div className="mt-12 space-y-6">
            {editableSections.map((section, index) => {
              const isSelectedSection = selectedText?.sectionIndex === index
              const hasSelection = isSelectedSection && selectedText

              return (
                <section
                  key={`${section.heading}-${index}`}
                  className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_12px_34px_rgba(28,25,23,0.04)] transition hover:border-stone-300"
                >
                  <input
                    value={section.heading}
                    onChange={(event) =>
                      handleSectionChange(
                        index,
                        'heading',
                        event.target.value,
                      )
                    }
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
                    className="mt-5 min-h-[220px] w-full resize-y border-none bg-transparent text-[15px] leading-8 text-stone-700 outline-none placeholder:text-stone-400"
                  />

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs leading-6 text-stone-400">
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
              className="mt-4 min-h-[190px] w-full resize-y rounded-[24px] border border-stone-200 bg-stone-50 px-6 py-5 text-[15px] leading-8 text-stone-700 outline-none transition focus:border-stone-300 focus:bg-white focus:shadow-[0_12px_36px_rgba(28,25,23,0.06)]"
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
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Build Step 29.5: Sidebar + layout consistency ===" -ForegroundColor Cyan

if (-not (Test-Path "src") -and (Test-Path "frontend\src")) {
  Set-Location "frontend"
}

if (-not (Test-Path "src")) {
  Write-Host "Could not find the frontend src folder." -ForegroundColor Red
  Write-Host "Place this script in C:\Users\boskm\document-workspace\frontend and run it again." -ForegroundColor Yellow
  exit 1
}

$BackupRoot = "_backups\step_29_5_sidebar_layout_consistency_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null

function Backup-File {
  param([string]$Path)

  if (Test-Path $Path) {
    $Target = Join-Path $BackupRoot $Path
    $TargetDir = Split-Path $Target -Parent
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Copy-Item $Path $Target -Force
  }
}

function Write-ProjectFile {
  param(
    [string]$Path,
    [string]$Content
  )

  Backup-File $Path
  $Dir = Split-Path $Path -Parent
  if ($Dir -and -not (Test-Path $Dir)) {
    New-Item -ItemType Directory -Path $Dir -Force | Out-Null
  }
  Set-Content -Path $Path -Value $Content -Encoding UTF8
  Write-Host "Updated $Path" -ForegroundColor Green
}

Write-ProjectFile "src\components\workspace\shell\WorkspaceShell.tsx" @'
import WorkspaceSidebar from './WorkspaceSidebar'
import WorkspaceMain from './WorkspaceMain'

function WorkspaceShell() {
  return (
    <div className="min-h-screen bg-[#f4f1eb] px-3 py-3 md:px-5 md:py-5 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-1.5rem)] w-full max-w-[1580px] overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-[0_28px_90px_rgba(28,25,23,0.10)] md:h-[calc(100vh-2.5rem)]">
        <WorkspaceSidebar />
        <WorkspaceMain />
      </div>
    </div>
  )
}

export default WorkspaceShell
'@

Write-ProjectFile "src\components\workspace\shell\WorkspaceMain.tsx" @'
import { useState } from 'react'
import TemplateCategoryTabs from '../categories/TemplateCategoryTabs'
import WorkspaceIntro from '../intro/WorkspaceIntro'
import TemplateGrid from '../templates/TemplateGrid'
import DocumentUploadView from '../templates/DocumentUploadView'
import GeneratedDocumentView from '../templates/GeneratedDocumentView'
import GenerationLoadingView from '../templates/GenerationLoadingView'
import GenerationPrepView from '../templates/GenerationPrepView'
import PromptInputView from '../templates/PromptInputView'
import TemplateInputModeView from '../templates/TemplateInputModeView'
import type { TemplateInputMode } from '../templates/TemplateInputModeView'
import TemplatePreviewView from '../templates/TemplatePreviewView'
import TemplateSectionHeader from '../templates/TemplateSectionHeader'
import WorkspaceTopbar from '../topbar/WorkspaceTopbar'
import { useTemplateFilters } from '../../../features/templates/useTemplateFilters'
import { generateDocument } from '../../../features/generation/generationApi'
import type { GeneratedDocument } from '../../../features/generation/generation.types'
import type { UploadedDocumentExtraction } from '../../../features/uploads/upload.types'
import type { TemplateItem } from '../../../data/templates/template.types'

type WorkspaceStep =
  | 'grid'
  | 'preview'
  | 'input-mode'
  | 'prompt-input'
  | 'document-upload'
  | 'generation-prep'
  | 'generation-loading'
  | 'generated-document'

function WorkspaceMain() {
  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredTemplates,
  } = useTemplateFilters()

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(
    null,
  )
  const [currentStep, setCurrentStep] = useState<WorkspaceStep>('grid')
  const [selectedInputMode, setSelectedInputMode] =
    useState<TemplateInputMode | null>(null)
  const [promptText, setPromptText] = useState('')
  const [uploadedExtraction, setUploadedExtraction] =
    useState<UploadedDocumentExtraction | null>(null)
  const [generatedDocument, setGeneratedDocument] =
    useState<GeneratedDocument | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleTemplateSelect = (template: TemplateItem) => {
    setSelectedTemplate(template)
    setCurrentStep('preview')
    setSelectedInputMode(null)
    setPromptText('')
    setUploadedExtraction(null)
    setGeneratedDocument(null)
    setErrorMessage(null)
  }

  const handleBackToTemplates = () => {
    setSelectedTemplate(null)
    setCurrentStep('grid')
    setSelectedInputMode(null)
    setPromptText('')
    setUploadedExtraction(null)
    setGeneratedDocument(null)
    setErrorMessage(null)
  }

  const handleUseTemplate = () => {
    setCurrentStep('input-mode')
  }

  const handleBackToPreview = () => {
    setCurrentStep('preview')
  }

  const handleBackToInputModes = () => {
    setCurrentStep('input-mode')
  }

  const handleInputModeSelect = (mode: TemplateInputMode) => {
    setSelectedInputMode(mode)
    setGeneratedDocument(null)
    setErrorMessage(null)
    setCurrentStep(mode === 'prompt' ? 'prompt-input' : 'document-upload')
  }

  const handlePromptContinue = (value: string) => {
    setPromptText(value)
    setUploadedExtraction(null)
    setCurrentStep('generation-prep')
  }

  const handleDocumentContinue = (extraction: UploadedDocumentExtraction) => {
    setUploadedExtraction(extraction)
    setPromptText('')
    setCurrentStep('generation-prep')
  }

  const handleBackFromGenerationPrep = () => {
    if (selectedInputMode === 'prompt') {
      setCurrentStep('prompt-input')
      return
    }

    if (selectedInputMode === 'document') {
      setCurrentStep('document-upload')
      return
    }

    setCurrentStep('input-mode')
  }

  const handleBackFromGeneratedDocument = () => {
    setCurrentStep('generation-prep')
  }

  const handleGenerateDocument = async () => {
    if (!selectedTemplate || !selectedInputMode) return

    setIsGenerating(true)
    setErrorMessage(null)
    setCurrentStep('generation-loading')

    try {
      const document = await generateDocument({
        templateId: selectedTemplate.id,
        templateTitle: selectedTemplate.title,
        templateCategory: selectedTemplate.category,
        inputMode: selectedInputMode,
        promptText: selectedInputMode === 'prompt' ? promptText : undefined,
        documentContext:
          selectedInputMode === 'document'
            ? uploadedExtraction?.extractedText
            : undefined,
      })

      setGeneratedDocument(document)
      setCurrentStep('generated-document')
    } catch {
      setErrorMessage('Could not connect to the generation endpoint.')
      setCurrentStep('generation-prep')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#fdfcfb] px-5 py-5 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1380px] pb-14">
        <WorkspaceTopbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {currentStep === 'grid' && (
          <>
            <div className="mt-8">
              <WorkspaceIntro />
            </div>

            <div className="mt-8">
              <TemplateCategoryTabs
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            <div className="mt-10">
              <TemplateSectionHeader />
            </div>

            <div className="mt-6">
              <TemplateGrid
                templates={filteredTemplates}
                onTemplateSelect={handleTemplateSelect}
              />
            </div>
          </>
        )}

        {currentStep === 'preview' && selectedTemplate && (
          <div className="mt-8">
            <TemplatePreviewView
              template={selectedTemplate}
              onBack={handleBackToTemplates}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        )}

        {currentStep === 'input-mode' && selectedTemplate && (
          <div className="mt-8">
            <TemplateInputModeView
              template={selectedTemplate}
              onBack={handleBackToPreview}
              onSelectMode={handleInputModeSelect}
            />
          </div>
        )}

        {currentStep === 'prompt-input' && selectedTemplate && (
          <div className="mt-8">
            <PromptInputView
              template={selectedTemplate}
              onBack={handleBackToInputModes}
              onContinue={handlePromptContinue}
            />
          </div>
        )}

        {currentStep === 'document-upload' && selectedTemplate && (
          <div className="mt-8">
            <DocumentUploadView
              template={selectedTemplate}
              onBack={handleBackToInputModes}
              onContinue={handleDocumentContinue}
            />
          </div>
        )}

        {currentStep === 'generation-prep' &&
          selectedTemplate &&
          selectedInputMode && (
            <div className="mt-8">
              <GenerationPrepView
                template={selectedTemplate}
                inputMode={selectedInputMode}
                generatedDocument={generatedDocument}
                isGenerating={isGenerating}
                errorMessage={errorMessage}
                onBack={handleBackFromGenerationPrep}
                onGenerate={handleGenerateDocument}
              />
            </div>
          )}

        {currentStep === 'generation-loading' &&
          selectedTemplate &&
          selectedInputMode && (
            <div className="mt-8">
              <GenerationLoadingView
                template={selectedTemplate}
                inputMode={selectedInputMode}
              />
            </div>
          )}

        {currentStep === 'generated-document' && generatedDocument && (
          <div className="mt-8">
            <GeneratedDocumentView
              document={generatedDocument}
              onBack={handleBackFromGeneratedDocument}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default WorkspaceMain
'@

Write-ProjectFile "src\components\workspace\shell\WorkspaceSidebar.tsx" @'
import BrandMark from '../sidebar/BrandMark'
import CreateDocumentButton from '../sidebar/CreateDocumentButton'
import PrimaryNav from '../sidebar/PrimaryNav'
import CategoryNav from '../sidebar/CategoryNav'
import UpgradeCard from '../sidebar/UpgradeCard'
import UserProfileCard from '../sidebar/UserProfileCard'

function WorkspaceSidebar() {
  return (
    <aside className="hidden w-[300px] shrink-0 border-r border-stone-200/80 bg-[#faf9f6] px-5 py-6 lg:flex">
      <div className="flex min-h-0 w-full flex-col">
        <BrandMark />
        <CreateDocumentButton />

        <div className="mt-7 min-h-0 flex-1 space-y-7 overflow-y-auto pr-1">
          <PrimaryNav />
          <CategoryNav />
        </div>

        <div className="mt-5 space-y-3">
          <UpgradeCard />
          <UserProfileCard />
        </div>
      </div>
    </aside>
  )
}

export default WorkspaceSidebar
'@

Write-ProjectFile "src\components\workspace\sidebar\BrandMark.tsx" @'
function BrandMark() {
  return (
    <div className="flex items-center gap-3 rounded-[24px] bg-white/70 p-2 shadow-[inset_0_0_0_1px_rgba(231,229,228,0.75)]">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-stone-900 text-sm font-bold tracking-[-0.02em] text-white shadow-[0_12px_30px_rgba(28,25,23,0.18)]">
        DW
      </div>

      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-stone-400">
          Document workspace
        </p>
        <h1 className="truncate text-lg font-semibold tracking-[-0.03em] text-stone-950">
          Document AI
        </h1>
      </div>
    </div>
  )
}

export default BrandMark
'@

Write-ProjectFile "src\components\workspace\sidebar\CreateDocumentButton.tsx" @'
function CreateDocumentButton() {
  return (
    <button
      type="button"
      className="mt-7 flex w-full items-center justify-between rounded-[22px] bg-stone-950 px-4 py-4 text-left text-white shadow-[0_18px_42px_rgba(28,25,23,0.18)] transition hover:-translate-y-0.5 hover:bg-stone-800"
    >
      <span>
        <span className="block text-sm font-semibold">New document</span>
        <span className="mt-1 block text-xs font-medium text-stone-300">
          Choose template and generate
        </span>
      </span>

      <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
        +
      </span>
    </button>
  )
}

export default CreateDocumentButton
'@

Write-ProjectFile "src\components\workspace\sidebar\PrimaryNav.tsx" @'
type PrimaryNavItem = {
  label: string
  helper: string
  active?: boolean
}

const primaryItems: PrimaryNavItem[] = [
  {
    label: 'Home',
    helper: 'Start a new document',
    active: true,
  },
  {
    label: 'Saved documents',
    helper: 'Open previous work',
  },
  {
    label: 'Templates',
    helper: 'Browse document types',
  },
  {
    label: 'AI tools',
    helper: 'Review, summary, compare',
  },
]

function PrimaryNav() {
  return (
    <nav aria-label="Workspace navigation">
      <p className="px-4 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-stone-400">
        Workspace
      </p>

      <div className="mt-3 space-y-1.5">
        {primaryItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className={
              item.active
                ? 'flex w-full items-center justify-between rounded-[18px] bg-white px-4 py-3 text-left shadow-sm ring-1 ring-black/5'
                : 'nav-item group'
            }
          >
            <span className="min-w-0">
              <span
                className={
                  item.active
                    ? 'block text-sm font-semibold text-stone-950'
                    : 'block text-sm font-semibold text-stone-700 group-hover:text-stone-950'
                }
              >
                {item.label}
              </span>
              <span
                className={
                  item.active
                    ? 'mt-0.5 block text-xs font-medium text-stone-500'
                    : 'mt-0.5 block text-xs font-medium text-stone-400 group-hover:text-stone-500'
                }
              >
                {item.helper}
              </span>
            </span>

            {item.active && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-stone-950" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default PrimaryNav
'@

Write-ProjectFile "src\components\workspace\sidebar\CategoryNav.tsx" @'
type CategoryItem = {
  label: string
  helper: string
}

const categoryItems: CategoryItem[] = [
  {
    label: 'Planning',
    helper: 'Lessons, schedules, projects',
  },
  {
    label: 'Reports',
    helper: 'Progress, status, incidents',
  },
  {
    label: 'Summaries',
    helper: 'Shorten source material',
  },
  {
    label: 'Communication',
    helper: 'Letters and messages',
  },
  {
    label: 'Study & Teaching',
    helper: 'Education-ready documents',
  },
  {
    label: 'Presentations',
    helper: 'Slides and speaking notes',
  },
]

function CategoryNav() {
  return (
    <section aria-label="Template categories">
      <div className="flex items-center justify-between px-4">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-stone-400">
          Categories
        </p>
        <span className="rounded-full bg-stone-200/70 px-2 py-1 text-[0.68rem] font-semibold text-stone-500">
          {categoryItems.length}
        </span>
      </div>

      <div className="mt-3 space-y-1.5">
        {categoryItems.map((item) => (
          <button key={item.label} type="button" className="nav-item group">
            <span className="flex min-w-0 items-start gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-stone-300 transition group-hover:bg-stone-900" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-stone-700 group-hover:text-stone-950">
                  {item.label}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-stone-400 group-hover:text-stone-500">
                  {item.helper}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default CategoryNav
'@

Write-ProjectFile "src\components\workspace\sidebar\UpgradeCard.tsx" @'
function UpgradeCard() {
  return (
    <div className="rounded-[26px] border border-stone-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-stone-950">Workspace status</p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-emerald-700">
          Ready
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-stone-500">
        Generate, edit, review, compare, save, and export documents from one
        guided workspace.
      </p>
    </div>
  )
}

export default UpgradeCard
'@

Write-ProjectFile "src\components\workspace\sidebar\UserProfileCard.tsx" @'
function UserProfileCard() {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-stone-200/80 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-700">
        MB
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-950">Mel B</p>
        <p className="truncate text-xs font-medium text-stone-500">
          Local workspace
        </p>
      </div>
    </div>
  )
}

export default UserProfileCard
'@

Write-ProjectFile "src\components\workspace\topbar\WorkspaceTopbar.tsx" @'
import NotificationButton from './NotificationButton'
import TemplateSearchInput from './TemplateSearchInput'

type WorkspaceTopbarProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
}

function WorkspaceTopbar({
  searchQuery,
  onSearchChange,
}: WorkspaceTopbarProps) {
  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-stone-200/80 bg-white/82 px-4 py-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between md:px-5">
      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-stone-400">
          Template-first workspace
        </p>
        <p className="mt-1 truncate text-sm font-semibold text-stone-800">
          Choose a structure, add source content, then refine the generated document.
        </p>
      </div>

      <div className="flex min-w-0 items-center gap-3">
        <TemplateSearchInput value={searchQuery} onChange={onSearchChange} />
        <NotificationButton />
      </div>
    </header>
  )
}

export default WorkspaceTopbar
'@

Write-ProjectFile "src\components\workspace\topbar\TemplateSearchInput.tsx" @'
type TemplateSearchInputProps = {
  value: string
  onChange: (value: string) => void
}

function TemplateSearchInput({ value, onChange }: TemplateSearchInputProps) {
  return (
    <label className="flex w-full min-w-[220px] max-w-[460px] items-center gap-3 rounded-full border border-stone-200 bg-stone-50/90 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus-within:border-stone-300 focus-within:bg-white md:w-[360px] lg:w-[440px]">
      <span className="h-2 w-2 shrink-0 rounded-full bg-stone-300" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search templates"
        className="w-full bg-transparent text-sm font-medium text-stone-700 outline-none placeholder:text-stone-400"
      />
    </label>
  )
}

export default TemplateSearchInput
'@

Write-ProjectFile "src\components\workspace\topbar\NotificationButton.tsx" @'
function NotificationButton() {
  return (
    <button
      type="button"
      aria-label="Workspace activity"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 shadow-sm transition hover:bg-white"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-stone-900" />
    </button>
  )
}

export default NotificationButton
'@

Write-ProjectFile "src\components\workspace\intro\WorkspaceIntro.tsx" @'
const steps = ['Choose template', 'Add source', 'Generate draft']

function WorkspaceIntro() {
  return (
    <section className="rounded-[36px] border border-stone-200/80 bg-white px-6 py-7 shadow-[0_18px_60px_rgba(28,25,23,0.06)] md:px-8 md:py-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-500">
            Document workspace
          </p>

          <h2 className="mt-2 max-w-[740px] text-[40px] font-semibold leading-[1.05] tracking-[-0.035em] text-stone-950 md:text-[48px]">
            Create a professional document from a clear guided flow.
          </h2>

          <p className="mt-4 max-w-[680px] text-base leading-7 text-stone-500">
            Start with a template, provide your notes or source files, and open
            the result in an editable AI-assisted document workspace.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 lg:w-[430px]">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[20px] border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-stone-400">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-semibold text-stone-900">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkspaceIntro
'@

Write-ProjectFile "src\index.css" @'
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
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.75), transparent 32%),
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
Write-Host "Step 29.5 files updated successfully." -ForegroundColor Green
Write-Host "Backups saved in: $BackupRoot" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor Yellow

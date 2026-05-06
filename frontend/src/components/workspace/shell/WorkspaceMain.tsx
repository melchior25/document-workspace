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
    <main className="flex-1 overflow-y-auto bg-white px-6 py-6 md:px-8">
      <div className="mx-auto w-full max-w-[1360px] pb-16">
        <WorkspaceTopbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {currentStep === 'grid' && (
          <>
            <div className="mt-9">
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
          <div className="mt-9">
            <TemplatePreviewView
              template={selectedTemplate}
              onBack={handleBackToTemplates}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        )}

        {currentStep === 'input-mode' && selectedTemplate && (
          <div className="mt-9">
            <TemplateInputModeView
              template={selectedTemplate}
              onBack={handleBackToPreview}
              onSelectMode={handleInputModeSelect}
            />
          </div>
        )}

        {currentStep === 'prompt-input' && selectedTemplate && (
          <div className="mt-9">
            <PromptInputView
              template={selectedTemplate}
              onBack={handleBackToInputModes}
              onContinue={handlePromptContinue}
            />
          </div>
        )}

        {currentStep === 'document-upload' && selectedTemplate && (
          <div className="mt-9">
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
            <div className="mt-9">
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
            <div className="mt-9">
              <GenerationLoadingView
                template={selectedTemplate}
                inputMode={selectedInputMode}
              />
            </div>
          )}

        {currentStep === 'generated-document' && generatedDocument && (
          <div className="mt-9">
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
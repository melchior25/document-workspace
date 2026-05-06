import { communicationTemplates } from './communicationTemplates'
import { planningTemplates } from './planningTemplates'
import { presentationTemplates } from './presentationTemplates'
import { reportsTemplates } from './reportsTemplates'
import { studyTeachingTemplates } from './studyTeachingTemplates'
import { summariesTemplates } from './summariesTemplates'
import type { TemplateItem } from './template.types'

export const templateList: TemplateItem[] = [
  ...reportsTemplates,
  ...planningTemplates,
  ...summariesTemplates,
  ...communicationTemplates,
  ...studyTeachingTemplates,
  ...presentationTemplates,
]
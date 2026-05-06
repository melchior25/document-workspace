export type TemplateCategory =
  | 'planning'
  | 'reports'
  | 'summaries'
  | 'communication'
  | 'study-teaching'
  | 'presentations'

export type TemplatePreviewKey =
  | 'general-report'
  | 'progress-report'
  | 'status-update'
  | 'observation-report'
  | 'weekly-report'
  | 'monthly-report'
  | 'incident-report'
  | 'meeting-notes'
  | 'student-report'
  | 'student-progress-report'
  | 'general-plan'
  | 'project-plan'
  | 'weekly-plan'
  | 'monthly-plan'
  | 'study-plan'
  | 'annual-plan'
  | 'meeting-summary'
  | 'lesson-summary'
  | 'book-summary'
  | 'research-summary'
  | 'report-summary'
  | 'communication-plan'
  | 'email-draft'
  | 'announcement'
  | 'internal-memo'
  | 'client-communication'
  | 'lesson-plan'
  | 'class-notes'
  | 'worksheet'
  | 'study-guide'
  | 'assignment'
  | 'minimal-presentation'
  | 'business-presentation'
  | 'education-presentation'
  | 'pitch-deck'
  | 'report-presentation'

export type TemplateItem = {
  id: string
  title: string
  description: string
  category: TemplateCategory
  previewKey: TemplatePreviewKey
}
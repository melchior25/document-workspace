const templateGenerationProfiles = {
  reports: {
    tone: "formal, structured and professional",
    sections: [
      "Executive Summary",
      "Key Findings",
      "Details and Observations",
      "Recommendations",
      "Next Steps",
    ],
  },
  planning: {
    tone: "clear, practical and action-oriented",
    sections: [
      "Purpose",
      "Goals",
      "Phases",
      "Timeline",
      "Tasks and Responsibilities",
      "Next Steps",
    ],
  },
  summaries: {
    tone: "concise, clear and easy to understand",
    sections: [
      "Overview",
      "Key Points",
      "Important Details",
      "Conclusion",
      "Follow-up Actions",
    ],
  },
  communication: {
    tone: "polished, direct and audience-aware",
    sections: [
      "Purpose",
      "Audience",
      "Message",
      "Key Details",
      "Call to Action",
    ],
  },
  "study-teaching": {
    tone: "educational, structured and learner-friendly",
    sections: [
      "Learning Goal",
      "Lesson/Study Overview",
      "Main Content",
      "Activities",
      "Assessment or Reflection",
    ],
  },
  presentations: {
    tone: "clear, visual and presentation-ready",
    sections: [
      "Opening",
      "Main Message",
      "Supporting Points",
      "Conclusion",
      "Presentation Notes",
    ],
  },
};

const templateSubtypeProfiles = {
  "general-report": {
    purpose:
      "Create a balanced professional report that explains context, findings, conclusions and recommendations.",
    sections: [
      "Executive Summary",
      "Background",
      "Key Findings",
      "Analysis",
      "Recommendations",
      "Next Steps",
    ],
    rules: [
      "Make it suitable for formal documentation.",
      "Keep the structure balanced between explanation and recommendations.",
      "Use objective professional language.",
    ],
  },

  "progress-report": {
    purpose:
      "Create a progress-focused report that tracks work completed, current status, blockers and next actions.",
    sections: [
      "Progress Overview",
      "Completed Work",
      "Current Status",
      "Challenges or Blockers",
      "Next Actions",
      "Timeline Outlook",
    ],
    rules: [
      "Clearly separate completed work from upcoming work.",
      "Mention blockers or risks where relevant.",
      "Make progress measurable and easy to review.",
    ],
  },

  "status-update": {
    purpose:
      "Create a concise status update that quickly communicates what changed, what is active and what needs attention.",
    sections: [
      "Current Status",
      "Recent Updates",
      "Priorities",
      "Risks or Concerns",
      "Immediate Next Steps",
    ],
    rules: [
      "Keep it concise and scan-friendly.",
      "Prioritize clarity over long explanation.",
      "Make it suitable for quick review by leadership or team members.",
    ],
  },

  "observation-report": {
    purpose:
      "Create an observation report that records what was seen, patterns noticed and professional conclusions.",
    sections: [
      "Observation Context",
      "Observed Details",
      "Patterns Noted",
      "Interpretation",
      "Recommendations",
    ],
    rules: [
      "Separate observation from interpretation.",
      "Avoid unsupported conclusions.",
      "Use careful professional wording.",
    ],
  },

  "weekly-report": {
    purpose:
      "Create a weekly report that summarizes progress, activities, challenges and upcoming priorities.",
    sections: [
      "Week Overview",
      "Activities Completed",
      "Progress Made",
      "Challenges",
      "Priorities for Next Week",
    ],
    rules: [
      "Keep the timeframe clearly weekly.",
      "Use practical language.",
      "Make next-week priorities clear.",
    ],
  },

  "monthly-report": {
    purpose:
      "Create a monthly report that presents highlights, outcomes, performance and follow-up priorities.",
    sections: [
      "Monthly Overview",
      "Key Highlights",
      "Performance and Outcomes",
      "Issues or Risks",
      "Recommendations",
      "Next Month Priorities",
    ],
    rules: [
      "Focus on the full month, not daily detail.",
      "Use a broader management-level perspective.",
      "Include useful follow-up priorities.",
    ],
  },

  "incident-report": {
    purpose:
      "Create an incident report that documents what happened, who/what was involved, impact, response and prevention steps.",
    sections: [
      "Incident Summary",
      "Date, Time and Location",
      "People or Assets Involved",
      "Description of Incident",
      "Actions Taken",
      "Impact",
      "Corrective Measures",
    ],
    rules: [
      "Use neutral factual language.",
      "Avoid blame-focused wording.",
      "Clearly separate incident facts from corrective measures.",
    ],
  },

  "meeting-notes": {
    purpose:
      "Create meeting notes that capture agenda items, discussion points, decisions and action items.",
    sections: [
      "Meeting Overview",
      "Agenda Items",
      "Discussion Summary",
      "Decisions Made",
      "Action Items",
      "Follow-up",
    ],
    rules: [
      "Make decisions and action items easy to find.",
      "Use concise meeting-note style.",
      "Include owners and deadlines if provided by the user.",
    ],
  },

  "student-report": {
    purpose:
      "Create a student report that summarizes performance, behavior, development and teacher remarks.",
    sections: [
      "Student Overview",
      "Academic Performance",
      "Class Participation",
      "Strengths",
      "Areas for Improvement",
      "Teacher Remarks",
    ],
    rules: [
      "Use supportive professional language.",
      "Be clear but constructive.",
      "Avoid harsh or judgmental wording.",
    ],
  },

  "student-progress-report": {
    purpose:
      "Create a student progress report focused on growth, skill development, challenges and next learning goals.",
    sections: [
      "Progress Overview",
      "Skills Developed",
      "Current Challenges",
      "Strengths",
      "Support Needed",
      "Next Learning Goals",
    ],
    rules: [
      "Focus on development over time.",
      "Use growth-oriented language.",
      "Make support needs and next goals clear.",
    ],
  },

  "general-plan": {
    purpose:
      "Create a flexible plan with goals, steps, timeline and expected outcomes.",
    sections: [
      "Plan Overview",
      "Objectives",
      "Action Steps",
      "Timeline",
      "Resources Needed",
      "Expected Outcomes",
    ],
    rules: [
      "Make the plan practical and easy to execute.",
      "Use clear action language.",
      "Include resources and outcomes where relevant.",
    ],
  },

  "project-plan": {
    purpose:
      "Create a project plan that defines scope, objectives, milestones, responsibilities and risks.",
    sections: [
      "Project Overview",
      "Objectives",
      "Scope",
      "Milestones",
      "Roles and Responsibilities",
      "Risks",
      "Next Steps",
    ],
    rules: [
      "Make responsibilities and milestones clear.",
      "Include realistic project structure.",
      "Avoid vague project goals.",
    ],
  },

  "weekly-plan": {
    purpose:
      "Create a weekly plan that organizes goals, tasks, schedule and review moments.",
    sections: [
      "Weekly Focus",
      "Goals for the Week",
      "Task Breakdown",
      "Schedule",
      "Resources",
      "Review Moment",
    ],
    rules: [
      "Keep the plan usable within one week.",
      "Make tasks concrete.",
      "Include a review or check-in moment.",
    ],
  },

  "monthly-plan": {
    purpose:
      "Create a monthly plan with focus areas, phases, deadlines and expected results.",
    sections: [
      "Monthly Focus",
      "Main Objectives",
      "Weekly Breakdown",
      "Important Deadlines",
      "Resources Needed",
      "Expected Results",
    ],
    rules: [
      "Use a month-level structure.",
      "Break the month into manageable parts.",
      "Make deadlines and expected results clear.",
    ],
  },

  "study-plan": {
    purpose:
      "Create a study plan that organizes topics, revision blocks, practice activities and progress checks.",
    sections: [
      "Study Goal",
      "Topics to Cover",
      "Study Schedule",
      "Practice Activities",
      "Progress Checks",
      "Revision Notes",
    ],
    rules: [
      "Make the plan learner-friendly.",
      "Include repetition and review.",
      "Keep study tasks realistic.",
    ],
  },

  "annual-plan": {
    purpose:
      "Create an annual plan that maps long-term goals, phases, major activities and review moments.",
    sections: [
      "Annual Overview",
      "Long-Term Goals",
      "Quarterly Phases",
      "Major Activities",
      "Resources",
      "Evaluation Moments",
    ],
    rules: [
      "Use a long-term structure.",
      "Organize by phases or quarters where useful.",
      "Include review/evaluation moments.",
    ],
  },

  "meeting-summary": {
    purpose:
      "Create a concise summary of a meeting with key discussion points, decisions and follow-up actions.",
    sections: [
      "Meeting Overview",
      "Key Discussion Points",
      "Decisions",
      "Action Items",
      "Follow-up",
    ],
    rules: [
      "Keep the summary concise.",
      "Make decisions and action items clear.",
      "Avoid unnecessary meeting transcript detail.",
    ],
  },

  "lesson-summary": {
    purpose:
      "Create a lesson summary that explains what was taught, student activity, outcomes and next steps.",
    sections: [
      "Lesson Overview",
      "Topics Covered",
      "Student Activities",
      "Learning Outcomes",
      "Next Steps",
    ],
    rules: [
      "Make it useful for teaching records.",
      "Keep learner activities visible.",
      "Include next steps or follow-up learning.",
    ],
  },

  "book-summary": {
    purpose:
      "Create a book summary with main ideas, themes, important points and reflection.",
    sections: [
      "Book Overview",
      "Main Ideas",
      "Key Themes",
      "Important Points",
      "Reflection",
    ],
    rules: [
      "Avoid retelling everything chapter by chapter unless requested.",
      "Focus on core ideas and meaning.",
      "Keep it easy to study or review.",
    ],
  },

  "research-summary": {
    purpose:
      "Create a research summary that condenses topic, method, findings and implications.",
    sections: [
      "Research Overview",
      "Purpose",
      "Method or Approach",
      "Key Findings",
      "Implications",
      "Conclusion",
    ],
    rules: [
      "Use precise wording.",
      "Separate findings from implications.",
      "Avoid overstating conclusions.",
    ],
  },

  "report-summary": {
    purpose:
      "Create a concise summary of a longer report with key findings, conclusions and recommendations.",
    sections: [
      "Report Overview",
      "Key Findings",
      "Main Conclusions",
      "Recommendations",
      "Follow-up Actions",
    ],
    rules: [
      "Condense without losing important meaning.",
      "Focus on decision-useful information.",
      "Keep it clear and executive-friendly.",
    ],
  },

  "communication-plan": {
    purpose:
      "Create a communication plan that defines audience, message, channels, timing and responsibilities.",
    sections: [
      "Communication Objective",
      "Target Audience",
      "Key Message",
      "Channels",
      "Timing",
      "Responsibilities",
    ],
    rules: [
      "Make audience and message clear.",
      "Include channels and timing.",
      "Make the plan practical to execute.",
    ],
  },

  "email-draft": {
    purpose:
      "Create a polished email draft with clear purpose, professional tone and direct next step.",
    sections: [
      "Subject Line",
      "Greeting",
      "Opening",
      "Main Message",
      "Call to Action",
      "Closing",
    ],
    rules: [
      "Write like a real email.",
      "Keep it concise and clear.",
      "Make the next action obvious.",
    ],
  },

  "announcement": {
    purpose:
      "Create a clear announcement that communicates important information to a group.",
    sections: [
      "Announcement Title",
      "Purpose",
      "Important Details",
      "Date or Timing",
      "Required Action",
      "Closing Note",
    ],
    rules: [
      "Make the main message visible early.",
      "Use clear public-facing wording.",
      "Avoid overly long explanations.",
    ],
  },

  "internal-memo": {
    purpose:
      "Create an internal memo with purpose, background, details and required action.",
    sections: [
      "Memo Purpose",
      "Background",
      "Key Information",
      "Required Action",
      "Deadline or Follow-up",
    ],
    rules: [
      "Use internal professional tone.",
      "Make required action clear.",
      "Keep structure formal but readable.",
    ],
  },

  "client-communication": {
    purpose:
      "Create client-facing communication that is polished, clear and professional.",
    sections: [
      "Purpose",
      "Client Context",
      "Main Message",
      "Details",
      "Next Step",
      "Closing",
    ],
    rules: [
      "Use polished external-facing language.",
      "Be clear and respectful.",
      "Avoid internal-only details unless requested.",
    ],
  },

  "lesson-plan": {
    purpose:
      "Create a lesson plan with learning objectives, materials, activities, timing and assessment.",
    sections: [
      "Lesson Objective",
      "Required Materials",
      "Lesson Introduction",
      "Main Activities",
      "Practice or Assignment",
      "Assessment",
      "Closure",
    ],
    rules: [
      "Make it usable by a teacher.",
      "Include activity flow and timing where useful.",
      "Keep learning goals measurable.",
    ],
  },

  "class-notes": {
    purpose:
      "Create structured class notes that explain topics, examples and important reminders.",
    sections: [
      "Topic Overview",
      "Key Concepts",
      "Examples",
      "Important Notes",
      "Practice Questions",
      "Summary",
    ],
    rules: [
      "Make notes clear for students.",
      "Use simple explanations.",
      "Include examples where useful.",
    ],
  },

  worksheet: {
    purpose:
      "Create a worksheet with instructions, exercises, questions and reflection.",
    sections: [
      "Worksheet Instructions",
      "Exercise 1",
      "Exercise 2",
      "Challenge Task",
      "Reflection Questions",
      "Teacher Notes",
    ],
    rules: [
      "Make tasks clear and student-friendly.",
      "Use practical exercises.",
      "Include challenge or reflection when suitable.",
    ],
  },

  "study-guide": {
    purpose:
      "Create a study guide with topics, explanations, key points and practice structure.",
    sections: [
      "Study Overview",
      "Topics to Review",
      "Key Explanations",
      "Practice Tasks",
      "Revision Checklist",
      "Final Tips",
    ],
    rules: [
      "Make it useful for revision.",
      "Keep explanations clear.",
      "Include checklist-style guidance.",
    ],
  },

  assignment: {
    purpose:
      "Create an assignment with instructions, requirements, deliverables and assessment criteria.",
    sections: [
      "Assignment Overview",
      "Instructions",
      "Requirements",
      "Deliverables",
      "Assessment Criteria",
      "Submission Notes",
    ],
    rules: [
      "Make expectations clear.",
      "Include deliverables and criteria.",
      "Use student-friendly but formal wording.",
    ],
  },

  "minimal-presentation": {
    purpose:
      "Create a minimal presentation structure with clear message, supporting points and speaker notes.",
    sections: [
      "Opening Slide",
      "Main Idea",
      "Supporting Points",
      "Visual Flow",
      "Closing Slide",
      "Speaker Notes",
    ],
    rules: [
      "Keep content concise.",
      "Make slide flow clear.",
      "Avoid dense paragraphs.",
    ],
  },

  "business-presentation": {
    purpose:
      "Create a business presentation with problem, solution, strategy, evidence and recommendation.",
    sections: [
      "Opening",
      "Problem or Opportunity",
      "Strategy",
      "Supporting Evidence",
      "Recommendation",
      "Closing",
    ],
    rules: [
      "Use business-ready language.",
      "Make the argument clear.",
      "Include decision-focused wording.",
    ],
  },

  "education-presentation": {
    purpose:
      "Create an education presentation with learning objective, explanation, examples and recap.",
    sections: [
      "Learning Objective",
      "Topic Introduction",
      "Main Explanation",
      "Examples",
      "Student Activity",
      "Recap",
    ],
    rules: [
      "Make it classroom-friendly.",
      "Keep explanations clear and paced.",
      "Include activity or recap where useful.",
    ],
  },

  "pitch-deck": {
    purpose:
      "Create a pitch deck with problem, solution, value, plan and call to action.",
    sections: [
      "Problem",
      "Solution",
      "Value Proposition",
      "Plan",
      "Impact",
      "Call to Action",
    ],
    rules: [
      "Make it persuasive but grounded.",
      "Use concise slide-ready wording.",
      "Focus on value and clarity.",
    ],
  },

  "report-presentation": {
    purpose:
      "Create a report-based presentation that turns report content into slide-ready sections.",
    sections: [
      "Report Overview",
      "Key Findings",
      "Visual Highlights",
      "Recommendations",
      "Next Steps",
      "Speaker Notes",
    ],
    rules: [
      "Translate report content into presentation flow.",
      "Keep sections concise.",
      "Use speaker-note style detail where useful.",
    ],
  },
};

function getTemplateGenerationProfile(category) {
  return (
    templateGenerationProfiles[category] || {
      tone: "professional, clear and structured",
      sections: [
        "Overview",
        "Main Content",
        "Details",
        "Conclusion",
        "Next Steps",
      ],
    }
  );
}

function getTemplateSubtypeProfile(templateId) {
  return templateSubtypeProfiles[templateId] || null;
}

module.exports = {
  getTemplateGenerationProfile,
  getTemplateSubtypeProfile,
};
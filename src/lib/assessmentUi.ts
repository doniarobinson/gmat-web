import type { AssessmentSession } from "@/lib/types";

/** Submitted questions only — attempts are recorded on submit in assessment practice mode. */
export function getCompletedQuestionCount(session: AssessmentSession): number {
  return Object.keys(session.attempts).length;
}

export function shouldShowAssessmentRestart(completedQuestionCount: number): boolean {
  return completedQuestionCount > 0;
}

export function assessmentPrimaryButtonLabel(completedQuestionCount: number): string {
  return completedQuestionCount === 0 ? "Begin assessment" : "Continue assessment";
}

export function assessmentContinueIndex(completedQuestionCount: number): number {
  return completedQuestionCount;
}

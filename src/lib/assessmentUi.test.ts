import { describe, expect, it } from "vitest";
import type { AssessmentSession, Attempt } from "@/lib/types";
import {
  assessmentContinueIndex,
  assessmentPrimaryButtonLabel,
  getCompletedQuestionCount,
  shouldShowAssessmentRestart,
} from "@/lib/assessmentUi";

function sampleAttempt(questionId: string): Attempt {
  return {
    questionId,
    answeredAt: 1,
    selectedIndex: 0,
    correct: true,
    timeMs: 1000,
    hintsUsed: 0,
    testedConceptShown: false,
    confidence: null,
    errorType: null,
  };
}

function sampleSession(overrides: Partial<AssessmentSession> = {}): AssessmentSession {
  return {
    id: "assessment_test",
    startedAt: 100,
    finishedAt: null,
    blueprintVersion: "assessment-v1",
    questionIds: ["q1", "q2", "q3"],
    attempts: {},
    ...overrides,
  };
}

describe("getCompletedQuestionCount", () => {
  it("returns 0 when there are no attempts", () => {
    expect(getCompletedQuestionCount(sampleSession())).toBe(0);
  });

  it("returns the number of submitted attempts", () => {
    const session = sampleSession({
      attempts: {
        q1: sampleAttempt("q1"),
        q2: sampleAttempt("q2"),
      },
    });
    expect(getCompletedQuestionCount(session)).toBe(2);
  });
});

describe("shouldShowAssessmentRestart", () => {
  it("is false before the user has submitted any question", () => {
    expect(shouldShowAssessmentRestart(0)).toBe(false);
  });

  it("is true after at least one question is completed", () => {
    expect(shouldShowAssessmentRestart(1)).toBe(true);
    expect(shouldShowAssessmentRestart(5)).toBe(true);
  });
});

describe("assessmentPrimaryButtonLabel", () => {
  it('shows "Begin assessment" when nothing is completed', () => {
    expect(assessmentPrimaryButtonLabel(0)).toBe("Begin assessment");
  });

  it('shows "Continue assessment" after progress', () => {
    expect(assessmentPrimaryButtonLabel(1)).toBe("Continue assessment");
  });
});

describe("assessmentContinueIndex", () => {
  it("matches the next practice question index", () => {
    expect(assessmentContinueIndex(0)).toBe(0);
    expect(assessmentContinueIndex(3)).toBe(3);
  });
});

"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/layout/Card";
import { Button, Shell } from "@/components/layout/UtilityAtoms";
import {
  assessmentContinueIndex,
  assessmentPrimaryButtonLabel,
  getCompletedQuestionCount,
  shouldShowAssessmentRestart,
} from "@/lib/assessmentUi";
import { assessmentBlueprint, generateQuestion } from "@/lib/generate";
import {
  loadAssessment,
  loadQuestions,
  saveAssessment,
  saveQuestions,
} from "@/lib/storage";
import type { AssessmentSession, GeneratedQuestion } from "@/lib/types";
import { useRouter } from "next/navigation";

function newAssessment(): AssessmentSession {
  return {
    id: `assessment_${Date.now()}`,
    startedAt: Date.now(),
    finishedAt: null,
    blueprintVersion: "assessment-v1",
    questionIds: [],
    attempts: {},
  };
}

export default function AssessmentPage() {
  const router = useRouter();
  const [session, setSession] = useState<AssessmentSession | null>(null);

  const questionsById = useMemo(() => loadQuestions(), []);

  useEffect(() => {
    const existing = loadAssessment();
    if (existing && existing.questionIds.length > 0) {
      setSession(existing);
      return;
    }
    const s = newAssessment();
    const specs = assessmentBlueprint();
    const generated: Record<string, GeneratedQuestion> = { ...questionsById };
    const ids: string[] = [];
    for (const spec of specs) {
      const q = generateQuestion(spec);
      generated[q.id] = q;
      ids.push(q.id);
    }
    s.questionIds = ids;
    saveQuestions(generated);
    saveAssessment(s);
    setSession(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session) {
    return (
      <Shell>
        <AppHeader />
        <PageHero title="Assessment" />
        <p className="mt-8 text-sm text-muted">Preparing your assessment…</p>
      </Shell>
    );
  }

  const completedQuestionCount = getCompletedQuestionCount(session);
  const total = session.questionIds.length;

  return (
    <Shell>
      <AppHeader />
      <PageHero
        title="Take Assessment"
        secondaryAction={{ label: "View results", href: "/assessment/results" }}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Blueprint</div>
          <p className="mt-2 text-sm text-muted">30 questions total:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
            <li>10 Quant</li>
            <li>10 Verbal</li>
            <li>10 Data Insights</li>
          </ul>
          <div className="mt-4 text-sm">
            Progress: <span className="font-semibold">{completedQuestionCount}</span> / {total}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() =>
                router.push(
                  `/practice?mode=assessment&idx=${assessmentContinueIndex(completedQuestionCount)}`,
                )
              }
            >
              {assessmentPrimaryButtonLabel(completedQuestionCount)}
            </Button>
            {shouldShowAssessmentRestart(completedQuestionCount) ? (
              <Button
                variant="secondary"
                onClick={() => {
                  // restart assessment session by generating a fresh one
                  const s = newAssessment();
                  const specs = assessmentBlueprint();
                  const generated: Record<string, GeneratedQuestion> = {};
                  const ids: string[] = [];
                  for (const spec of specs) {
                    const q = generateQuestion(spec);
                    generated[q.id] = q;
                    ids.push(q.id);
                  }
                  s.questionIds = ids;
                  saveQuestions(generated);
                  saveAssessment(s);
                  setSession(s);
                }}
              >
                Restart
              </Button>
            ) : null}
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">How it works</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li>Questions are generated on-demand and stored for review.</li>
            <li>
              After you submit, review the solution and reveal “Tested concept”
              if desired.
            </li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

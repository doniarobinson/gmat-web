"use client";

import { useEffect, useMemo, useState } from "react";
import { HomeHeader } from "@/components/HomeHeader";
import { Card } from "@/components/Card";
import { Button, Shell } from "@/components/Atoms";
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
        <HomeHeader />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Assessment</h1>
        </div>
        <p className="mt-6 text-sm text-muted">Preparing your assessment…</p>
      </Shell>
    );
  }

  const done = Object.keys(session.attempts).length;
  const total = session.questionIds.length;

  return (
    <Shell>
      <HomeHeader />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Assessment</h1>
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={() => {
            router.push("/results");
          }}
        >
          View results
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Blueprint</div>
          <div className="mt-2 text-sm text-muted">
            30 questions total: 10 Quant, 10 Verbal, 10 Data Insights.
          </div>
          <div className="mt-4 text-sm">
            Progress: <span className="font-semibold">{done}</span> / {total}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={() =>
                router.push(`/practice?mode=assessment&idx=${done}`)
              }
            >
              {done === 0 ? "Begin assessment" : "Continue assessment"}
            </Button>
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
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">How it works</div>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Questions are generated on-demand and stored for review.</li>
            <li>
              • After you submit, review the solution and reveal “Tested
              concept” if desired.
            </li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}

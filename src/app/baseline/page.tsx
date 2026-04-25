"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, Shell, TopNav } from "@/components/ui";
import { baselineBlueprint, generateQuestion } from "@/lib/generate";
import { loadBaseline, loadQuestions, saveBaseline, saveQuestions } from "@/lib/storage";
import type { BaselineSession, GeneratedQuestion } from "@/lib/types";
import { useRouter } from "next/navigation";

function newBaseline(): BaselineSession {
  return {
    id: `baseline_${Date.now()}`,
    startedAt: Date.now(),
    finishedAt: null,
    blueprintVersion: "baseline-v1",
    questionIds: [],
    attempts: {},
  };
}

export default function BaselinePage() {
  const router = useRouter();
  const [session, setSession] = useState<BaselineSession | null>(null);

  const questionsById = useMemo(() => loadQuestions(), []);

  useEffect(() => {
    const existing = loadBaseline();
    if (existing && existing.questionIds.length > 0) {
      setSession(existing);
      return;
    }
    const s = newBaseline();
    const specs = baselineBlueprint();
    const generated: Record<string, GeneratedQuestion> = { ...questionsById };
    const ids: string[] = [];
    for (const spec of specs) {
      const q = generateQuestion(spec);
      generated[q.id] = q;
      ids.push(q.id);
    }
    s.questionIds = ids;
    saveQuestions(generated);
    saveBaseline(s);
    setSession(s);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session) {
    return (
      <Shell>
        <TopNav title="Baseline mini-exam" />
        <div className="mt-6 text-sm text-muted">Preparing your baseline…</div>
      </Shell>
    );
  }

  const done = Object.keys(session.attempts).length;
  const total = session.questionIds.length;

  return (
    <Shell>
      <TopNav
        title="Baseline mini-exam"
        right={
          <Button
            variant="secondary"
            onClick={() => {
              router.push("/results");
            }}
          >
            View results
          </Button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
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
              onClick={() => router.push(`/practice?mode=baseline&idx=${done}`)}
            >
              {done === 0 ? "Start baseline" : "Continue baseline"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // restart baseline session by generating a fresh one
                const s = newBaseline();
                const specs = baselineBlueprint();
                const generated: Record<string, GeneratedQuestion> = {};
                const ids: string[] = [];
                for (const spec of specs) {
                  const q = generateQuestion(spec);
                  generated[q.id] = q;
                  ids.push(q.id);
                }
                s.questionIds = ids;
                saveQuestions(generated);
                saveBaseline(s);
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
            <li>• After each question, you’ll see optional guided help.</li>
            <li>• “Tested concept” is always available, hidden by default.</li>
          </ul>
        </Card>
      </div>
    </Shell>
  );
}


"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Card } from "@/components/Card";
import { Button, Shell } from "@/components/Atoms";
import { loadAssessment, loadQuestions } from "@/lib/storage";
import type { GeneratedQuestion, Section } from "@/lib/types";

function scoreSection(
  section: Section,
  questions: Record<string, GeneratedQuestion>,
  attempts: Record<string, { correct: boolean }>,
) {
  const ids = Object.keys(questions).filter((id) => questions[id]!.section === section);
  let correct = 0;
  let attempted = 0;
  for (const id of ids) {
    const a = attempts[id];
    if (!a) continue;
    attempted++;
    if (a.correct) correct++;
  }
  return { correct, attempted, total: ids.length };
}

export default function ResultsPage() {
  const assessment = useMemo(() => loadAssessment(), []);
  const questions = useMemo(() => loadQuestions(), []);

  if (!assessment || assessment.questionIds.length === 0) {
    return (
      <Shell>
        <TopNav title="Results" />
        <div className="mt-6 text-sm text-muted">
          No assessment found. Start with the{" "}
          <Link className="text-white underline" href="/assessment">
            assessment
          </Link>
          .
        </div>
      </Shell>
    );
  }

  const attempts = assessment.attempts;
  const quant = scoreSection("Quant", questions, attempts);
  const verbal = scoreSection("Verbal", questions, attempts);
  const di = scoreSection("DataInsights", questions, attempts);

  return (
    <Shell>
      <TopNav
        title="Assessment results"
        right={
          <Link href="/plan">
            <Button>Generate study plan</Button>
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <div className="text-sm text-muted">Quant</div>
          <div className="mt-2 text-2xl font-semibold">
            {quant.correct}/{quant.attempted || 0}
          </div>
          <div className="mt-2 text-sm text-muted">
            Attempted {quant.attempted} of {quant.total}
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[rgb(var(--quant))]"
              style={{
                width: `${quant.attempted ? (quant.correct / quant.attempted) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted">Verbal</div>
          <div className="mt-2 text-2xl font-semibold">
            {verbal.correct}/{verbal.attempted || 0}
          </div>
          <div className="mt-2 text-sm text-muted">
            Attempted {verbal.attempted} of {verbal.total}
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[rgb(var(--verbal))]"
              style={{
                width: `${verbal.attempted ? (verbal.correct / verbal.attempted) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>
        <Card>
          <div className="text-sm text-muted">Data Insights</div>
          <div className="mt-2 text-2xl font-semibold">
            {di.correct}/{di.attempted || 0}
          </div>
          <div className="mt-2 text-sm text-muted">
            Attempted {di.attempted} of {di.total}
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[rgb(var(--di))]"
              style={{
                width: `${di.attempted ? (di.correct / di.attempted) * 100 : 0}%`,
              }}
            />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Next steps</div>
          <div className="mt-2 text-sm text-muted">
            This is a v1 diagnostic. Next we’ll translate misses into a topic-based
            plan and guided practice queue.
          </div>
          <div className="mt-4 flex gap-2">
            <Link href="/plan">
              <Button>Go to study plan</Button>
            </Link>
            <Link href="/practice">
              <Button variant="secondary">Practice now</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Review assessment questions</div>
          <div className="mt-2 text-sm text-muted">
            Continue the assessment or redo missed questions (coming next).
          </div>
          <div className="mt-4">
            <Link href="/assessment">
              <Button variant="secondary">Back to assessment</Button>
            </Link>
          </div>
        </Card>
      </div>
    </Shell>
  );
}


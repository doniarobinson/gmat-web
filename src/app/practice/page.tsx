"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Question } from "@/components/Question";
import { TopNav } from "@/components/TopNav";
import { Card } from "@/components/Card";
import { Button, Shell, cx } from "@/components/Atoms";
import { generateQuestion } from "@/lib/generate";
import {
  loadBaseline,
  loadProfile,
  loadQuestions,
  saveBaseline,
  upsertQuestion,
} from "@/lib/storage";
import type { Attempt, GeneratedQuestion } from "@/lib/types";

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <TopNav title="Practice" />
          <div className="mt-6 text-sm text-muted">Loading…</div>
        </Shell>
      }
    >
      <PracticeInner />
    </Suspense>
  );
}

function PracticeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("mode") ?? "practice";
  const idxParam = params.get("idx");

  const profile = useMemo(() => loadProfile(), []);
  const testedHiddenDefault = profile?.ui.testedConceptDefaultHidden ?? true;

  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [testedShown, setTestedShown] = useState(!testedHiddenDefault);
  const [confidence, setConfidence] = useState<Attempt["confidence"]>(null);
  const [errorType, setErrorType] = useState<Attempt["errorType"]>(null);

  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const all = loadQuestions();
    if (mode === "baseline") {
      const baseline = loadBaseline();
      const idx = idxParam ? Number(idxParam) : 0;
      const qid = baseline?.questionIds?.[idx];
      if (qid && all[qid]) {
        setQuestion(all[qid]!);
        return;
      }
    }
    // free practice: generate new
    const seed = Math.floor(Date.now() / 1000);
    const q = generateQuestion({
      seed,
      section: Math.random() < 0.34 ? "Quant" : Math.random() < 0.5 ? "Verbal" : "DataInsights",
      type: "QuantMCQ",
      topicPrimary: "Mixed",
    });
    upsertQuestion(q);
    setQuestion(q);
  }, [idxParam, mode]);

  if (!question) {
    return (
      <Shell>
        <TopNav title="Practice" />
        <div className="mt-6 text-sm text-muted">Loading question…</div>
      </Shell>
    );
  }

  function onSubmit() {
    if (submitted) return;
    if (!question) return;
    const correct = selected === question.correctIndex;
    setSubmitted(true);

    // persist attempt in baseline mode
    if (mode === "baseline") {
      const baseline = loadBaseline();
      if (baseline) {
        const timeMs = Date.now() - startRef.current;
        baseline.attempts[question.id] = {
          questionId: question.id,
          answeredAt: Date.now(),
          selectedIndex: selected,
          correct,
          timeMs,
          hintsUsed: 0,
          testedConceptShown: testedShown,
          confidence,
          errorType,
        };
        saveBaseline(baseline);
      }
    }
  }

  function nextBaseline() {
    const baseline = loadBaseline();
    if (!baseline) return router.push("/baseline");
    const done = Object.keys(baseline.attempts).length;
    if (done >= baseline.questionIds.length) {
      baseline.finishedAt = Date.now();
      saveBaseline(baseline);
      router.push("/results");
      return;
    }
    router.push(`/practice?mode=baseline&idx=${done}`);
  }

  return (
    <Shell>
      <TopNav
        title={mode === "baseline" ? "Baseline — Question" : "Practice"}
        right={
          mode === "baseline" ? (
            <Button variant="secondary" onClick={() => router.push("/baseline")}>
              Back
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => router.push("/plan")}>
              Study plan
            </Button>
          )
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_360px]">
        <Question
          question={question}
          selected={selected}
          onSelect={setSelected}
          submitted={submitted}
          testedShown={testedShown}
          onToggleTestedShown={() => setTestedShown((s) => !s)}
          onSubmit={onSubmit}
          afterSubmitAction={
            mode === "baseline" ? (
              <Button onClick={nextBaseline}>Next</Button>
            ) : (
              <Button
                onClick={() => {
                  router.replace("/practice");
                }}
              >
                New question
              </Button>
            )
          }
        />

        <Card>
          <div className="text-sm font-semibold">Review tags</div>
          <div className="mt-1 text-sm text-muted">
            Optional metadata to improve your plan.
          </div>

          <div className="mt-4">
            <div className="text-sm text-muted">Confidence</div>
            <div className="mt-2 flex gap-2">
              {(["low", "med", "high"] as const).map((v) => (
                <button
                  key={v}
                  className={cx(
                    "rounded-full border px-3 py-1 text-sm hover:bg-white/5",
                    confidence === v && "border-white/30 bg-white/5",
                  )}
                  onClick={() => setConfidence(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-muted">If you missed it, why?</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                ["concept_gap", "Concept gap"],
                ["algebra", "Algebra"],
                ["time", "Time"],
                ["careless", "Careless"],
                ["misread", "Misread"],
                ["other", "Other"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  className={cx(
                    "rounded-full border px-3 py-1 text-sm hover:bg-white/5",
                    errorType === k && "border-white/30 bg-white/5",
                  )}
                  onClick={() => setErrorType(k as Attempt["errorType"])}
                >
                  {label}
                </button>
              ))}
              <button
                className="rounded-full border px-3 py-1 text-sm text-muted hover:bg-white/5 hover:text-white"
                onClick={() => setErrorType(null)}
              >
                Clear
              </button>
            </div>
          </div>

        </Card>
      </div>
    </Shell>
  );
}

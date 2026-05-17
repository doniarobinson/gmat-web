"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Question } from "@/components/content/Question";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Card } from "@/components/layout/Card";
import { Button, Shell, cx } from "@/components/layout/UtilityAtoms";
import { generateQuestion } from "@/lib/generate";
import {
  loadAssessment,
  loadProfile,
  loadQuestions,
  saveAssessment,
  upsertQuestion,
} from "@/lib/storage";
import type { Attempt, GeneratedQuestion } from "@/lib/types";

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <Shell>
          <AppHeader />
          <PageHero title="Practice" />
          <div className="mt-8 text-sm text-muted">Loading…</div>
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
    if (mode === "assessment") {
      const assessment = loadAssessment();
      const idx = idxParam ? Number(idxParam) : 0;
      const qid = assessment?.questionIds?.[idx];
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
        <AppHeader />
        <PageHero title="Practice" />
        <div className="mt-8 text-sm text-muted">Loading question…</div>
      </Shell>
    );
  }

  function onSubmit() {
    if (submitted) return;
    if (!question) return;
    const correct = selected === question.correctIndex;
    setSubmitted(true);

    // persist attempt in assessment mode
    if (mode === "assessment") {
      const assessment = loadAssessment();
      if (assessment) {
        const timeMs = Date.now() - startRef.current;
        assessment.attempts[question.id] = {
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
        saveAssessment(assessment);
      }
    }
  }

  function nextAssessment() {
    const assessment = loadAssessment();
    if (!assessment) return router.push("/assessment");
    const done = Object.keys(assessment.attempts).length;
    if (done >= assessment.questionIds.length) {
      assessment.finishedAt = Date.now();
      saveAssessment(assessment);
      router.push("/assessment/results");
      return;
    }
    router.push(`/practice?mode=assessment&idx=${done}`);
  }

  return (
    <Shell>
      <AppHeader />
      <PageHero
        title={mode === "assessment" ? "Assessment — Question" : "Practice"}
        secondaryAction={
          mode === "assessment"
            ? { label: "Back", href: "/assessment" }
            : { label: "Study plan", href: "/plan" }
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-[1fr_360px]">
        <Question
          question={question}
          selected={selected}
          onSelect={setSelected}
          submitted={submitted}
          testedShown={testedShown}
          onToggleTestedShown={() => setTestedShown((s) => !s)}
          onSubmit={onSubmit}
          afterSubmitAction={
            mode === "assessment" ? (
              <Button onClick={nextAssessment}>Next</Button>
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

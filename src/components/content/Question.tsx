"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/layout/Card";
import { Button, cx } from "@/components/layout/UtilityAtoms";
import type { GeneratedQuestion } from "@/lib/types";

function sectionColorVar(section: GeneratedQuestion["section"]) {
  if (section === "Quant") return "--quant";
  if (section === "Verbal") return "--verbal";
  return "--di";
}

export type QuestionProps = {
  question: GeneratedQuestion;
  selected: number | null;
  onSelect: (index: number) => void;
  submitted: boolean;
  testedShown: boolean;
  onToggleTestedShown: () => void;
  onSubmit: () => void;
  afterSubmitAction: ReactNode;
};

export function Question({
  question,
  selected,
  onSelect,
  submitted,
  testedShown,
  onToggleTestedShown,
  onSubmit,
  afterSubmitAction,
}: QuestionProps) {
  const accent = sectionColorVar(question.section);

  return (
    <Card className="p-0">
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: `rgb(var(${accent}))` }}
          />
          <div className="text-sm text-muted">{question.section}</div>
          <div className="text-sm text-muted">•</div>
          <div className="text-sm text-muted">{question.difficulty}</div>
        </div>
        {/* <div className="text-sm text-muted">{question.type}</div> */}
      </div>

      <div className="px-5 py-5">
        <div className="whitespace-pre-wrap text-sm leading-6">{question.stem}</div>

        <div className="mt-5 space-y-2">
          {question.choices.map((c, i) => {
            const isSelected = selected === i;
            const isCorrect = submitted && i === question.correctIndex;
            const isWrong = submitted && isSelected && i !== question.correctIndex;
            return (
              <button
                key={i}
                className={cx(
                  "w-full rounded-xl border px-3 py-3 text-left text-sm transition hover:bg-white/5",
                  isSelected && "border-white/30 bg-white/5",
                  isCorrect && "border-[rgb(var(--success))] bg-[rgb(var(--success))]/10",
                  isWrong && "border-[rgb(var(--danger))] bg-[rgb(var(--danger))]/10",
                )}
                onClick={() => !submitted && onSelect(i)}
              >
                <div className="flex gap-3">
                  <div className="text-muted">{String.fromCharCode(65 + i)}.</div>
                  <div>{c}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={cx(
            "mt-5 flex items-center gap-3",
            submitted ? "justify-between" : "",
          )}
        >
          {!submitted ? (
            <Button
              onClick={onSubmit}
              disabled={selected === null}
              className={selected === null ? "opacity-50" : ""}
            >
              Submit
            </Button>
          ) : (
            <>
              {afterSubmitAction}
              <LinkRow questionId={question.id} />
            </>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="overflow-hidden rounded-xl border text-sm">
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 hover:bg-white/5"
              onClick={onToggleTestedShown}
              aria-expanded={testedShown}
            >
              <div className="font-semibold">Tested concept</div>
              <div className="text-muted">{testedShown ? "Hide" : "Show"}</div>
            </button>
            {testedShown ? (
              <div className="border-t px-3 py-3 font-semibold leading-6">
                {question.testedConceptLabel}
              </div>
            ) : null}
          </div>
        </div>
        {submitted ? (
          <div className="mt-6 border-t pt-4">
            <div className="text-sm font-semibold">Solution</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted">
              {question.solution.steps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <div className="mt-3 text-sm">{question.solution.final}</div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function LinkRow({ questionId }: { questionId: string }) {
  return (
    <div className="text-sm text-muted">
      Saved as <span className="font-mono text-white/90">{questionId}</span>
    </div>
  );
}

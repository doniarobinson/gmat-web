import { describe, expect, it } from "vitest";
import type { GeneratedQuestion } from "@/lib/types";
import { scoreSection } from "@/lib/scoreSection";

function question(id: string, section: GeneratedQuestion["section"]): GeneratedQuestion {
  return {
    id,
    createdAt: 1,
    section,
    type: "QuantMCQ",
    difficulty: "Medium",
    topicPrimary: "Quant/Core",
    stem: "stem",
    choices: ["a", "b", "c", "d"],
    correctIndex: 0,
    solution: { steps: [], final: "a" },
    testedConceptLabel: "x",
    generatorVersion: "gen-v1",
  };
}

describe("scoreSection", () => {
  it("counts only questions in the given section", () => {
    const questions = {
      q1: question("q1", "Quant"),
      v1: question("v1", "Verbal"),
    };
    const attempts = { q1: { correct: true } };

    expect(scoreSection("Quant", questions, attempts)).toEqual({
      correct: 1,
      attempted: 1,
      total: 1,
    });
  });

  it("ignores unattempted questions in totals but not in attempted count", () => {
    const questions = {
      q1: question("q1", "Quant"),
      q2: question("q2", "Quant"),
    };
    const attempts = { q1: { correct: false } };

    expect(scoreSection("Quant", questions, attempts)).toEqual({
      correct: 0,
      attempted: 1,
      total: 2,
    });
  });

  it("returns zeros when there are no questions for the section", () => {
    expect(scoreSection("Verbal", {}, {})).toEqual({
      correct: 0,
      attempted: 0,
      total: 0,
    });
  });

  it("sums correct attempts across multiple questions", () => {
    const questions = {
      q1: question("q1", "DataInsights"),
      q2: question("q2", "DataInsights"),
      q3: question("q3", "DataInsights"),
    };
    const attempts = {
      q1: { correct: true },
      q2: { correct: false },
      q3: { correct: true },
    };

    expect(scoreSection("DataInsights", questions, attempts)).toEqual({
      correct: 2,
      attempted: 3,
      total: 3,
    });
  });
});

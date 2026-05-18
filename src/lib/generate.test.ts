import { describe, expect, it } from "vitest";
import type { Difficulty, GeneratedQuestion, Section } from "@/lib/types";
import { assessmentBlueprint, generateQuestion } from "@/lib/generate";

const quantSpec = {
  seed: 999,
  section: "Quant" as const,
  type: "QuantMCQ" as const,
  topicPrimary: "Quant/Core",
};

const verbalSpec = {
  seed: 100,
  section: "Verbal" as const,
  type: "CR" as const,
  topicPrimary: "Verbal/Core",
};

const diSpec = {
  seed: 200,
  section: "DataInsights" as const,
  type: "DI_Table" as const,
  topicPrimary: "DI/Core",
};

const VALID_DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

function findSeed(
  section: "Quant" | "Verbal" | "DataInsights",
  type: GeneratedQuestion["type"],
  testedConceptLabel: string,
): number {
  for (let seed = 0; seed < 5000; seed++) {
    const q = generateQuestion({
      seed,
      section,
      type,
      topicPrimary: "test",
    });
    if (q.testedConceptLabel === testedConceptLabel) return seed;
  }
  throw new Error(`no seed produced ${testedConceptLabel}`);
}

function findQuantPercentSeed() {
  return findSeed("Quant", "QuantMCQ", "Percent change");
}

function findQuantLinearSeed() {
  return findSeed("Quant", "QuantMCQ", "Solving a linear equation");
}

function findDIPercentSeed() {
  return findSeed("DataInsights", "DI_Table", "Percent of total");
}

function expectValidMcq(q: GeneratedQuestion) {
  expect(q.correctIndex).toBeGreaterThanOrEqual(0);
  expect(q.correctIndex).toBeLessThan(q.choices.length);
  expect(q.correctIndex).not.toBe(-1);
  expect(new Set(q.choices).size).toBe(q.choices.length);
}

describe("generateQuestion", () => {
  it("is deterministic for the same spec", () => {
    const a = generateQuestion(quantSpec);
    const b = generateQuestion(quantSpec);
    expect(b.id).toBe(a.id);
    expect(b.choices).toEqual(a.choices);
    expect(b.correctIndex).toBe(a.correctIndex);
  });

  it("puts correctIndex in range", () => {
    const q = generateQuestion(quantSpec);
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(q.choices.length);
  });

  it("produces at least four choices for Quant MCQ", () => {
    expect(generateQuestion(quantSpec).choices.length).toBeGreaterThanOrEqual(4);
  });

  it("marks a valid correctIndex and unique choices for Quant, Verbal, and DI", () => {
    expectValidMcq(generateQuestion(quantSpec));
    expectValidMcq(generateQuestion(verbalSpec));
    expectValidMcq(generateQuestion(diSpec));
  });

  it("uses a valid difficulty for Quant, Verbal, and DI", () => {
    for (const spec of [quantSpec, verbalSpec, diSpec]) {
      expect(VALID_DIFFICULTIES).toContain(generateQuestion(spec).difficulty);
    }
  });

  it("percent template: correct choice matches percent math", () => {
    const seed = findQuantPercentSeed();
    const q = generateQuestion({
      seed,
      section: "Quant",
      type: "QuantMCQ",
      topicPrimary: "test",
    });
    const stem = q.stem;
    const baseMatch = stem.match(/value of (\d+)/);
    const pctMatch = stem.match(/(\d+)%/);
    const change = stem.includes("increase") ? "increase" : "decrease";
    expect(baseMatch).not.toBeNull();
    expect(pctMatch).not.toBeNull();

    const base = Number(baseMatch![1]);
    const pct = Number(pctMatch![1]);
    const expected =
      change === "increase"
        ? Number((base * (1 + pct / 100)).toFixed(2))
        : Number((base * (1 - pct / 100)).toFixed(2));

    expect(q.choices[q.correctIndex]).toBe(String(expected));
  });

  it("linear template: correct choice matches solving for x", () => {
    const seed = findQuantLinearSeed();
    const q = generateQuestion({
      seed,
      section: "Quant",
      type: "QuantMCQ",
      topicPrimary: "test",
    });
    const match = q.stem.match(/If (\d+)x \+ (\d+) = (\d+), what is the value of x\?/);
    expect(match).not.toBeNull();

    const a = Number(match![1]);
    const b = Number(match![2]);
    const c = Number(match![3]);
    const x = (c - b) / a;

    expect(q.choices[q.correctIndex]).toBe(String(x));
  });

  it("DI table template: correct choice matches percent of total for A", () => {
    const seed = findDIPercentSeed();
    const q = generateQuestion({
      seed,
      section: "DataInsights",
      type: "DI_Table",
      topicPrimary: "test",
    });
    const match = q.stem.match(/A = (\d+), B = (\d+)/);
    expect(match).not.toBeNull();

    const a = Number(match![1]);
    const b = Number(match![2]);
    const expected = `${Math.round((a / (a + b)) * 100)}%`;

    expect(q.choices[q.correctIndex]).toBe(expected);
  });

  it("generates Verbal and Data Insights questions", () => {
    const verbal = generateQuestion(verbalSpec);
    const di = generateQuestion(diSpec);
    expect(verbal.section).toBe("Verbal");
    expect(di.section).toBe("DataInsights");
    expect(verbal.correctIndex).toBeLessThan(verbal.choices.length);
    expect(di.correctIndex).toBeLessThan(di.choices.length);
  });
});

describe("assessmentBlueprint", () => {
  it("returns 30 specs", () => {
    expect(assessmentBlueprint()).toHaveLength(30);
  });

  it("includes 10 per section", () => {
    const specs = assessmentBlueprint();
    expect(specs.filter((s) => s.section === "Quant")).toHaveLength(10);
    expect(specs.filter((s) => s.section === "Verbal")).toHaveLength(10);
    expect(specs.filter((s) => s.section === "DataInsights")).toHaveLength(10);
  });

  it("pairs each section with the expected question type", () => {
    const typeBySection = {
      Quant: "QuantMCQ",
      Verbal: "CR",
      DataInsights: "DI_Table",
    } as const;

    for (const spec of assessmentBlueprint()) {
      expect(spec.type).toBe(typeBySection[spec.section]);
    }
  });

  it("uses only known sections", () => {
    const known: Section[] = ["Quant", "Verbal", "DataInsights"];
    for (const spec of assessmentBlueprint()) {
      expect(known).toContain(spec.section);
    }
  });
});

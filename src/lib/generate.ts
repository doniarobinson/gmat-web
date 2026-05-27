import type {
  Difficulty,
  GeneratedQuestion,
  QuestionType,
  Section,
} from "@/lib/types";
import { mulberry32, pickOne, shuffle } from "@/lib/random";

const GEN_VERSION = "gen-v1";

function id(prefix: string, seed: number) {
  return `${prefix}_${seed}_${Math.floor(seed * 9973)}`;
}

function difficultyFromRng(r: number): Difficulty {
  if (r < 0.35) return "Easy";
  if (r < 0.8) return "Medium";
  return "Hard";
}

type Spec = {
  seed: number;
  section: Section;
  type: QuestionType;
  topicPrimary: string;
};

export function generateQuestion(spec: Spec): GeneratedQuestion {
  const rng = mulberry32(spec.seed);
  const difficulty = difficultyFromRng(rng());

  if (spec.section === "Quant") {
    return generateQuant({ ...spec, difficulty, rng });
  }
  if (spec.section === "Verbal") {
    return generateVerbal({ ...spec, difficulty, rng });
  }
  return generateDI({ ...spec, difficulty, rng });
}

function generateQuant(input: Spec & { rng: () => number; difficulty: Difficulty }): GeneratedQuestion {
  const { rng, difficulty } = input;
  const topic = input.topicPrimary;

  // v1 templates: arithmetic / algebra / rates
  const template = pickOne(rng, ["percent", "linear", "rates"] as const);

  if (template === "percent") {
    const base = 40 + Math.floor(rng() * 61); // 40..100
    const pct = pickOne(rng, [5, 8, 10, 12, 15, 20, 25, 30]);
    const change = rng() < 0.5 ? "increase" : "decrease";
    const correct =
      change === "increase"
        ? base * (1 + pct / 100)
        : base * (1 - pct / 100);
    const rounded = Number(correct.toFixed(2));
    const distractors = shuffle(rng, [
      base * (1 + pct / 100),
      base * (1 - pct / 100),
      base + pct,
      base - pct,
      base * (pct / 100),
    ])
      .map((x) => Number(x.toFixed(2)))
      .filter((x) => x !== rounded)
      .slice(0, 4);
    const choices = shuffle(rng, [rounded, ...distractors]).map(String);
    const correctIndex = choices.indexOf(String(rounded));

    return {
      id: id("q", input.seed),
      createdAt: Date.now(),
      section: "Quant",
      type: "QuantMCQ",
      difficulty,
      topicPrimary: topic || "Quant/Arithmetic/Percent",
      stem: `A value of ${base} is ${change === "increase" ? "increased" : "decreased"} by ${pct}%. What is the new value?`,
      choices,
      correctIndex,
      testedConceptLabel: "Percent change",
      solution: {
        steps: [
          `A ${pct}% ${change} means multiply by ${change === "increase" ? `1 + ${pct}/100` : `1 - ${pct}/100`}.`,
          `${base} × ${change === "increase" ? (1 + pct / 100).toFixed(2) : (1 - pct / 100).toFixed(2)} = ${rounded}.`,
        ],
        final: `The new value is ${rounded}.`,
      },
      generatorVersion: GEN_VERSION,
    };
  }

  if (template === "linear") {
    const a = pickOne(rng, [2, 3, 4, 5, 6, 7, 8, 9]);
    const x = 2 + Math.floor(rng() * 10);
    const b = 1 + Math.floor(rng() * 20);
    const c = a * x + b;
    const choices = shuffle(rng, [x, x + 1, x - 1, x + 2, x - 2]).map(String);
    const correctIndex = choices.indexOf(String(x));
    return {
      id: id("q", input.seed),
      createdAt: Date.now(),
      section: "Quant",
      type: "QuantMCQ",
      difficulty,
      topicPrimary: topic || "Quant/Algebra/Linear",
      stem: `If ${a}x + ${b} = ${c}, what is the value of x?`,
      choices,
      correctIndex,
      testedConceptLabel: "Solving a linear equation",
      solution: {
        steps: [
          `Subtract ${b} from both sides: ${a}x = ${c - b}.`,
          `Divide by ${a}: x = ${(c - b) / a}.`,
        ],
        final: `x = ${x}.`,
      },
      generatorVersion: GEN_VERSION,
    };
  }

  // rates
  const d = pickOne(rng, [60, 90, 120, 150, 180, 210]);
  const speed = pickOne(rng, [30, 35, 40, 45, 50, 55, 60]);
  const time = d / speed;
  const choices = shuffle(rng, [
    time,
    time + 0.5,
    time - 0.5,
    time + 1,
    time - 1,
  ]).map((t) => `${t} hours`);
  const correctIndex = choices.indexOf(`${time} hours`);
  return {
    id: id("q", input.seed),
    createdAt: Date.now(),
    section: "Quant",
    type: "QuantMCQ",
    difficulty,
    topicPrimary: topic || "Quant/WordProblems/Rates",
    stem: `A car travels ${d} miles at a constant speed of ${speed} miles per hour. How long does the trip take?`,
    choices,
    correctIndex,
    testedConceptLabel: "Rate = distance ÷ time",
    solution: {
      steps: [`Time = distance ÷ speed = ${d} ÷ ${speed} = ${time}.`],
      final: `The trip takes ${time} hours.`,
    },
    generatorVersion: GEN_VERSION,
  };
}

function generateVerbal(input: Spec & { rng: () => number; difficulty: Difficulty }): GeneratedQuestion {
  const { rng, difficulty } = input;
  const prompt = pickOne(rng, [
    "A recent study claims that employees who work remotely are more productive because they report higher job satisfaction.",
    "The city plans to reduce traffic by increasing bus frequency, arguing that more buses will cause more commuters to switch from cars.",
    "A company concludes that a new training program is effective because participants scored higher on a test after completing it.",
  ]);
  const qStem =
    "Which of the following, if true, most seriously weakens the argument?";

  const correct = pickOne(rng, [
    "The test used to measure productivity relies on self-reported estimates rather than objective output.",
    "Many commuters who would take the bus live in areas not served by existing bus routes.",
    "The post-training test was easier than the pre-training test.",
  ]);
  const wrongs = shuffle(rng, [
    "Some employees prefer working in an office environment.",
    "Buses are generally safer than cars on a per-mile basis.",
    "The study surveyed employees across multiple industries.",
    "The city’s buses are equipped with Wi‑Fi.",
    "The training program included interactive exercises.",
  ]).slice(0, 4);

  const choices = shuffle(rng, [correct, ...wrongs]);
  const correctIndex = choices.indexOf(correct);

  return {
    id: id("v", input.seed),
    createdAt: Date.now(),
    section: "Verbal",
    type: "CR",
    difficulty,
    topicPrimary: input.topicPrimary || "Verbal/CR/Weaken",
    stem: `${prompt}\n\n${qStem}`,
    choices,
    correctIndex,
    testedConceptLabel: "Critical Reasoning: weaken the argument",
    solution: {
      steps: [
        "Identify the conclusion and the key assumption linking evidence to conclusion.",
        "A weakening choice attacks that assumption or introduces an alternative explanation.",
        `Choice ${String.fromCharCode(65 + correctIndex)} best undermines the reasoning.`,
      ],
      final: "The correct answer is the choice that most directly breaks the argument’s logic.",
    },
    generatorVersion: GEN_VERSION,
  };
}

function generateDI(input: Spec & { rng: () => number; difficulty: Difficulty }): GeneratedQuestion {
  const { rng, difficulty } = input;
  const a = 10 + Math.floor(rng() * 40);
  const b = 10 + Math.floor(rng() * 40);
  const total = a + b;
  const correct = `${Math.round((a / total) * 100)}%`;
  const choices = shuffle(rng, [
    correct,
    `${Math.round((b / total) * 100)}%`,
    `${Math.round((a / total) * 90)}%`,
    `${Math.round((a / total) * 110)}%`,
    `${Math.round((a / total) * 70)}%`,
  ]);
  const correctIndex = choices.indexOf(correct);
  return {
    id: id("d", input.seed),
    createdAt: Date.now(),
    section: "DataInsights",
    type: "DI_Table",
    difficulty,
    topicPrimary: input.topicPrimary || "DI/Table/PercentOfTotal",
    stem: `A table shows two categories with counts: A = ${a}, B = ${b}. What percent of the total is category A?`,
    choices,
    correctIndex,
    testedConceptLabel: "Percent of total",
    solution: {
      steps: [
        `Total = ${a} + ${b} = ${total}.`,
        `Percent(A) = ${a}/${total} × 100 ≈ ${correct}.`,
      ],
      final: `Category A is about ${correct} of the total.`,
    },
    generatorVersion: GEN_VERSION,
  };
}

export function assessmentBlueprint(): Array<Spec> {
  const seedBase = Math.floor(Date.now() / 1000);
  const specs: Spec[] = [];

  // Quant (10)
  for (let i = 0; i < 10; i++) {
    specs.push({
      seed: seedBase + i * 11,
      section: "Quant",
      type: "QuantMCQ",
      topicPrimary: "Quant/Core",
    });
  }

  // Verbal (10)
  for (let i = 0; i < 10; i++) {
    specs.push({
      seed: seedBase + 200 + i * 13,
      section: "Verbal",
      type: "CR",
      topicPrimary: "Verbal/Core",
    });
  }

  // Data Insights (10)
  for (let i = 0; i < 10; i++) {
    specs.push({
      seed: seedBase + 400 + i * 17,
      section: "DataInsights",
      type: "DI_Table",
      topicPrimary: "DI/Core",
    });
  }

  return specs;
}


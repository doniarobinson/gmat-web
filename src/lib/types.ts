export type Section = "Quant" | "Verbal" | "DataInsights";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type QuestionType =
  | "QuantMCQ"
  | "CR"
  | "RC"
  | "DI_Table"
  | "DI_Graph"
  | "DI_TwoPart"
  | "DI_MSR";

export type TopicId = string;

export type GeneratedQuestion = {
  id: string;
  createdAt: number;
  section: Section;
  type: QuestionType;
  difficulty: Difficulty;
  topicPrimary: TopicId;
  topicSecondary?: TopicId[];

  stem: string;
  choices: string[];
  correctIndex: number;

  solution: {
    steps: string[];
    final: string;
  };

  testedConceptLabel: string;
  generatorVersion: string;
};

export type Attempt = {
  questionId: string;
  answeredAt: number;
  selectedIndex: number | null;
  correct: boolean;
  timeMs: number;
  hintsUsed: number;
  testedConceptShown: boolean;
  confidence: "low" | "med" | "high" | null;
  errorType:
    | "concept_gap"
    | "algebra"
    | "time"
    | "careless"
    | "misread"
    | "other"
    | null;
};

export type AssessmentSession = {
  id: string;
  startedAt: number;
  finishedAt: number | null;
  blueprintVersion: string;
  questionIds: string[];
  attempts: Record<string, Attempt>;
};

export type UserProfile = {
  createdAt: number;
  targetDate: string | null; // yyyy-mm-dd
  minutesPerDay: number;
  daysPerWeek: number;
  targetScore: number | null;
  ui: {
    testedConceptDefaultHidden: boolean;
  };
};


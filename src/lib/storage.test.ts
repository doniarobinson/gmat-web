import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AssessmentSession, GeneratedQuestion, UserProfile } from "@/lib/types";
import {
  loadAssessment,
  loadProfile,
  loadQuestions,
  resetAll,
  saveAssessment,
  saveProfile,
  saveQuestions,
  upsertQuestion,
} from "@/lib/storage";

function sampleProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    createdAt: 1,
    targetDate: "2026-06-01",
    minutesPerDay: 45,
    daysPerWeek: 5,
    targetScore: 655,
    ui: { testedConceptDefaultHidden: true },
    ...overrides,
  };
}

function sampleQuestion(id: string): GeneratedQuestion {
  return {
    id,
    createdAt: 1,
    section: "Quant",
    type: "QuantMCQ",
    difficulty: "Medium",
    topicPrimary: "Quant/Core",
    stem: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    correctIndex: 1,
    solution: { steps: ["Add."], final: "4" },
    testedConceptLabel: "Arithmetic",
    generatorVersion: "gen-v1",
  };
}

function sampleAssessment(overrides: Partial<AssessmentSession> = {}): AssessmentSession {
  return {
    id: "assessment_test",
    startedAt: 100,
    finishedAt: null,
    blueprintVersion: "assessment-v1",
    questionIds: ["q1", "q2"],
    attempts: {},
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SSR / non-browser", () => {
  it("returns safe defaults when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    expect(loadProfile()).toBeNull();
    expect(loadQuestions()).toEqual({});
    expect(loadAssessment()).toBeNull();
  });

  it("does not persist when window is undefined", () => {
    vi.stubGlobal("window", undefined);
    saveProfile(sampleProfile());
    vi.unstubAllGlobals();
    expect(loadProfile()).toBeNull();
  });
});

describe("corrupt JSON", () => {
  it("returns null for a corrupt profile", () => {
    localStorage.setItem("gmat:profile:v1", "{not-json");
    expect(loadProfile()).toBeNull();
  });

  it("returns an empty object for corrupt questions", () => {
    localStorage.setItem("gmat:questions:v1", "{not-json");
    expect(loadQuestions()).toEqual({});
  });

  it("returns null for a corrupt assessment", () => {
    localStorage.setItem("gmat:assessment:v1", "{not-json");
    expect(loadAssessment()).toBeNull();
  });
});

describe("legacy assessment migration", () => {
  it("migrates gmat:baseline:v1 to gmat:assessment:v1 on read", () => {
    const session = sampleAssessment();
    localStorage.setItem("gmat:baseline:v1", JSON.stringify(session));

    expect(loadAssessment()).toEqual(session);
    expect(localStorage.getItem("gmat:baseline:v1")).toBeNull();
    expect(localStorage.getItem("gmat:assessment:v1")).toBe(JSON.stringify(session));
  });
});

describe("round-trip", () => {
  it("saves and loads a profile", () => {
    const profile = sampleProfile();
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });

  it("saves and loads questions", () => {
    const map = { q1: sampleQuestion("q1"), q2: sampleQuestion("q2") };
    saveQuestions(map);
    expect(loadQuestions()).toEqual(map);
  });

  it("saves and loads an assessment session", () => {
    const session = sampleAssessment({ finishedAt: 200 });
    saveAssessment(session);
    expect(loadAssessment()).toEqual(session);
  });
});

describe("upsertQuestion", () => {
  it("adds a question to the stored map", () => {
    const q = sampleQuestion("q_new");
    upsertQuestion(q);
    expect(loadQuestions()).toEqual({ q_new: q });
  });

  it("overwrites an existing question with the same id", () => {
    upsertQuestion(sampleQuestion("q1"));
    const updated = sampleQuestion("q1");
    updated.stem = "Updated stem";
    upsertQuestion(updated);
    expect(loadQuestions().q1?.stem).toBe("Updated stem");
  });
});

describe("resetAll", () => {
  it("clears profile, questions, and assessment keys", () => {
    saveProfile(sampleProfile());
    saveQuestions({ q1: sampleQuestion("q1") });
    saveAssessment(sampleAssessment());
    localStorage.setItem("gmat:baseline:v1", "{}");

    resetAll();

    expect(loadProfile()).toBeNull();
    expect(loadQuestions()).toEqual({});
    expect(loadAssessment()).toBeNull();
    expect(localStorage.getItem("gmat:baseline:v1")).toBeNull();
  });
});

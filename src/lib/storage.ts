import type { AssessmentSession, GeneratedQuestion, UserProfile } from "@/lib/types";

const KEY = {
  profile: "gmat:profile:v1",
  questions: "gmat:questions:v1",
  assessment: "gmat:assessment:v1",
};

/** @deprecated migrated to KEY.assessment on read */
const LEGACY_KEY_ASSESSMENT = "gmat:baseline:v1";

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadProfile(): UserProfile | null {
  if (!isBrowser()) return null;
  return safeJsonParse<UserProfile>(localStorage.getItem(KEY.profile));
}

export function saveProfile(profile: UserProfile) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY.profile, JSON.stringify(profile));
}

export function loadQuestions(): Record<string, GeneratedQuestion> {
  if (!isBrowser()) return {};
  return safeJsonParse<Record<string, GeneratedQuestion>>(
    localStorage.getItem(KEY.questions),
  ) ?? {};
}

export function saveQuestions(map: Record<string, GeneratedQuestion>) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY.questions, JSON.stringify(map));
}

export function upsertQuestion(q: GeneratedQuestion) {
  const map = loadQuestions();
  map[q.id] = q;
  saveQuestions(map);
}

export function loadAssessment(): AssessmentSession | null {
  if (!isBrowser()) return null;
  let raw = localStorage.getItem(KEY.assessment);
  if (!raw) {
    const legacy = localStorage.getItem(LEGACY_KEY_ASSESSMENT);
    if (legacy) {
      localStorage.setItem(KEY.assessment, legacy);
      localStorage.removeItem(LEGACY_KEY_ASSESSMENT);
      raw = legacy;
    }
  }
  return safeJsonParse<AssessmentSession>(raw);
}

export function saveAssessment(session: AssessmentSession) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY.assessment, JSON.stringify(session));
}

export function resetAll() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY.profile);
  localStorage.removeItem(KEY.questions);
  localStorage.removeItem(KEY.assessment);
  localStorage.removeItem(LEGACY_KEY_ASSESSMENT);
}

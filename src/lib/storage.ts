import type { BaselineSession, GeneratedQuestion, UserProfile } from "@/lib/types";

const KEY = {
  profile: "gmat:profile:v1",
  questions: "gmat:questions:v1",
  baseline: "gmat:baseline:v1",
};

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

export function loadBaseline(): BaselineSession | null {
  if (!isBrowser()) return null;
  return safeJsonParse<BaselineSession>(localStorage.getItem(KEY.baseline));
}

export function saveBaseline(session: BaselineSession) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY.baseline, JSON.stringify(session));
}

export function resetAll() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY.profile);
  localStorage.removeItem(KEY.questions);
  localStorage.removeItem(KEY.baseline);
}


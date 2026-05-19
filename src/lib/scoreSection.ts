import type { GeneratedQuestion, Section } from "@/lib/types";

export function scoreSection(
  section: Section,
  questions: Record<string, GeneratedQuestion>,
  attempts: Record<string, { correct: boolean }>,
) {
  const ids = Object.keys(questions).filter((id) => questions[id]!.section === section);
  let correct = 0;
  let attempted = 0;
  for (const id of ids) {
    const a = attempts[id];
    if (!a) continue;
    attempted++;
    if (a.correct) correct++;
  }
  return { correct, attempted, total: ids.length };
}

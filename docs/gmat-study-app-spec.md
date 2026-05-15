# GMAT Study App (On-demand, personalized) — One-page product spec

## Summary
A web app that helps users study for the **GMAT Focus** (Quant, Verbal, Data Insights) by running a **baseline mini-exam**, estimating strengths/weaknesses by topic, and generating an adaptive **study plan** with **guided practice**. Questions are generated **on-demand per user session** from structured specs and validated for correctness and quality.

## Target user + goal
- **User**: GMAT test-taker who wants a clear plan and high-quality practice.
- **Goal**: Improve score efficiently via personalized practice and review.

## Core user flows
- **Onboarding**
  - Select test date (or “not set”), availability (mins/day), target score (optional)
  - Start baseline mini-exam
- **Baseline mini-exam → Diagnostics**
  - 30-question diagnostic (10 Quant, 10 Verbal, 10 Data Insights)
  - Results: section performance, top weak topics, speed vs accuracy flags
- **Study plan**
  - Weekly schedule + “Today’s session” queue (20–60 min)
  - Mix of targeted drills, mixed review, timed sets, and redo queue
- **Guided practice**
  - Attempt question → optional hint ladder → submit → review
  - “Tested concept” is **always present but hidden** (user can unhide)
  - Errors tagged and scheduled for spaced review
- **Checkpoint loop**
  - Every 1–2 weeks: short reassessment quiz → plan updates

## Hint ladder (planned; not in current UI)
The shipped practice screen does **not** expose progressive hints yet; `Attempt.hintsUsed` in the data model is reserved for baseline analytics and future UI.

**Target behavior (product):**
- After starting an attempt, the user can optionally open a **hint ladder**: small nudge → broader strategy → stronger steer, **without** revealing the correct letter/choice until submit (unless a later tier explicitly does, per question design).
- Each tier revealed increments `hintsUsed`; enforce a **per-question cap** so the ladder cannot be infinitely long.
- Baseline and practice alike record `hintsUsed` for speed-vs-accuracy and “needed help” signals.

## Question generation (no admin UI)
- **On-demand generation** driven by `QuestionSpec`:
  - Inputs: user skill estimates, plan needs, desired section/type/topic/difficulty
- **Generators**
  - Quant: parameterized templates (provable single correct answer)
  - Verbal: structured prompt generation + consistency checks
  - Data Insights: synthetic dataset/table/graph + question(s)
- **Validators (must-pass)**
  - correctness (Quant/DI recomputed)
  - single-correct-option
  - style/clarity rules + time sanity
  - dedupe vs recent user history
- Persist each served question for review and reproducibility.

## Baseline exam blueprint (v1)
- **Quant (10)**: arithmetic/algebra core mix + 2 word problems + 2 stats/counting rotation
- **Verbal (10)**: 6 CR + 1 RC passage with 4 questions
- **Data Insights (10)**: graph/table (4) + two-part (3) + multi-source set (3)

## Personalization logic (v1)
Maintain `mastery` + `uncertainty` per topic. Next-question selection optimizes:

\[
need = importance \times (1 - mastery) \times uncertainty
\]

Subject to:
- interleaving constraints
- periodic mixed review
- limited introduction of brand-new subtopics

## Key screens (MVP)
- Landing / Sign-in
- Onboarding
- Baseline Exam (with timer + progress)
- Results Dashboard (section + topic breakdown)
- Study Plan (weekly + today queue)
- Practice Player (question, hint ladder, reveal tested concept, solution review)
- Review / Redo Queue (missed/guessed/timeouts)

## Data model (minimum)
- `User`
- `Topic` (taxonomy tree)
- `GeneratedQuestion` (spec, seed, rendered content, solution, testedConcept, generatorVersion, validationReport)
- `Attempt` (answer, correct, time, hintsUsed, testedConceptShown, confidence, errorType)
- `SkillEstimate` (userId, topicId, mastery, uncertainty, updatedAt)
- `StudyPlan` + `PlanItem` (scheduled tasks)

## Success metrics
- Baseline completion rate
- Weekly active days
- Accuracy + time improvements per topic
- Reduction in repeat error types
- Retention (week 1 → week 4)

## Open decisions (next)
- Support full-length simulated exams in v1 or v2?
- Timing strictness in practice mode (off / soft / hard)?
- Initial Quant template set (coverage vs speed-to-ship)?

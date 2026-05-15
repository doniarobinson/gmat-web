# GMAT study app (`gmat-web`)

A **GMAT Focus** study web app: run a short **baseline diagnostic**, see where you stand by section and topic, and work through **personalized practice** with questions generated **on demand** for each session.

Built with **Next.js** (App Router).

## What it does

The app helps test-takers prepare for the **GMAT Focus** exam (Quant, Verbal, and Data Insights) with a clear path from diagnosis to daily practice—not a static question bank.

1. **Onboarding** — Set test date (optional), study time per day, and optional target score.
2. **Baseline mini-exam** — 30-question diagnostic (10 per section) to estimate strengths, weak topics, and speed vs. accuracy.
3. **Results** — Section and topic breakdown after the baseline.
4. **Study plan** — Weekly view and a “today” queue of drills, review, and timed work (planned in the product spec; UI routes exist for plan and practice).
5. **Guided practice** — On-demand questions from structured specs, with optional hints, solutions, and a “tested concept” you can reveal after attempting.

Question content is meant to be **generated per session** (Quant templates, Verbal prompts, Data Insights datasets) and validated for a single correct answer before you see it. Served questions can be stored locally for review and redo (see `src/lib/storage.ts`, `src/lib/generate.ts`).

For the full product vision, data model, and roadmap, see `[docs/gmat-study-app-spec.md](docs/gmat-study-app-spec.md)`.

## Who it’s for

Anyone studying for the **GMAT Focus** who wants a structured plan and adaptive-style practice rather than only browsing fixed sets.

## Run locally

From this directory (`apps/gmat-web`):

```bash
npm install
npm run dev:stable
```

Then open [http://localhost:3000](http://localhost:3000). Use **Get started** → onboarding, or jump to **Baseline**, **Study plan**, or **Practice** from the home page.

`dev:stable` is the default dev command for this app: hot reload on port 3000, localhost only, Turbopack off. Prefer it over `npm run dev` on macOS if you hit dev-server or CSS issues.

**If something still misbehaves**

| Command | When to use it |
| --- | --- |
| `npm run dev` | Standard Next.js dev (Turbopack on) |
| `npm run dev:poll` | File changes not detected (iCloud, external drives) |
| `npm run build && npm run start` | Production build locally (no hot reload) |
| `npm run lint` | ESLint |

## Project layout


| Path              | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| `src/app/`        | Pages: home, onboarding, baseline, plan, practice, results   |
| `src/lib/`        | Question generation, types, local session storage            |
| `src/components/` | Shared UI                                                    |
| `docs/`           | Product spec, UI style guide, PDF render script for the spec |


UI conventions: `[docs/UI_STYLE_GUIDE.md](docs/UI_STYLE_GUIDE.md)`.

## Status

This repo is an **MVP scaffold** aligned with the spec above: core routes and on-demand question generation are in place; some flows (e.g. full adaptive plan engine, checkpoint reassessments) are described in the spec and may be partial or evolving.
import Link from "next/link";
import { HomeHeader } from "@/components/HomeHeader";

function Card({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="surface2 block rounded-[14px] border p-5 transition hover:-translate-y-[1px] hover:border-white/20"
    >
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-muted">{description}</div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1040px] px-6 py-10">
        <HomeHeader />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              <span className="block">GMAT Focus Exam</span>
              <span className="mt-2 block">Study Plan & Guided Practice</span>
            </h1>
            <p className="mt-3 max-w-[70ch] text-muted">
              Start with a short assessment to see where you stand. You&apos;ll
              get a personalized study plan, then practice with fresh questions
              each session. After every answer, review the full solution.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="shrink-0 rounded-xl bg-[rgb(var(--primary))] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-0"
          >
            Set your study goals
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            title="Take Assessment"
            description="30 questions"
            href="/assessment"
          />
          <Card
            title="View Study Plan"
            description="Weekly schedule"
            href="/plan"
          />
          <Card
            title="Start Practice"
            description="On-demand questions, solutions & review"
            href="/practice"
          />
        </div>
      </div>
    </main>
  );
}

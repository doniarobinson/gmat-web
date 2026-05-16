import Link from "next/link";

function Card({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="surface2 rounded-[14px] border p-5">
      {cta ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Link
            href={href}
            className="block min-w-0 flex-1 transition hover:-translate-y-[1px]"
          >
            <div className="text-lg font-semibold tracking-tight">{title}</div>
            <div className="mt-2 text-sm text-muted">{description}</div>
          </Link>
          <Link
            href={cta.href}
            className="inline-flex w-fit shrink-0 items-center justify-center self-end rounded-xl bg-[rgb(var(--primary))] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-0 sm:self-auto"
          >
            {cta.label}
          </Link>
        </div>
      ) : (
        <Link href={href} className="block transition hover:-translate-y-[1px]">
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <div className="mt-2 text-sm text-muted">{description}</div>
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1040px] px-6 py-10">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="block">GMAT Focus Exam</span>
            <span className="mt-2 block">Study Plan & Guided Practice</span>
          </h1>
          <p className="mt-3 max-w-[70ch] text-muted">
            Start with a short baseline mini-exam to see where you stand.
            You&apos;ll get a personalized study plan, then practice with fresh
            questions each session. After every answer, review the full
            solution.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            title="Baseline mini-exam"
            description="30 questions • diagnostic"
            href="/baseline"
            cta={{ label: "Get started", href: "/onboarding" }}
          />
          <Card
            title="Study plan"
            description="Weekly schedule • today’s queue"
            href="/plan"
          />
          <Card
            title="Practice"
            description="On-demand questions • solutions & review"
            href="/practice"
          />
        </div>
      </div>
    </main>
  );
}

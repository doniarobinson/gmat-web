import Link from "next/link";

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
      <div className="text-sm text-muted">{description}</div>
      <div className="mt-2 text-lg font-semibold tracking-tight">{title}</div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1040px] px-6 py-10">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="text-sm text-muted">GMAT Focus</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Premium Study Plan + Guided Practice
            </h1>
            <p className="mt-3 max-w-[70ch] text-muted">
              Take a short baseline mini-exam, then follow a personalized plan.
              Questions are generated on-demand per session and include optional
              guided help.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="rounded-xl bg-[rgb(var(--primary))] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[rgb(var(--primary-hover))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-0"
          >
            Get started
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            title="Baseline mini-exam"
            description="30 questions • diagnostic"
            href="/baseline"
          />
          <Card
            title="Study plan"
            description="Weekly schedule • today’s queue"
            href="/plan"
          />
          <Card
            title="Practice"
            description="On-demand questions • hint ladder"
            href="/practice"
          />
        </div>

        <div className="mt-10 rounded-[14px] border p-5 surface">
          <div className="text-sm font-semibold">Design direction</div>
          <div className="mt-1 text-sm text-muted">
            Premium fintech aesthetic with professional section color accents:
            Quant (teal), Verbal (violet), Data Insights (amber).
          </div>
        </div>
      </div>
    </main>
  );
}


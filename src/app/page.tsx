import Link from "next/link";
import { Card } from "@/components/layout/Card";
import { AppHeader } from "@/components/layout/AppHeader";
import { PageHero } from "@/components/layout/PageHero";
import { Shell } from "@/components/layout/UtilityAtoms";

function NavCard({
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
    <Shell>
      <AppHeader />
      <PageHero
        title={
          <>
            <span className="block">GMAT Focus Exam</span>
            <span className="mt-2 block">Study Plan & Guided Practice</span>
          </>
        }
        subtitle={
          <>
            Start with a short assessment to see where you stand. You&apos;ll get
            a personalized study plan, then practice with fresh questions each
            session. After each answer, check your result and open the explanation
            when you&apos;re ready.
          </>
        }
        action={{ label: "Set your study goals", href: "/goals" }}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <NavCard
          title="Take Assessment"
          description="30 questions"
          href="/assessment"
        />
        <NavCard
          title="View Study Plan"
          description="Weekly schedule"
          href="/plan"
        />
        <NavCard
          title="Start Practice"
          description="On-demand questions, solutions & review"
          href="/practice"
        />
      </div>
    </Shell>
  );
}

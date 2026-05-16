"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TopNav } from "@/components/TopNav";
import { Card } from "@/components/Card";
import { Button, Shell } from "@/components/Atoms";
import { loadProfile } from "@/lib/storage";

export default function PlanPage() {
  const profile = useMemo(() => loadProfile(), []);

  const minutes = profile?.minutesPerDay ?? 30;
  const days = profile?.daysPerWeek ?? 5;

  const weekMinutes = minutes * days;

  return (
    <Shell>
      <TopNav
        title="Study plan"
        right={
          <Link href="/practice">
            <Button>Start today’s session</Button>
          </Link>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">This week (v1)</div>
          <div className="mt-2 text-sm text-muted">
            Based on your availability: {days} days × {minutes} min/day ≈{" "}
            {weekMinutes} minutes/week.
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div>
                <div className="font-semibold">Targeted drills</div>
                <div className="text-muted">
                  Quant fundamentals + DI percent work
                </div>
              </div>
              <div className="text-muted">~40%</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div>
                <div className="font-semibold">Mixed review</div>
                <div className="text-muted">Interleaving across sections</div>
              </div>
              <div className="text-muted">~30%</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div>
                <div className="font-semibold">Timed sets</div>
                <div className="text-muted">Pacing + stamina</div>
              </div>
              <div className="text-muted">~20%</div>
            </div>
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <div>
                <div className="font-semibold">Error log + redo</div>
                <div className="text-muted">Fix recurring mistakes</div>
              </div>
              <div className="text-muted">~10%</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Today’s queue (example)</div>
          <div className="mt-2 text-sm text-muted">
            This will become fully personalized once we compute topic mastery
            from assessment attempts.
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="rounded-xl border px-3 py-2">
              <div className="text-muted">Quant • 12 min</div>
              <div className="font-semibold">Percent change set</div>
            </div>
            <div className="rounded-xl border px-3 py-2">
              <div className="text-muted">Verbal • 10 min</div>
              <div className="font-semibold">CR weaken set</div>
            </div>
            <div className="rounded-xl border px-3 py-2">
              <div className="text-muted">Data Insights • 8 min</div>
              <div className="font-semibold">
                Percent-of-total table questions
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/practice">
              <Button>Start practice</Button>
            </Link>
          </div>
        </Card>
      </div>
    </Shell>
  );
}

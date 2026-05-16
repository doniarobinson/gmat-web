"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Select, Shell, Toggle } from "@/components/Atoms";
import { TopNav } from "@/components/TopNav";
import { loadProfile, saveProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";

function defaultProfile(): UserProfile {
  return {
    createdAt: Date.now(),
    targetDate: null,
    minutesPerDay: 30,
    daysPerWeek: 5,
    targetScore: null,
    ui: {
      testedConceptDefaultHidden: true,
    },
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const existing = useMemo(() => loadProfile(), []);
  const [profile, setProfile] = useState<UserProfile>(
    existing ?? defaultProfile(),
  );

  return (
    <Shell>
      <TopNav
        title="Onboarding"
        right={
          <Button
            variant="secondary"
            onClick={() => {
              saveProfile(profile);
              router.push("/baseline");
            }}
          >
            Save & start baseline
          </Button>
        }
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="text-sm font-semibold">Study schedule</div>
          <div className="mt-1 text-sm text-muted">
            Helps us suggest a realistic amount per day.
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm">
              <div className="text-muted">Minutes per day</div>
              <Input
                type="number"
                min={10}
                max={180}
                value={profile.minutesPerDay}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    minutesPerDay: Number(e.target.value),
                  }))
                }
              />
            </label>
            <label className="text-sm">
              <div className="text-muted">Days per week</div>
              <Select
                value={profile.daysPerWeek}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    daysPerWeek: Number(e.target.value),
                  }))
                }
              >
                {[3, 4, 5, 6, 7].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </Card>

        <Card>
          <div className="text-sm font-semibold">Goals (optional)</div>
          <div className="mt-1 text-sm text-muted">
            You can change these anytime.
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm">
              <div className="text-muted">Target test date</div>
              <Input
                type="date"
                value={profile.targetDate ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    targetDate: e.target.value ? e.target.value : null,
                  }))
                }
              />
            </label>
            <label className="text-sm">
              <div className="text-muted">Target score</div>
              <Input
                type="number"
                placeholder="e.g., 655"
                value={profile.targetScore ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    targetScore: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </label>
          </div>

          <div className="mt-5 border-t pt-4">
            <div className="text-sm font-semibold">Guidance preferences</div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white">
                  Hide “tested concept” by default
                </div>
                <p className="mt-1 text-sm text-muted">
                  You can reveal it per question.
                </p>
              </div>
              <Toggle
                checked={profile.ui.testedConceptDefaultHidden}
                aria-label='Hide "tested concept" by default'
                onChange={(hidden) =>
                  setProfile((p) => ({
                    ...p,
                    ui: { ...p.ui, testedConceptDefaultHidden: hidden },
                  }))
                }
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => {
            saveProfile(profile);
            router.push("/baseline");
          }}
        >
          Continue to baseline
        </Button>
      </div>
    </Shell>
  );
}

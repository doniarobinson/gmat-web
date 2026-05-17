"use client";

import Link from "next/link";
import { cx } from "@/components/layout/UtilityAtoms";

export type PageHeroAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

function heroActionClass(variant: "primary" | "secondary") {
  return cx(
    "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-0",
    variant === "primary"
      ? "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))]"
      : "border bg-transparent text-white hover:bg-white/5",
  );
}

function HeroAction({ label, href, onClick, variant = "primary" }: PageHeroAction) {
  const className = heroActionClass(variant);

  if (href) {
    return (
      <Link href={href} className={className}>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {label}
    </button>
  );
}

export function PageHero({
  title,
  subtitle,
  action,
  secondaryAction,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: PageHeroAction;
  secondaryAction?: PageHeroAction;
}) {
  const hasActions = action || secondaryAction;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-3 max-w-[70ch] text-sm text-muted">{subtitle}</p>
        ) : null}
      </div>
      {hasActions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {action ? <HeroAction {...action} variant={action.variant ?? "primary"} /> : null}
          {secondaryAction ? (
            <HeroAction
              {...secondaryAction}
              variant={secondaryAction.variant ?? "secondary"}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

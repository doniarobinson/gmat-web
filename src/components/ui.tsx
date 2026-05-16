import Link from "next/link";
import { forwardRef } from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1040px] px-6 py-10">{children}</div>
    </div>
  );
}

export function TopNav({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-white">
          ← Home
        </Link>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{title}</div>
      </div>
      {right}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("surface2 rounded-[14px] border p-5", className)}>
      {children}
    </div>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
  }
>(function Button({ className, variant = "primary", ...props }, ref) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]";
  const styles =
    variant === "primary"
      ? "bg-[rgb(var(--primary))] text-white hover:bg-[rgb(var(--primary-hover))]"
      : variant === "danger"
        ? "bg-[rgb(var(--danger))] text-white hover:bg-[rgb(var(--danger))]/90"
        : "border bg-transparent text-white hover:bg-white/5";
  return (
    <button ref={ref} className={cx(base, styles, className)} {...props} />
  );
});

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "surface w-full rounded-xl border px-3 py-2 text-sm text-white placeholder:text-[rgb(var(--text-faint))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]",
        props.className,
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        "surface w-full rounded-xl border px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]",
        props.className,
      )}
    />
  );
}

/**
 * iOS-style switch (Tailwind UI “with left label and description” companion).
 * Off: muted pill track, white knob on the left. On: primary track, knob on the right.
 */
export function Toggle({
  checked,
  onChange,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]",
        checked ? "bg-[rgb(var(--primary))]" : "bg-white/10",
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0",
        )}
      />
    </button>
  );
}


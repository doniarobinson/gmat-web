"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useId, useState } from "react";
import { cx } from "@/components/layout/UtilityAtoms";
import { Logo } from "@/components/layout/Logo";

const STUDY_HREF = "/plan";

const STUDY_CHILDREN = [
  { href: "/goals", label: "Your Goals" },
  { href: "/plan", label: "Our Plan" },
] as const;

const ASSESSMENT_HREF = "/assessment";

const ASSESSMENT_CHILDREN = [
  { href: "/assessment", label: "Take Assessment" },
  { href: "/assessment/results", label: "Results" },
] as const;

const AFTER_STUDY_LINKS = [{ href: "/practice", label: "Practice" }] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isStudyActive(pathname: string) {
  return STUDY_CHILDREN.some((c) => isActive(pathname, c.href));
}

function isAssessmentChildActive(
  pathname: string,
  mode: string | null,
  href: string,
) {
  if (href === "/assessment") {
    return (
      pathname === ASSESSMENT_HREF ||
      (pathname === "/practice" && mode === "assessment")
    );
  }
  return isActive(pathname, href);
}

function isAssessmentActive(pathname: string, mode: string | null) {
  return ASSESSMENT_CHILDREN.some((child) =>
    isAssessmentChildActive(pathname, mode, child.href),
  );
}

function isPracticeActive(pathname: string, mode: string | null) {
  return isActive(pathname, "/practice") && mode !== "assessment";
}

function isNavLinkActive(pathname: string, mode: string | null, href: string) {
  if (href === "/practice") return isPracticeActive(pathname, mode);
  return isActive(pathname, href);
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex min-h-11 items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active
          ? "bg-white/10 text-white"
          : "text-muted hover:bg-white/5 hover:text-white",
        className,
      )}
    >
      {label}
    </Link>
  );
}

function AssessmentNavDesktop({
  pathname,
  mode,
}: {
  pathname: string;
  mode: string | null;
}) {
  const assessmentActive = isAssessmentActive(pathname, mode);

  return (
    <div className="group/assessment relative">
      <Link
        href={ASSESSMENT_HREF}
        aria-current={assessmentActive ? "page" : undefined}
        className={cx(
          "flex min-h-0 items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-medium transition",
          assessmentActive
            ? "bg-white/10 text-white"
            : "text-muted hover:bg-white/5 hover:text-white",
        )}
      >
        Assess
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-70"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div className="absolute left-0 top-full z-50 hidden min-w-[11rem] pt-1 group-hover/assessment:block group-focus-within/assessment:block">
        <div className="surface2 rounded-xl border py-1 shadow-lg">
          {ASSESSMENT_CHILDREN.map((child) => (
            <NavLink
              key={child.label}
              href={child.href}
              label={child.label}
              active={isAssessmentChildActive(pathname, mode, child.href)}
              className="min-h-10 w-full rounded-lg px-3 py-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AssessmentNavMobile({
  pathname,
  mode,
  onNavigate,
}: {
  pathname: string;
  mode: string | null;
  onNavigate: () => void;
}) {
  const assessmentActive = isAssessmentActive(pathname, mode);

  return (
    <div className="flex flex-col gap-0.5">
      <NavLink
        href={ASSESSMENT_HREF}
        label="Assess"
        active={assessmentActive}
        onNavigate={onNavigate}
        className="w-full px-4"
      />
      {ASSESSMENT_CHILDREN.map((child) => (
        <NavLink
          key={child.label}
          href={child.href}
          label={child.label}
          active={isAssessmentChildActive(pathname, mode, child.href)}
          onNavigate={onNavigate}
          className="w-full pl-8 pr-4"
        />
      ))}
    </div>
  );
}

function StudyNavDesktop({ pathname }: { pathname: string }) {
  const studyActive = isStudyActive(pathname);

  return (
    <div className="group/plan relative">
      <Link
        href={STUDY_HREF}
        aria-current={studyActive ? "page" : undefined}
        className={cx(
          "flex min-h-0 items-center gap-1 rounded-xl px-2.5 py-1.5 text-sm font-medium transition",
          studyActive
            ? "bg-white/10 text-white"
            : "text-muted hover:bg-white/5 hover:text-white",
        )}
      >
        Plan
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-70"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
      <div className="absolute left-0 top-full z-50 hidden min-w-[11rem] pt-1 group-hover/plan:block group-focus-within/plan:block">
        <div className="surface2 rounded-xl border py-1 shadow-lg">
          {STUDY_CHILDREN.map((child) => (
            <NavLink
              key={child.href}
              href={child.href}
              label={child.label}
              active={isActive(pathname, child.href)}
              className="min-h-10 w-full rounded-lg px-3 py-2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StudyNavMobile({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  const studyActive = isStudyActive(pathname);

  return (
    <div className="flex flex-col gap-0.5">
      <NavLink
        href={STUDY_HREF}
        label="Plan"
        active={studyActive}
        onNavigate={onNavigate}
        className="w-full px-4"
      />
      {STUDY_CHILDREN.map((child) => (
        <NavLink
          key={child.href}
          href={child.href}
          label={child.label}
          active={isActive(pathname, child.href)}
          onNavigate={onNavigate}
          className="w-full pl-8 pr-4"
        />
      ))}
    </div>
  );
}

function DesktopNavLinks({
  pathname,
  mode,
}: {
  pathname: string;
  mode: string | null;
}) {
  return (
    <>
      <NavLink
        href="/"
        label="Home"
        active={isActive(pathname, "/")}
        className="min-h-0 px-2.5 py-1.5"
      />
      <AssessmentNavDesktop pathname={pathname} mode={mode} />
      <StudyNavDesktop pathname={pathname} />
      {AFTER_STUDY_LINKS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={isNavLinkActive(pathname, mode, item.href)}
          className="min-h-0 px-2.5 py-1.5"
        />
      ))}
    </>
  );
}

function MobileNavList({
  pathname,
  mode,
  onNavigate,
}: {
  pathname: string;
  mode: string | null;
  onNavigate: () => void;
}) {
  return (
    <>
      <NavLink
        href="/"
        label="Home"
        active={isActive(pathname, "/")}
        onNavigate={onNavigate}
        className="w-full px-4"
      />
      <AssessmentNavMobile
        pathname={pathname}
        mode={mode}
        onNavigate={onNavigate}
      />
      <StudyNavMobile pathname={pathname} onNavigate={onNavigate} />
      {AFTER_STUDY_LINKS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={isNavLinkActive(pathname, mode, item.href)}
          onNavigate={onNavigate}
          className="w-full px-4"
        />
      ))}
    </>
  );
}

function DesktopMenuBarFallback() {
  return (
    <nav
      className="flex w-full items-center gap-4 border-b border-white/10 pb-3"
      aria-hidden
    >
      <Logo className="shrink-0" />
      <div className="ml-auto h-8 w-40" />
    </nav>
  );
}

function DesktopMenuBarInner() {
  const pathname = usePathname();
  const mode = useSearchParams().get("mode");

  return (
    <nav
      className="flex w-full items-center gap-4 border-b border-white/10 pb-3"
      aria-label="Main navigation"
    >
      <Logo className="shrink-0" />
      <div className="ml-auto flex items-center gap-2">
        <DesktopNavLinks pathname={pathname} mode={mode} />
      </div>
    </nav>
  );
}

/** Full-width nav bar for md+ viewports. */
export function DesktopMenuBar() {
  return (
    <Suspense fallback={<DesktopMenuBarFallback />}>
      <DesktopMenuBarInner />
    </Suspense>
  );
}

function MobileMenuFallback() {
  return (
    <div
      className="inline-flex h-11 w-11 shrink-0 rounded-xl border border-white/10"
      aria-hidden
    />
  );
}

/** Hamburger + drawer for mobile only. */
function MobileMenuInner() {
  const pathname = usePathname();
  const mode = useSearchParams().get("mode");
  const panelId = useId();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-transparent text-white transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        )}
      </button>

      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60"
            aria-hidden
            onClick={close}
          />
          <nav
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="surface2 fixed inset-y-0 right-0 z-50 flex w-[min(100vw-3rem,20rem)] flex-col border-l shadow-2xl"
          >
            <div className="flex items-center justify-end border-b px-4 py-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))]"
                aria-label="Close menu"
                onClick={close}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              <MobileNavList
                pathname={pathname}
                mode={mode}
                onNavigate={close}
              />
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
}

export function MobileMenu() {
  return (
    <Suspense fallback={<MobileMenuFallback />}>
      <MobileMenuInner />
    </Suspense>
  );
}


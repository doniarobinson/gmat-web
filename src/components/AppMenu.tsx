"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { cx } from "@/components/Atoms";
import { Logo } from "@/components/Logo";

const STUDY_HREF = "/onboarding";

const STUDY_CHILDREN = [
  { href: "/onboarding", label: "Your Goals" },
  { href: "/plan", label: "Our Plan" },
] as const;

const TOP_LEVEL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/assessment", label: "Assessment" },
  { href: "/practice", label: "Practice" },
  { href: "/results", label: "Results" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isStudyActive(pathname: string) {
  return STUDY_CHILDREN.some((c) => isActive(pathname, c.href));
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

function StudyNavDesktop({ pathname }: { pathname: string }) {
  const studyActive = isStudyActive(pathname);

  return (
    <div className="group/study relative">
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
        Study
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
      <div className="absolute left-0 top-full z-50 hidden min-w-[11rem] pt-1 group-hover/study:block group-focus-within/study:block">
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
        label="Study"
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

function DesktopNavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      <NavLink
        href="/"
        label="Home"
        active={isActive(pathname, "/")}
        className="min-h-0 px-2.5 py-1.5"
      />
      <StudyNavDesktop pathname={pathname} />
      {TOP_LEVEL_LINKS.slice(1).map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={isActive(pathname, item.href)}
          className="min-h-0 px-2.5 py-1.5"
        />
      ))}
    </>
  );
}

function MobileNavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
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
      <StudyNavMobile pathname={pathname} onNavigate={onNavigate} />
      {TOP_LEVEL_LINKS.slice(1).map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          active={isActive(pathname, item.href)}
          onNavigate={onNavigate}
          className="w-full px-4"
        />
      ))}
    </>
  );
}

/** Full-width nav bar for md+ viewports. */
export function DesktopMenuBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-full items-center gap-4 border-b border-white/10 pb-3"
      aria-label="Main navigation"
    >
      <Logo className="shrink-0" />
      <div className="ml-auto flex items-center gap-2">
        <DesktopNavLinks pathname={pathname} />
      </div>
    </nav>
  );
}

/** Hamburger + drawer for mobile only. */
export function MobileMenu() {
  const pathname = usePathname();
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
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">Menu</span>
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
              <MobileNavList pathname={pathname} onNavigate={close} />
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
}

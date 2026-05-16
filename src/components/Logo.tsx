import Image from "next/image";
import Link from "next/link";
import { cx } from "@/components/Atoms";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="GMAT Focus home"
      className={cx(
        "inline-flex shrink-0 items-center rounded-lg transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--focus-ring))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--bg))]",
        className,
      )}
    >
      <Image
        src="/icon.png"
        alt=""
        width={48}
        height={48}
        sizes="(max-width: 640px) 32px, 36px"
        className="h-8 w-8 sm:h-9 sm:w-9"
        priority
      />
    </Link>
  );
}

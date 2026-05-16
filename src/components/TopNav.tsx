import Link from "next/link";

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

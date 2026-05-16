import { DesktopMenuBar, MobileMenu } from "@/components/AppMenu";

export function TopNav({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="space-y-3">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <MobileMenu />
      </div>

      <div className="hidden w-full md:block">
        <DesktopMenuBar />
      </div>

      <h1 className="hidden w-full text-2xl font-semibold tracking-tight md:block">
        {title}
      </h1>

      {right ? (
        <div className="flex w-full flex-wrap items-center justify-end gap-2">
          {right}
        </div>
      ) : null}
    </header>
  );
}

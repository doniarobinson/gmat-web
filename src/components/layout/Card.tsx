import { cx } from "@/components/layout/UtilityAtoms";

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

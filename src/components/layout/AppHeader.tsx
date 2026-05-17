"use client";

import { DesktopMenuBar, MobileMenu } from "@/components/layout/Menu";

export function AppHeader() {
  return (
    <header className="mb-8">
      <div className="flex justify-end md:hidden">
        <MobileMenu />
      </div>
      <div className="hidden w-full md:block">
        <DesktopMenuBar />
      </div>
    </header>
  );
}

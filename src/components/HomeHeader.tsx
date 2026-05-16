"use client";

import { DesktopMenuBar, MobileMenu } from "@/components/AppMenu";

export function HomeHeader() {
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

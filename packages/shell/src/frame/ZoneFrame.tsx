import type { ReactNode } from "react";

import { SiteFooter } from "../footer/SiteFooter";
import { SiteHeader } from "../header/SiteHeader";
import { AppProviders } from "../providers/AppProviders";

export function ZoneFrame({ children }: { children: ReactNode }) {
  return (
    <AppProviders>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
        <SiteFooter />
      </div>
    </AppProviders>
  );
}

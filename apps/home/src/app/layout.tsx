import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ZoneFrame } from "@monorepo/shell/frame/ZoneFrame";

import "@isaac545454/nucleus/styles.css";
import "./globals.css";
import { logServerBoot } from "../sentry.server.config";

void logServerBoot("home");

export const metadata: Metadata = {
  title: "Feira",
  description: "Anúncios, busca e ofertas do dia.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ZoneFrame>{children}</ZoneFrame>
      </body>
    </html>
  );
}

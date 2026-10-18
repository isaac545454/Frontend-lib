import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ZoneFrame } from "@monorepo/shell/frame/ZoneFrame";

import "@isaac545454/nucleus/styles.css";
import "./globals.css";
import { logServerBoot } from "../sentry.server.config";

void logServerBoot("account");

export const metadata: Metadata = {
  title: "Conta | Feira",
  description: "Entrada, cadastro e pedidos.",
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

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ZoneFrame } from "@feira/shell/frame/ZoneFrame";

import "@isaac545454/nucleus/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carrinho | Feira",
  description: "Itens escolhidos e fechamento do pedido.",
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

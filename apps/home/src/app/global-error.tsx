"use client";

import { sentryErrorSignature } from "@monorepo/observability/options";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import "./globals.css";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error, sentryErrorSignature("home"));
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <section className="rounded-md bg-white p-6">
          <h1 className="text-xl text-neutral-950">Algo deu errado</h1>
          <button
            type="button"
            className="mt-3 text-[var(--feira-link)]"
            onClick={() => {
              window.location.reload();
            }}
          >
            Tentar de novo
          </button>
        </section>
      </body>
    </html>
  );
}

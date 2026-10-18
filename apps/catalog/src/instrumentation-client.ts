import "@monorepo/observability/faro";
import * as Sentry from "@sentry/nextjs";

import { sentryRuntimeOptions } from "@monorepo/observability/options";

Sentry.init({
  ...sentryRuntimeOptions("catalog"),
  integrations: [
    Sentry.browserTracingIntegration({
      shouldCreateSpanForRequest: (url) => !url.includes("faro-collector"),
    }),
    Sentry.replayIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

Sentry.logger.info("fake client info", { zone: "catalog" });
Sentry.logger.warn("fake client warn", { zone: "catalog" });
Sentry.logger.error("fake client error", { zone: "catalog" });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

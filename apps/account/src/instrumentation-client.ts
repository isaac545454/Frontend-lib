import "@monorepo/observability/faro";
import * as Sentry from "@sentry/nextjs";

import { sentryRuntimeOptions } from "@monorepo/observability/options";

Sentry.init({
  ...sentryRuntimeOptions("account"),
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

Sentry.logger.info("fake client info", { zone: "account" });
Sentry.logger.warn("fake client warn", { zone: "account" });
Sentry.logger.error("fake client error", { zone: "account" });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

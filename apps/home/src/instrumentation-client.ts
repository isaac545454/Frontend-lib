import "@monorepo/observability/faro";
import * as Sentry from "@sentry/nextjs";

import { sentryRuntimeOptions } from "@monorepo/observability/options";

Sentry.init({
  ...sentryRuntimeOptions("home"),
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

Sentry.logger.info("fake client info", { zone: "home" });
Sentry.logger.warn("fake client warn", { zone: "home" });
Sentry.logger.error("fake client error", { zone: "home" });

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

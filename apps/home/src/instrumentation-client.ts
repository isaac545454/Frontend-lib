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
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

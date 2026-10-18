import * as Sentry from "@sentry/nextjs";

import { sentryRuntimeOptions } from "@monorepo/observability/options";

Sentry.init({
  ...sentryRuntimeOptions("cart"),
  integrations: (defaults) => [
    ...defaults,
    Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] }),
  ],
});

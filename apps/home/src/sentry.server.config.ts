import * as Sentry from "@sentry/nextjs";

import { sentryRuntimeOptions, type SentryZone } from "@monorepo/observability/options";

Sentry.init({
  ...sentryRuntimeOptions("home"),
  integrations: (defaults) => [
    ...defaults,
    Sentry.consoleLoggingIntegration({ levels: ["log", "info", "warn", "error"] }),
  ],
});

let serverLogsSent = false;

export async function logServerBoot(zone: SentryZone) {
  if (serverLogsSent) return;
  serverLogsSent = true;
  Sentry.logger.info("fake server info", { zone });
  Sentry.logger.warn("fake server warn", { zone });
  Sentry.logger.error("fake server error", { zone });
  console.debug(`[${zone}] fake server info`);
  console.debug(`[${zone}] fake server warn`);
  console.debug(`[${zone}] fake server error`);
  await Sentry.flush(2000);
}

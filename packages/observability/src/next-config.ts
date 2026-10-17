import fs from "node:fs";
import path from "node:path";

import { sentryOrg, sentryProject } from "./options";

export function loadSentryBuildEnv(repoRoot: string) {
  if (process.env.SENTRY_AUTH_TOKEN) return;

  const file = path.join(repoRoot, ".env.sentry-build-plugin");
  if (!fs.existsSync(file)) return;

  process.loadEnvFile(file);
}

export function sentryBuildOptions() {
  return {
    org: sentryOrg,
    project: sentryProject,
    silent: !process.env.CI,
    widenClientFileUpload: true,
    // Dev: o browser fala com o Sentry direto. O túnel passa pelo Node, e a
    // Zscaler quebra esse TLS com UNABLE_TO_GET_ISSUER_CERT_LOCALLY.
    ...(process.env.NODE_ENV === "production" ? { tunnelRoute: "/monitoring" } : {}),
    webpack: {
      automaticVercelMonitors: true,
      treeshake: {
        removeDebugLogging: true,
      },
    },
  };
}

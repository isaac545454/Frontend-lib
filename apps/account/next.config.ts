import { loadSentryBuildEnv, sentryBuildOptions } from "@monorepo/observability/next-config";
import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
loadSentryBuildEnv(repoRoot);

const nextConfig: NextConfig = {
  turbopack: {
    root: repoRoot,
  },
  basePath: "/account",
  transpilePackages: [
    "@monorepo/catalog",
    "@monorepo/events",
    "@monorepo/module-registry",
    "@monorepo/observability",
    "@monorepo/shell",
    "@isaac545454/nucleus",
    "@curso/login-sdk",
  ],
};

export default withSentryConfig(nextConfig, sentryBuildOptions());

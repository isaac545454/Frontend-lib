export const sentryOrg = "fronten-tlc";
export const sentryProject = "javascript-nextjs";

export const sentryDsn =
  "https://9a032f9754ddd5eb7baf0a576843f3be@o4512234765877248.ingest.us.sentry.io/4512243056181248";

export type SentryZone = "home" | "catalog" | "cart" | "account";

export function sentryRuntimeOptions(zone: SentryZone) {
  return {
    dsn: sentryDsn,
    tracesSampleRate: 1,
    initialScope: {
      tags: { zone },
    },
  };
}

export function sentryErrorSignature(zone: SentryZone) {
  return {
    tags: { module: zone },
    fingerprint: ["{{ default }}", zone],
  };
}

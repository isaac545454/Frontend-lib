import type { PluginManifest } from "./plugin-manifest";

export function zoneOrigin(manifest: PluginManifest) {
  const envName = `${manifest.id.toUpperCase()}_APP_ORIGIN`;
  const fromEnv = process.env[envName];
  return fromEnv && fromEnv.length > 0 ? fromEnv : manifest.devOrigin;
}

export function authApiOrigin() {
  return process.env.AUTH_API_ORIGIN || "http://127.0.0.1:3333";
}

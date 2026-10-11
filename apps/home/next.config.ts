import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

import zones from "../../packages/module-registry/src/zones.json";

const transpilePackages = [
  "@feira/catalog",
  "@feira/events",
  "@feira/module-registry",
  "@feira/shell",
  "@isaac545454/nucleus",
  "@curso/login-sdk",
];

function zoneOrigin(zone: { id: string; devOrigin: string }) {
  const fromEnv = process.env[`${zone.id.toUpperCase()}_APP_ORIGIN`];
  return fromEnv && fromEnv.length > 0 ? fromEnv : zone.devOrigin;
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  },
  transpilePackages,
  async rewrites() {
    if (process.env.NODE_ENV === "development") return [];

    const auth = process.env.AUTH_API_ORIGIN || "http://127.0.0.1:3333";
    return [
      ...zones.flatMap((zone) => {
        const origin = zoneOrigin(zone);
        return [
          { source: zone.basePath, destination: `${origin}${zone.basePath}` },
          {
            source: `${zone.basePath}/:path*`,
            destination: `${origin}${zone.basePath}/:path*`,
          },
        ];
      }),
      { source: "/api/:path*", destination: `${auth}/api/:path*` },
    ];
  },
};

export default nextConfig;

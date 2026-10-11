import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  },
  basePath: "/account",
  transpilePackages: [
    "@feira/catalog",
    "@feira/events",
    "@feira/module-registry",
    "@feira/shell",
    "@isaac545454/nucleus",
    "@curso/login-sdk",
  ],
};

export default nextConfig;

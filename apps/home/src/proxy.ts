import { authApiOrigin, zoneOrigin } from "@feira/module-registry/zone-origin";
import { pluginManifests } from "@feira/module-registry/registry";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Em dev o browser fica em :3000 e cada zona corre noutra porta.
 * Em produção o `rewrites` do next.config (ou um proxy na borda) faz o mesmo papel.
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.rewrite(new URL(`${pathname}${search}`, authApiOrigin()));
  }

  for (const manifest of pluginManifests) {
    const prefix = manifest.basePath;
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return NextResponse.rewrite(new URL(`${pathname}${search}`, zoneOrigin(manifest)));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

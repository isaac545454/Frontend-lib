"use client";

import { SessionProvider, useSession } from "@curso/login-sdk/react";
import { publishAuthChanged } from "@monorepo/events/store";
import { useEffect, type ReactNode } from "react";

function AuthEventsBridge() {
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    publishAuthChanged({
      status,
      email: data?.user.email,
    });
  }, [data, status]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthEventsBridge />
      {children}
    </SessionProvider>
  );
}

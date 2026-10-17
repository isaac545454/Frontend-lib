"use client";

import { useSession } from "@curso/login-sdk/react";
import { pluginManifests } from "@monorepo/module-registry/registry";
import { useCart } from "@monorepo/events/useCart";
import { Button } from "@isaac545454/nucleus/button";
import { Input } from "@isaac545454/nucleus/input";

import { CategoryStrip } from "./CategoryStrip";

/**
 * Links entre zonas são âncoras com o path público (`/catalog`, `/cart`).
 * `next/link` fica dentro do `basePath` da zona e não atravessa o host.
 */
export function SiteHeader() {
  const { count, ready } = useCart();
  const session = useSession();
  const accountLabel =
    session.status === "authenticated" && session.data
      ? session.data.user.email
      : "Entrar";

  return (
    <header className="border-b border-black/10 bg-[var(--feira-header)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <a href="/" className="text-2xl font-semibold tracking-tight text-neutral-950">
            feira
          </a>
          <form action="/catalog/busca" method="get" className="flex min-w-[16rem] flex-1" role="search">
            <Input
              name="q"
              aria-label="Buscar na Feira"
              placeholder="Buscar na Feira"
              className="h-10 rounded-r-none border-transparent bg-white shadow-none"
            />
            <Button type="submit" className="h-10 rounded-l-none px-5">
              Buscar
            </Button>
          </form>
          <nav aria-label="Áreas" className="flex items-center gap-4 text-sm text-neutral-950">
            {pluginManifests.map((item) => {
              const isCart = item.id === "cart";
              const isAccount = item.id === "account";
              const href = isAccount && session.status !== "authenticated" ? "/account/entrar" : item.homeHref;
              const label = isAccount
                ? accountLabel
                : isCart && ready && count > 0
                  ? `${item.displayName} (${count})`
                  : item.displayName;
              return (
                <a key={item.id} href={href} className="max-w-[12rem] truncate hover:underline">
                  {label}
                </a>
              );
            })}
          </nav>
        </div>
        <CategoryStrip />
      </div>
    </header>
  );
}

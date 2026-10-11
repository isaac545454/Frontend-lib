"use client";

import { signOut, useSession } from "@curso/login-sdk/react";
import { Badge } from "@isaac545454/nucleus/badge";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";
import { useEffect, useState } from "react";

export function AccountHome() {
  const session = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // O servidor não vê o token no localStorage. A primeira pintura fica igual nos dois lados.
  if (!mounted || session.status === "loading") {
    return <p className="rounded-md bg-white p-6 text-neutral-700">Abrindo sessão</p>;
  }

  if (session.status !== "authenticated" || !session.data) {
    return (
      <section className="rounded-md bg-white p-6">
        <h1 className="text-xl text-neutral-950">Sua conta</h1>
        <p className="mt-2 text-neutral-600">Entre para ver pedidos e fechar compras.</p>
        <div className="mt-4 flex gap-2">
          <Button asChild>
            <a href="/account/entrar">Entrar</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/account/cadastrar">Criar conta</a>
          </Button>
        </div>
      </section>
    );
  }

  const { user } = session.data;

  return (
    <Card className="rounded-md border-black/10 p-6 shadow-none">
      <h1 className="text-xl text-neutral-950">{user.email}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{user.role}</Badge>
        {user.permissions.map((permission) => (
          <Badge key={permission} variant="outline">
            {permission}
          </Badge>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Button asChild variant="outline">
          <a href="/account/pedidos">Pedidos</a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            void signOut();
          }}
        >
          Sair
        </Button>
      </div>
    </Card>
  );
}

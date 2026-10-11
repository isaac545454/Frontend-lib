"use client";

import { register } from "@curso/login-sdk/react";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";
import { Input } from "@isaac545454/nucleus/input";
import { useState, type FormEvent } from "react";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      await register({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      setDone(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível criar a conta.");
      setPending(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-md border-black/10 p-6 shadow-none">
      <h1 className="text-xl text-neutral-950">Criar conta</h1>
      <p className="mt-1 text-sm text-neutral-600">Senha com pelo menos 8 caracteres. A conta nasce como USER.</p>
      {done ? (
        <p className="mt-4 text-sm text-neutral-800">
          Conta criada.{" "}
          <a href="/account/entrar" className="text-[var(--feira-link)]">
            Entrar
          </a>
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-neutral-800">E-mail</label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-neutral-800">Senha</label>
            <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Criando" : "Criar conta"}
          </Button>
        </form>
      )}
    </Card>
  );
}

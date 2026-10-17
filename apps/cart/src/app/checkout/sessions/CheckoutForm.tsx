"use client";

import { useSession } from "@curso/login-sdk/react";
import { placeOrder } from "@monorepo/events/store";
import { useCart } from "@monorepo/events/useCart";
import { formatMoney } from "@monorepo/shell/format/money";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";
import { Input } from "@isaac545454/nucleus/input";
import { useState, type FormEvent } from "react";

export function CheckoutForm() {
  const session = useSession();
  const cart = useCart();
  const [error, setError] = useState<string | null>(null);

  if (!cart.ready || session.status === "loading") {
    return (
      <p className="rounded-md bg-white p-6 text-neutral-700">
        Abrindo checkout
      </p>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <section className="rounded-md bg-white p-6">
        <h1 className="text-xl text-neutral-950">Nada para fechar</h1>
        <Button asChild className="mt-4">
          <a href="/catalog">Ver anúncios</a>
        </Button>
      </section>
    );
  }

  if (session.status !== "authenticated" || !session.data) {
    return (
      <section className="rounded-md bg-white p-6">
        <h1 className="text-xl text-neutral-950">Entre para fechar o pedido</h1>
        <p className="mt-2 text-neutral-600">
          A conta fica na zona de conta. O carrinho continua aqui.
        </p>
        <Button asChild className="mt-4">
          <a href="/account/entrar?next=/cart/checkout">Entrar</a>
        </Button>
      </section>
    );
  }

  const email = session.data.user.email;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const street = String(form.get("street") ?? "").trim();
    const city = String(form.get("city") ?? "").trim();
    if (!street || !city) {
      setError("Informe rua e cidade.");
      return;
    }
    const order = placeOrder(email);
    if (!order) {
      setError("O carrinho esvaziou antes do envio.");
      return;
    }
    window.location.assign("/account/pedidos");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]"
    >
      <Card className="rounded-md border-black/10 p-5 shadow-none">
        <h1 className="text-xl text-neutral-950">Entrega</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Pedido em nome de {email}. Sem cobrança: isto é uma vitrine.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="street"
              className="text-sm font-medium text-neutral-800"
            >
              Rua e número
            </label>
            <Input
              id="street"
              name="street"
              required
              autoComplete="street-address"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="city"
              className="text-sm font-medium text-neutral-800"
            >
              Cidade
            </label>
            <Input
              id="city"
              name="city"
              required
              autoComplete="address-level2"
            />
          </div>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="mt-5">
          Confirmar pedido
        </Button>
      </Card>
      <Card className="h-fit rounded-md border-black/10 p-4 shadow-none">
        <ul className="flex flex-col gap-2 text-sm text-neutral-700">
          {cart.lines.map((line) => (
            <li key={line.sku} className="flex justify-between gap-3">
              <span>
                {line.quantity}× {line.title}
              </span>
              <span>{formatMoney(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg text-neutral-950">
          {formatMoney(cart.total)}
        </p>
      </Card>
    </form>
  );
}

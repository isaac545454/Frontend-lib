"use client";

import { useCart } from "@monorepo/events/useCart";
import { formatMoney } from "@monorepo/shell/format/money";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";

export function CartView() {
  const cart = useCart();

  if (!cart.ready) {
    return <p className="rounded-md bg-white p-6 text-neutral-700">Abrindo carrinho</p>;
  }

  if (cart.lines.length === 0) {
    return (
      <section className="rounded-md bg-white p-6">
        <h1 className="text-xl text-neutral-950">Carrinho vazio</h1>
        <p className="mt-2 text-neutral-600">Os anúncios que você guardar aparecem aqui, em qualquer zona.</p>
        <Button asChild className="mt-4">
          <a href="/catalog">Ver anúncios</a>
        </Button>
      </section>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="flex flex-col gap-3">
        <h1 className="text-xl text-neutral-950">Carrinho</h1>
        <ul className="flex flex-col gap-3">
          {cart.lines.map((line) => (
            <li key={line.sku}>
              <Card className="flex flex-col gap-3 rounded-md border-black/10 p-4 shadow-none sm:flex-row sm:items-center">
                <div
                  className="h-16 w-16 shrink-0 rounded-sm"
                  style={{ backgroundColor: `hsl(${line.hue} 58% 82%)` }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <a href={`/catalog/p/${line.sku}`} className="text-neutral-900 hover:text-[var(--feira-link)]">
                    {line.title}
                  </a>
                  <p className="text-sm text-[var(--feira-price)]">{formatMoney(line.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="icon" aria-label={`Diminuir ${line.title}`} onClick={() => cart.setQuantity(line.sku, line.quantity - 1)}>
                    −
                  </Button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <Button type="button" variant="outline" size="icon" aria-label={`Aumentar ${line.title}`} onClick={() => cart.setQuantity(line.sku, line.quantity + 1)}>
                    +
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => cart.remove(line.sku)}>
                    Remover
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
      <Card className="h-fit rounded-md border-black/10 p-4 shadow-none">
        <p className="text-sm text-neutral-600">Total</p>
        <p className="text-2xl text-neutral-950">{formatMoney(cart.total)}</p>
        <Button asChild className="mt-4 w-full">
          <a href="/cart/checkout">Continuar</a>
        </Button>
      </Card>
    </div>
  );
}

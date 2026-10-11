"use client";

import type { Product } from "@feira/catalog/types";
import { useCart } from "@feira/events/useCart";
import { formatMoney, installmentLabel } from "@feira/shell/format/money";
import { Badge } from "@isaac545454/nucleus/badge";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";
import { useState } from "react";

export function BuyBox({ product }: { product: Product }) {
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const installments = installmentLabel(product.price);

  function add() {
    cart.add({
      sku: product.sku,
      title: product.title,
      price: product.price,
      hue: product.hue,
      quantity,
    });
  }

  return (
    <article className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
      <div
        className="flex min-h-64 items-end rounded-md p-4 text-neutral-800"
        style={{ backgroundColor: `hsl(${product.hue} 58% 82%)` }}
      >
        {product.category}
      </div>
      <Card className="rounded-md border-black/10 p-5 shadow-none">
        <p className="text-sm text-neutral-500">
          {product.condition} · {product.seller}
        </p>
        <h1 className="mt-2 text-2xl text-neutral-950">{product.title}</h1>
        <p className="mt-3 text-3xl text-[var(--feira-price)]">{formatMoney(product.price)}</p>
        {installments ? <p className="mt-1 text-sm text-neutral-600">{installments}</p> : null}
        {product.freeShipping ? (
          <Badge variant="secondary" className="mt-3 w-fit border-transparent bg-emerald-50 text-[var(--feira-price)]">
            Frete grátis
          </Badge>
        ) : (
          <p className="mt-3 text-sm text-neutral-500">Frete a calcular</p>
        )}
        <p className="mt-4 text-sm leading-6 text-neutral-700">{product.blurb}</p>
        <div className="mt-5 flex items-center gap-2">
          <span className="text-sm text-neutral-700">Quantidade</span>
          <Button type="button" variant="outline" size="icon" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade">
            −
          </Button>
          <span className="w-6 text-center text-sm">{quantity}</span>
          <Button type="button" variant="outline" size="icon" onClick={() => setQuantity((value) => value + 1)} aria-label="Aumentar quantidade">
            +
          </Button>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Button type="button" onClick={add}>
            Adicionar ao carrinho
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              add();
              window.location.assign("/cart");
            }}
          >
            Comprar agora
          </Button>
        </div>
      </Card>
    </article>
  );
}

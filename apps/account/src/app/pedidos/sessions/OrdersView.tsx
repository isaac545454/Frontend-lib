"use client";

import { useOrders } from "@feira/events/useOrders";
import { formatMoney } from "@feira/shell/format/money";
import { Button } from "@isaac545454/nucleus/button";
import { Card } from "@isaac545454/nucleus/card";

const when = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

export function OrdersView() {
  const { orders, ready } = useOrders();

  if (!ready) {
    return <p className="rounded-md bg-white p-6 text-neutral-700">Abrindo pedidos</p>;
  }

  if (orders.length === 0) {
    return (
      <section className="rounded-md bg-white p-6">
        <h1 className="text-xl text-neutral-950">Nenhum pedido</h1>
        <p className="mt-2 text-neutral-600">Quando você confirmar uma compra, ela aparece aqui.</p>
        <Button asChild className="mt-4">
          <a href="/catalog">Ver anúncios</a>
        </Button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-xl text-neutral-950">Pedidos</h1>
      <ul className="flex flex-col gap-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Card className="rounded-md border-black/10 p-4 shadow-none">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-neutral-950">{order.id}</p>
                <p className="text-sm text-neutral-500">{when.format(new Date(order.createdAt))}</p>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{order.email}</p>
              <ul className="mt-3 flex flex-col gap-1 text-sm text-neutral-800">
                {order.lines.map((line) => (
                  <li key={line.sku}>
                    {line.quantity}× {line.title}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[var(--feira-price)]">{formatMoney(order.total)}</p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { Product } from "@feira/catalog/types";
import { Badge } from "@isaac545454/nucleus/badge";
import { Card } from "@isaac545454/nucleus/card";

import { formatMoney, installmentLabel } from "../format/money";

export function ProductCard({ product }: { product: Product }) {
  const installments = installmentLabel(product.price);

  return (
    <a href={`/catalog/p/${product.sku}`} className="block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-md border-black/10 shadow-none hover:shadow-md">
        <div
          className="flex aspect-[4/3] items-end p-3 text-sm text-neutral-800"
          style={{ backgroundColor: `hsl(${product.hue} 58% 82%)` }}
        >
          {product.category}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-neutral-800">{product.title}</p>
          <p className="text-2xl text-[var(--feira-price)]">{formatMoney(product.price)}</p>
          {installments ? <p className="text-sm text-neutral-600">{installments}</p> : null}
          {product.freeShipping ? (
            <Badge variant="secondary" className="mt-1 w-fit border-transparent bg-emerald-50 text-[var(--feira-price)]">
              Frete grátis
            </Badge>
          ) : (
            <span className="mt-1 text-xs text-neutral-500">Frete a calcular</span>
          )}
        </div>
      </Card>
    </a>
  );
}

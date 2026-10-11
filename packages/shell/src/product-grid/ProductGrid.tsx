import type { Product } from "@feira/catalog/types";

import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: readonly Product[] }) {
  if (products.length === 0) {
    return <p className="rounded-md bg-white p-6 text-neutral-700">Nenhum anúncio encontrado.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {products.map((product) => (
        <li key={product.sku}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}

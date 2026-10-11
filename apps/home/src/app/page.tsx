import { products } from "@feira/catalog/products";
import { ProductGrid } from "@feira/shell/product-grid/ProductGrid";

export default function HomePage() {
  const offers = products.slice(0, 8);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-md bg-white px-5 py-6">
        <h1 className="text-2xl text-neutral-950">Ofertas para hoje</h1>
        <p className="mt-2 max-w-xl text-neutral-600">
          Frete grátis em parte dos anúncios. Parcele em até 12x sem juros nas compras a partir de R$ 80.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-xl text-neutral-900">Destaques</h2>
        <ProductGrid products={offers} />
      </section>
    </div>
  );
}

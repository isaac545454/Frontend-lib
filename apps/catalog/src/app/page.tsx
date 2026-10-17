import { products } from "@monorepo/catalog/products";
import { ProductGrid } from "@monorepo/shell/product-grid/ProductGrid";

export default function CatalogPage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl text-neutral-950">Catálogo</h1>
      <ProductGrid products={products} />
    </section>
  );
}

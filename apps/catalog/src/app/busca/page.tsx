import { searchProducts } from "@monorepo/catalog/products";
import { ProductGrid } from "@monorepo/shell/product-grid/ProductGrid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const items = searchProducts(q);
  const title = q.trim() ? `Resultados para “${q.trim()}”` : "Todos os anúncios";

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl text-neutral-950">{title}</h1>
      <ProductGrid products={items} />
    </section>
  );
}

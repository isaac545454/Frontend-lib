import { getCategory, searchProducts } from "@feira/catalog/products";
import { ProductGrid } from "@feira/shell/product-grid/ProductGrid";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  return { title: category ? `${category.label} | Feira` : "Categoria | Feira" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl text-neutral-950">{category.label}</h1>
      <ProductGrid products={searchProducts("", category.slug)} />
    </section>
  );
}

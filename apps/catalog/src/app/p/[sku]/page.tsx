import { getProduct } from "@feira/catalog/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BuyBox } from "./sessions/BuyBox";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = getProduct(sku);
  return { title: product ? `${product.title} | Feira` : "Anúncio | Feira" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = getProduct(sku);
  if (!product) notFound();
  return <BuyBox product={product} />;
}

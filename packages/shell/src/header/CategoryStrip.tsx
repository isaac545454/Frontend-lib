import { categories } from "@feira/catalog/products";

export function CategoryStrip() {
  return (
    <nav aria-label="Categorias" className="flex gap-4 overflow-x-auto text-sm">
      {categories.map((category) => (
        <a
          key={category.slug}
          href={`/catalog/c/${category.slug}`}
          className="shrink-0 text-neutral-800 hover:text-[var(--feira-link)]"
        >
          {category.label}
        </a>
      ))}
    </nav>
  );
}

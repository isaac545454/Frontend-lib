export type Category = {
  slug: string;
  label: string;
};

export type Product = {
  sku: string;
  title: string;
  blurb: string;
  price: number;
  category: string;
  categorySlug: string;
  seller: string;
  freeShipping: boolean;
  condition: "Novo" | "Usado";
  hue: number;
};

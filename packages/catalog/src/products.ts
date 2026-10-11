import type { Category, Product } from "./types";

export const categories: readonly Category[] = [
  { slug: "eletronicos", label: "Eletrônicos" },
  { slug: "casa", label: "Casa" },
  { slug: "esportes", label: "Esportes" },
  { slug: "moda", label: "Moda" },
];

export const products: readonly Product[] = [
  {
    sku: "FR1001",
    title: "Fone sem fio Pulse com estojo",
    blurb: "Drivers de 40 mm, estojo com carga e microfone para chamada.",
    price: 199.9,
    category: "Eletrônicos",
    categorySlug: "eletronicos",
    seller: "Loja Norte",
    freeShipping: true,
    condition: "Novo",
    hue: 200,
  },
  {
    sku: "FR1002",
    title: "Smartwatch Lume com GPS",
    blurb: "Pulseira de silicone, bateria de dois dias e tela sempre acesa.",
    price: 499,
    category: "Eletrônicos",
    categorySlug: "eletronicos",
    seller: "Relojoaria Sul",
    freeShipping: true,
    condition: "Novo",
    hue: 220,
  },
  {
    sku: "FR1003",
    title: "Monitor 24 polegadas IPS",
    blurb: "Painel IPS, 75 Hz e suporte com ajuste de altura.",
    price: 1099,
    category: "Eletrônicos",
    categorySlug: "eletronicos",
    seller: "Pixel & Cia",
    freeShipping: false,
    condition: "Novo",
    hue: 210,
  },
  {
    sku: "FR2001",
    title: "Cafeteira elétrica 15 xícaras",
    blurb: "Jarra de vidro, filtro permanente e desligamento automático.",
    price: 229,
    category: "Casa",
    categorySlug: "casa",
    seller: "Casa & Cia",
    freeShipping: true,
    condition: "Novo",
    hue: 28,
  },
  {
    sku: "FR2002",
    title: "Cadeira de escritório Atlas",
    blurb: "Encosto em malha, apoio lombar e rodízio para piso duro.",
    price: 899,
    category: "Casa",
    categorySlug: "casa",
    seller: "Estúdio Móvel",
    freeShipping: false,
    condition: "Novo",
    hue: 150,
  },
  {
    sku: "FR2003",
    title: "Panela antiaderente 24 cm",
    blurb: "Cabo frio ao toque e tampa de vidro com saída de vapor.",
    price: 89.9,
    category: "Casa",
    categorySlug: "casa",
    seller: "Cozinha Rasa",
    freeShipping: true,
    condition: "Novo",
    hue: 16,
  },
  {
    sku: "FR3001",
    title: "Tênis de corrida Norte",
    blurb: "Entressola macia, cabedal respirável e solado para asfalto.",
    price: 349.9,
    category: "Esportes",
    categorySlug: "esportes",
    seller: "Pista Livre",
    freeShipping: true,
    condition: "Novo",
    hue: 262,
  },
  {
    sku: "FR3002",
    title: "Mochila urbana 20 litros",
    blurb: "Compartimento para notebook de 15 polegadas e costas acolchoadas.",
    price: 159.9,
    category: "Esportes",
    categorySlug: "esportes",
    seller: "Trilha Curta",
    freeShipping: true,
    condition: "Novo",
    hue: 130,
  },
  {
    sku: "FR3003",
    title: "Kit de chaves de fenda",
    blurb: "Seis medidas, cabo emborrachado e estojo rígido.",
    price: 129.9,
    category: "Esportes",
    categorySlug: "esportes",
    seller: "Oficina 12",
    freeShipping: false,
    condition: "Novo",
    hue: 40,
  },
  {
    sku: "FR4001",
    title: "Camiseta de algodão lisa",
    blurb: "Malha 100% algodão, gola careca e corte regular.",
    price: 49.9,
    category: "Moda",
    categorySlug: "moda",
    seller: "Ateliê Baixo",
    freeShipping: false,
    condition: "Novo",
    hue: 350,
  },
  {
    sku: "FR4002",
    title: "Perfume cítrico 50 ml",
    blurb: "Saída de bergamota, corpo floral e fundo amadeirado.",
    price: 189.9,
    category: "Moda",
    categorySlug: "moda",
    seller: "Casa do Frasco",
    freeShipping: true,
    condition: "Novo",
    hue: 48,
  },
  {
    sku: "FR4003",
    title: "Livro Sistemas de vitrine",
    blurb: "Ensaio sobre busca, preço e a prateleira que cabe numa tela.",
    price: 59.9,
    category: "Casa",
    categorySlug: "casa",
    seller: "Sebo Central",
    freeShipping: false,
    condition: "Usado",
    hue: 80,
  },
];

export function getProduct(sku: string) {
  return products.find((product) => product.sku === sku) ?? null;
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug) ?? null;
}

export function searchProducts(query: string, categorySlug?: string) {
  const normalized = query.trim().toLocaleLowerCase("pt-BR");
  return products.filter((product) => {
    const haystack = `${product.title} ${product.seller} ${product.category}`.toLocaleLowerCase(
      "pt-BR",
    );
    const matchesQuery = normalized.length === 0 || haystack.includes(normalized);
    const matchesCategory = !categorySlug || product.categorySlug === categorySlug;
    return matchesQuery && matchesCategory;
  });
}

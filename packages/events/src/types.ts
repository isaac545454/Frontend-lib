export type CartLine = {
  sku: string;
  title: string;
  price: number;
  quantity: number;
  hue: number;
};

export type PlacedOrder = {
  id: string;
  createdAt: string;
  email: string;
  total: number;
  lines: CartLine[];
};

/** Contrato do barramento. Quem publica e quem escuta mora nas zonas; o mapa mora aqui. */
export type MarketplaceEvents = {
  "cart:updated": { lines: CartLine[] };
  "orders:updated": { orders: PlacedOrder[] };
  "order:placed": { order: PlacedOrder };
  "auth:changed": {
    status: "authenticated" | "unauthenticated";
    email?: string;
  };
};

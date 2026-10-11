"use client";

import { useEffect, useState } from "react";

import { getMarketplaceBus, orderList } from "./store";
import type { PlacedOrder } from "./types";

export function useOrders() {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrders(orderList());
    setReady(true);
    return getMarketplaceBus().sub("orders:updated", (payload) => {
      setOrders(payload.orders);
    });
  }, []);

  return { orders, ready };
}

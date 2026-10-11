"use client";

import { useEffect, useState } from "react";

import {
  addLine,
  cartLines,
  getMarketplaceBus,
  removeLine,
  setLineQuantity,
} from "./store";
import type { CartLine } from "./types";

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(cartLines());
    setReady(true);
    return getMarketplaceBus().sub("cart:updated", (payload) => {
      setLines(payload.lines);
    });
  }, []);

  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return {
    lines,
    count,
    total,
    ready,
    add: addLine,
    remove: removeLine,
    setQuantity: setLineQuantity,
  };
}

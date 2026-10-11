import { createEventBus, type EventBus } from "@isaac545454/frontend-events";

import type { CartLine, MarketplaceEvents, PlacedOrder } from "./types";

const STORAGE_KEY = "feira.marketplace.v1";
const CHANNEL_NAME = "feira.marketplace";

type Snapshot = {
  rev: number;
  lines: CartLine[];
  orders: PlacedOrder[];
};

type RemoteMessage = {
  source?: string;
  snapshot?: Snapshot;
};

function emptySnapshot(): Snapshot {
  return { rev: 0, lines: [], orders: [] };
}

let snapshot = emptySnapshot();
let bus: EventBus<MarketplaceEvents> | null = null;
let attached = false;
let tabId = "";

function inBrowser() {
  return typeof window !== "undefined";
}

function isSnapshot(value: unknown): value is Snapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as Snapshot;
  return Array.isArray(record.lines) && Array.isArray(record.orders);
}

function readStorage(): Snapshot | null {
  if (!inBrowser()) return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSnapshot(parsed)) return null;
    return {
      rev: typeof parsed.rev === "number" ? parsed.rev : 0,
      lines: parsed.lines,
      orders: parsed.orders,
    };
  } catch {
    return null;
  }
}

function writeStorage() {
  if (!inBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

function emitLocal() {
  const current = getMarketplaceBus();
  current.pub("cart:updated", { lines: snapshot.lines });
  current.pub("orders:updated", { orders: snapshot.orders });
}

function broadcast() {
  if (!inBrowser() || typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ source: tabId, snapshot });
  channel.close();
}

function applySnapshot(next: Snapshot) {
  if (next.rev <= snapshot.rev) return;
  snapshot = {
    rev: next.rev,
    lines: next.lines,
    orders: next.orders,
  };
  emitLocal();
}

function commit() {
  snapshot = { ...snapshot, rev: snapshot.rev + 1 };
  writeStorage();
  emitLocal();
  broadcast();
}

function attach() {
  if (attached || !inBrowser()) return;
  attached = true;
  tabId = Math.random().toString(36).slice(2);
  const stored = readStorage();
  if (stored) snapshot = stored;

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const parsed: unknown = JSON.parse(event.newValue);
      if (isSnapshot(parsed)) applySnapshot(parsed);
    } catch {
      // payload quebrado não derruba a zona
    }
  });

  if (typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.onmessage = (event: MessageEvent<RemoteMessage>) => {
    if (!event.data?.snapshot || event.data.source === tabId) return;
    if (!isSnapshot(event.data.snapshot)) return;
    applySnapshot(event.data.snapshot);
  };
}

export function getMarketplaceBus() {
  if (!bus) {
    const raw = createEventBus<MarketplaceEvents>();
    const publish = raw.pub.bind(raw);
    raw.pub = ((event, ...payload) => {
      console.log(`[marketplace] ${event}`, payload[0]);
      publish(event, ...payload);
    }) as typeof raw.pub;
    bus = raw;
  }
  attach();
  return bus;
}

export function cartLines(): CartLine[] {
  getMarketplaceBus();
  return snapshot.lines;
}

export function orderList(): PlacedOrder[] {
  getMarketplaceBus();
  return snapshot.orders;
}

export function addLine(input: CartLine) {
  getMarketplaceBus();
  const lines = snapshot.lines.map((line) => ({ ...line }));
  const found = lines.find((line) => line.sku === input.sku);
  if (found) found.quantity += input.quantity;
  else lines.push({ ...input });
  snapshot = { ...snapshot, lines };
  commit();
}

export function removeLine(sku: string) {
  getMarketplaceBus();
  snapshot = {
    ...snapshot,
    lines: snapshot.lines.filter((line) => line.sku !== sku),
  };
  commit();
}

export function setLineQuantity(sku: string, quantity: number) {
  if (quantity < 1) {
    removeLine(sku);
    return;
  }
  getMarketplaceBus();
  snapshot = {
    ...snapshot,
    lines: snapshot.lines.map((line) =>
      line.sku === sku ? { ...line, quantity } : line,
    ),
  };
  commit();
}

export function placeOrder(email: string): PlacedOrder | null {
  getMarketplaceBus();
  if (snapshot.lines.length === 0) return null;
  const order: PlacedOrder = {
    id: `ped-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    email,
    total: snapshot.lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    lines: snapshot.lines.map((line) => ({ ...line })),
  };
  snapshot = {
    ...snapshot,
    lines: [],
    orders: [order, ...snapshot.orders],
  };
  commit();
  getMarketplaceBus().pub("order:placed", { order });
  return order;
}

export function publishAuthChanged(payload: MarketplaceEvents["auth:changed"]) {
  getMarketplaceBus().pub("auth:changed", payload);
}

"use client";

import { useMemo, useSyncExternalStore } from "react";

const CART_STORAGE_KEY = "gtbs-cart-v1";
const CART_EVENT = "gtbs-cart-change";
const EMPTY_SNAPSHOT = "[]";

export interface StorefrontProductSnapshot {
  productId: string;
  title: string;
  price: number;
  image: string;
}

export interface CartItem extends StorefrontProductSnapshot {
  key: string;
  quantity: number;
  variantSummary?: string;
}

function isSafeImageReference(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 2_048 &&
    ((value.startsWith("/") && !value.startsWith("//")) ||
      value.startsWith("https://"))
  );
}

function isProductSnapshot(value: unknown): value is StorefrontProductSnapshot {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "string" &&
    item.productId.length > 0 &&
    item.productId.length <= 200 &&
    typeof item.title === "string" &&
    item.title.length > 0 &&
    item.title.length <= 300 &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    item.price <= 10_000_000 &&
    isSafeImageReference(item.image)
  );
}

function parseCart(raw: string): CartItem[] {
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];

    return value.slice(0, 100).filter((item): item is CartItem => {
      if (!isProductSnapshot(item)) return false;
      const candidate = item as unknown as Record<string, unknown>;
      return (
        typeof candidate.key === "string" &&
        candidate.key.length > 0 &&
        candidate.key.length <= 500 &&
        Number.isInteger(candidate.quantity) &&
        Number(candidate.quantity) >= 1 &&
        Number(candidate.quantity) <= 99 &&
        (candidate.variantSummary === undefined ||
          (typeof candidate.variantSummary === "string" &&
            candidate.variantSummary.length <= 300))
      );
    });
  } catch {
    return [];
  }
}

function createSubscription(storageKey: string, eventName: string) {
  return (callback: () => void) => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey) callback();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(eventName, callback);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(eventName, callback);
    };
  };
}

function createSnapshotReader(storageKey: string) {
  return () => {
    try {
      return window.localStorage.getItem(storageKey) ?? EMPTY_SNAPSHOT;
    } catch {
      return EMPTY_SNAPSHOT;
    }
  };
}

const subscribeToCart = createSubscription(CART_STORAGE_KEY, CART_EVENT);
const getCartSnapshot = createSnapshotReader(CART_STORAGE_KEY);
const getServerSnapshot = () => EMPTY_SNAPSHOT;

function writeSnapshot(storageKey: string, eventName: string, value: unknown) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
    window.dispatchEvent(new Event(eventName));
    return true;
  } catch {
    return false;
  }
}

export function addCartItem(
  product: StorefrontProductSnapshot,
  quantity = 1,
  variantSummary = "",
) {
  const safeQuantity = Math.min(99, Math.max(1, Math.floor(quantity)));
  const normalizedVariant = variantSummary.trim().slice(0, 300);
  const key = `${product.productId}::${normalizedVariant}`;
  const cart = parseCart(getCartSnapshot());
  const existingIndex = cart.findIndex((item) => item.key === key);

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      quantity: Math.min(99, cart[existingIndex].quantity + safeQuantity),
    };
  } else {
    cart.push({
      ...product,
      key,
      quantity: safeQuantity,
      ...(normalizedVariant ? { variantSummary: normalizedVariant } : {}),
    });
  }

  return writeSnapshot(CART_STORAGE_KEY, CART_EVENT, cart);
}

export function updateCartItemQuantity(key: string, quantity: number) {
  const cart = parseCart(getCartSnapshot());
  const nextQuantity = Math.min(99, Math.max(0, Math.floor(quantity)));
  const nextCart =
    nextQuantity === 0
      ? cart.filter((item) => item.key !== key)
      : cart.map((item) =>
          item.key === key ? { ...item, quantity: nextQuantity } : item,
        );
  return writeSnapshot(CART_STORAGE_KEY, CART_EVENT, nextCart);
}

export function removeCartItem(key: string) {
  return updateCartItemQuantity(key, 0);
}

export function clearCart() {
  return writeSnapshot(CART_STORAGE_KEY, CART_EVENT, []);
}

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerSnapshot,
  );
  const items = useMemo(() => parseCart(snapshot), [snapshot]);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return { items, itemCount, subtotal };
}

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "atg_favorites";

function getFavorites(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(getFavorites);

  useEffect(() => {
    const sync = () => setFavorites(getFavorites());
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  const toggle = useCallback((productId: string) => {
    const current = getFavorites();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFavorites(next);
    notify();
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );

  return { favorites, toggle, isFavorite, count: favorites.length };
}

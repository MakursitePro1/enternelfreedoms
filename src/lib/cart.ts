import { useEffect, useState } from 'react';

const KEY = 'ef-cart';
type Cart = Record<string, number>;
const listeners = new Set<(c: Cart) => void>();

function read(): Cart {
  try { return JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Cart; } catch { return {}; }
}
function write(c: Cart) {
  window.localStorage.setItem(KEY, JSON.stringify(c));
  listeners.forEach((l) => l(c));
}

export function useCart() {
  const [cart, setCart] = useState<Cart>({});
  useEffect(() => {
    setCart(read());
    listeners.add(setCart);
    return () => { listeners.delete(setCart); };
  }, []);
  const change = (id: string, delta: number) => {
    const c = read();
    const next = Math.max(0, Math.min(20, (c[id] ?? 0) + delta));
    if (next === 0) delete c[id]; else c[id] = next;
    write({ ...c });
  };
  const clear = () => write({});
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return { cart, change, clear, count };
}

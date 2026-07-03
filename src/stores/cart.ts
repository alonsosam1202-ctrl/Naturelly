import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Carrito 100% del lado del cliente (Zustand + persist en localStorage).
 * Los precios guardados aquí son solo para MOSTRAR: al confirmar, la API
 * recibe únicamente ids + cantidades y recalcula todo desde la BD.
 */
export interface CartLine {
  kind: "variant" | "bundle";
  /** variant_id o bundle_id según `kind`. */
  id: string;
  slug: string;
  name: string;
  /** "250 g", "500 g" o "Pack". */
  detail: string;
  unitPrice: number;
  quantity: number;
  maxStock: number | null;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

function clampQuantity(quantity: number, maxStock: number | null): number {
  const max = maxStock ?? 50;
  return Math.max(1, Math.min(quantity, Math.min(max, 50)));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (line, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === line.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === line.id
                  ? {
                      ...item,
                      quantity: clampQuantity(
                        item.quantity + quantity,
                        item.maxStock
                      ),
                    }
                  : item
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              { ...line, quantity: clampQuantity(quantity, line.maxStock) },
            ],
            isOpen: true,
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      setQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: clampQuantity(quantity, item.maxStock) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "naturelly-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

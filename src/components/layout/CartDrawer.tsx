"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { formatPrice, sumLineTotals } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import CartItem from "@/components/carrito/CartItem";
import EmptyCart from "@/components/carrito/EmptyCart";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart } = useCartStore();

  useEffect(() => setMounted(true), []);

  if (!mounted || !isOpen) return null;

  const subtotal = sumLineTotals(items);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito">
      <button
        type="button"
        className="absolute inset-0 animate-fade bg-tinta/40"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md animate-drawer flex-col bg-blanco-crema shadow-calida-lg">
        <div className="flex items-center justify-between border-b border-amarillo-suave px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-tinta">
            Tu carrito
          </h2>
          <button
            type="button"
            className="rounded-full p-2 text-tinta hover:bg-amarillo-suave"
            aria-label="Cerrar carrito"
            onClick={closeCart}
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center px-5">
            <EmptyCart onNavigate={closeCart} />
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItem line={item} />
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-amarillo-suave px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cacao">Subtotal</span>
                <span className="font-display text-xl font-semibold text-tinta">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-sm text-cacao">
                El total final se confirma al hacer tu pedido.
              </p>
              <div className="flex flex-col gap-2">
                <ButtonLink href="/checkout" onClick={closeCart}>
                  Hacer mi pedido
                </ButtonLink>
                <ButtonLink href="/carrito" variant="secondary" onClick={closeCart}>
                  Ver carrito completo
                </ButtonLink>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import CartItem from "@/components/carrito/CartItem";
import CartSummary from "@/components/carrito/CartSummary";
import EmptyCart from "@/components/carrito/EmptyCart";
import { ButtonLink } from "@/components/ui/Button";
import { useCartStore } from "@/stores/cart";

export default function CarritoPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  // El carrito vive en localStorage: se pinta recién tras hidratar.
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeader as="h1" eyebrow="Carrito" title="Tu pedido hasta ahora" />

      {!mounted ? null : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id}>
                <CartItem line={item} />
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <CartSummary />
            <ButtonLink href="/checkout">Hacer mi pedido</ButtonLink>
            <ButtonLink href="/tienda" variant="secondary">
              Seguir comprando
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}

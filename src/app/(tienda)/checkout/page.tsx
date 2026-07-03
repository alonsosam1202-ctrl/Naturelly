"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CartSummary from "@/components/carrito/CartSummary";
import EmptyCart from "@/components/carrito/EmptyCart";
import { useCartStore } from "@/stores/cart";

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeader
        eyebrow="Checkout"
        title="Casi listo: tus datos de entrega"
        description="Tu pedido se registra con un código único y luego lo confirmamos juntos por WhatsApp."
      />

      {!mounted ? null : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl bg-blanco-crema p-6 shadow-calida sm:p-8">
            <CheckoutForm />
          </div>
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}

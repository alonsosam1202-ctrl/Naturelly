"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import CartSummary from "@/components/carrito/CartSummary";
import EmptyCart from "@/components/carrito/EmptyCart";
import { useCartStore } from "@/stores/cart";

type CheckoutContentProps = {
  /** Prefill desde el perfil cuando hay sesión (editable por pedido). */
  defaultName: string;
  defaultPhone: string;
  isLoggedIn: boolean;
};

export default function CheckoutContent({
  defaultName,
  defaultPhone,
  isLoggedIn,
}: CheckoutContentProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);

  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeader
        as="h1"
        eyebrow="Checkout"
        title="Casi listo: tus datos de entrega"
        description="Tu pedido se registra con un código único y luego lo confirmamos juntos por WhatsApp."
      />

      {!mounted ? null : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl bg-blanco-crema p-6 shadow-calida sm:p-8">
            <CheckoutForm
              defaultName={defaultName}
              defaultPhone={defaultPhone}
            />
          </div>
          <div className="flex flex-col gap-4">
            <CartSummary />
            {isLoggedIn ? (
              <p className="rounded-2xl bg-salvia/15 px-4 py-3 text-sm text-cacao">
                Este pedido quedará guardado en{" "}
                <Link
                  href="/cuenta/pedidos"
                  className="font-bold text-salvia-oscura hover:text-tinta"
                >
                  tu cuenta
                </Link>
                .
              </p>
            ) : (
              // Invitación discreta: NUNCA bloquea la compra como invitado
              <p className="rounded-2xl bg-crema px-4 py-3 text-sm text-cacao">
                ¿Quieres seguir tus pedidos?{" "}
                <Link
                  href="/registro?next=/checkout"
                  className="font-bold text-miel-oscura hover:text-tinta"
                >
                  Crea una cuenta
                </Link>{" "}
                (opcional, tu compra funciona igual sin ella).
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

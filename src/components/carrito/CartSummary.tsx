"use client";

import { useCartStore } from "@/stores/cart";
import { formatPrice, sumLineTotals } from "@/lib/utils";

/**
 * Resumen referencial del carrito. El total real siempre lo calcula el
 * servidor desde la BD al registrar el pedido.
 */
export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = sumLineTotals(items);

  return (
    <div className="space-y-3 rounded-2xl bg-blanco-crema p-5 shadow-calida">
      <h2 className="font-display text-xl font-semibold text-tinta">
        Resumen
      </h2>
      <div className="flex items-center justify-between text-cacao">
        <span>Subtotal</span>
        <span className="font-bold text-tinta">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between text-cacao">
        <span>Delivery</span>
        <span>Se coordina por WhatsApp</span>
      </div>
      <div className="flex items-center justify-between border-t border-amarillo-suave pt-3">
        <span className="font-bold text-tinta">Total referencial</span>
        <span className="font-display text-2xl font-semibold text-miel-oscura">
          {formatPrice(subtotal)}
        </span>
      </div>
      {/* Regla real del negocio: todo se prepara por encargo (hallazgo C1
          de la auditoría — antes solo vivía en el FAQ) */}
      <p className="rounded-xl bg-blush px-3 py-2.5 text-sm text-piedra">
        Preparamos por encargo: la entrega o el recojo son{" "}
        <strong className="text-tinta">a partir del día siguiente</strong> de
        tu pedido.
      </p>
    </div>
  );
}

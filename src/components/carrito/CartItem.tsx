"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import QuantityStepper from "@/components/tienda/QuantityStepper";
import { useCartStore, type CartLine } from "@/stores/cart";
import { formatPrice } from "@/lib/utils";

export default function CartItem({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const href = line.kind === "variant" ? `/producto/${line.slug}` : "/packs";
  const lineTotal =
    (Math.round(line.unitPrice * 100) * line.quantity) / 100;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-crema p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={href} className="font-bold text-tinta hover:text-miel-oscura">
            {line.name}
          </Link>
          <p className="text-sm text-cacao">{line.detail}</p>
        </div>
        <button
          type="button"
          onClick={() => removeItem(line.id)}
          className="rounded-full p-2 text-cacao transition-colors hover:bg-amarillo-suave hover:text-terracota"
          aria-label={`Quitar ${line.name} del carrito`}
        >
          <Trash2 className="size-4" aria-hidden />
        </button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <QuantityStepper
          value={line.quantity}
          onChange={(quantity) => setQuantity(line.id, quantity)}
          max={line.maxStock}
          label={`Cantidad de ${line.name}`}
        />
        <span className="font-display font-semibold text-tinta">
          {formatPrice(lineTotal)}
        </span>
      </div>
    </div>
  );
}

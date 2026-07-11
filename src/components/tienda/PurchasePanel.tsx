"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import QuantityStepper from "./QuantityStepper";
import PriceTag from "./PriceTag";
import { useCartStore } from "@/stores/cart";
import type { CatalogProduct } from "@/types";

/**
 * Selector de variante + cantidad + agregar al carrito (VariantSelector y
 * QuantityStepper de ARCHITECTURE.md integrados en un panel).
 */
export default function PurchasePanel({ product }: { product: CatalogProduct }) {
  // Preselecciona la primera presentación CON disponibilidad: si la Mediana
  // está agotada pero la Grande no, el panel no debe abrir en la agotada
  const [selectedId, setSelectedId] = useState(
    product.variants.find((v) => v.stock > 0)?.id ??
      product.variants[0]?.id ??
      ""
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const variant = product.variants.find((v) => v.id === selectedId);
  if (!variant) {
    return (
      <p className="rounded-2xl bg-amarillo-suave px-4 py-3 text-cacao">
        Este producto no tiene presentaciones disponibles por ahora.
      </p>
    );
  }

  const outOfStock = variant.stock < 1;

  function handleAdd() {
    if (!variant) return;
    addItem(
      {
        kind: "variant",
        id: variant.id,
        slug: product.slug,
        name: product.name,
        detail: variant.size_label,
        unitPrice: variant.price,
        maxStock: variant.stock,
      },
      quantity
    );
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <fieldset>
        <legend className="mb-2 font-bold text-tinta">Presentación</legend>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((option) => {
            const optionOut = option.stock < 1;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedId(option.id);
                  setQuantity(1);
                }}
                aria-pressed={option.id === selectedId}
                className={`rounded-full border-2 px-5 py-2.5 font-bold transition-colors ${
                  option.id === selectedId
                    ? optionOut
                      ? "border-piedra bg-blush text-piedra"
                      : "border-miel bg-miel text-tinta"
                    : optionOut
                      ? "border-lino bg-blush text-piedra hover:border-piedra"
                      : "border-amarillo-suave bg-blanco-crema text-tinta hover:border-miel"
                }`}
              >
                {option.size_label}
                {optionOut && (
                  <span className="ml-1.5 text-xs font-bold uppercase tracking-wide">
                    · agotado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <PriceTag
        price={variant.price}
        compareAtPrice={variant.compare_at_price}
        className="text-2xl"
      />

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={variant.stock}
        />
        <Button onClick={handleAdd} disabled={outOfStock} className="flex-1 sm:flex-none">
          <ShoppingBag className="size-5" aria-hidden />
          {outOfStock ? "Agotado por ahora" : "Agregar al carrito"}
        </Button>
      </div>

      {!outOfStock && variant.stock <= 5 && (
        <p className="text-sm font-bold text-terracota">
          ¡Quedan solo {variant.stock} de esta tanda!
        </p>
      )}

      {outOfStock && (
        <p className="rounded-2xl bg-blush px-4 py-3 text-sm text-piedra">
          La disponibilidad de hoy ya se llenó para esta presentación —
          normalmente se renueva cada mañana. Si la necesitas para una fecha
          especial, escríbenos por WhatsApp.
        </p>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import PriceTag from "./PriceTag";
import BowlIllustration from "@/components/marca/BowlIllustration";
import { useCartStore } from "@/stores/cart";
import type { CatalogBundle } from "@/types";

export default function BundleCard({ bundle }: { bundle: CatalogBundle }) {
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd() {
    addItem({
      kind: "bundle",
      id: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      detail: "Pack",
      unitPrice: bundle.price,
      maxStock: null,
    });
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-blanco-crema shadow-calida ring-1 ring-tinta/5">
      <div className="px-4 pt-4">
        <div
          className={`relative flex items-end justify-center overflow-hidden rounded-t-[10rem] rounded-b-2xl bg-amarillo/70 ${
            bundle.image_url ? "aspect-[7/8]" : "p-8"
          }`}
        >
          {bundle.image_url ? (
            // Foto real del pack (bundles.image_url); alt = nombre del pack
            // porque el esquema no tiene columna alt para bundles
            <Image
              src={bundle.image_url}
              alt={`Pack ${bundle.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <BowlIllustration
              primary="#C39A52"
              secondary="#5F3A26"
              className="h-auto w-2/3"
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-2xl font-semibold text-tinta">
          {bundle.name}
        </h3>
        <p className="text-cacao">{bundle.description}</p>
        {bundle.items.length > 0 && (
          <ul className="space-y-1 text-sm text-cacao">
            {bundle.items.map((item) => (
              <li key={`${item.name}-${item.size_label}`}>
                • {item.quantity} × {item.name} ({item.size_label})
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <PriceTag price={bundle.price} className="text-2xl" />
          <Button onClick={handleAdd}>
            <ShoppingBag className="size-5" aria-hidden />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </article>
  );
}

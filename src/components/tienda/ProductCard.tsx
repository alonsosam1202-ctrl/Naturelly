import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import BowlIllustration from "@/components/marca/BowlIllustration";
import { FLAVOR_ACCENTS, PRODUCT_BADGE_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { CatalogProduct } from "@/types";

/**
 * Tarjeta de producto "Cocina Moderna": arco de horno con el fondo vivo del
 * sabor, sticker rotado, bowl que crece al hover y barra de gradiente como
 * firma del sabor.
 */
export default function ProductCard({ product }: { product: CatalogProduct }) {
  const accent = FLAVOR_ACCENTS[product.category];
  const mainImage = product.images[0];
  const minPrice =
    product.variants.length > 0
      ? Math.min(...product.variants.map((variant) => variant.price))
      : null;
  const sizes = product.variants.map((variant) => variant.size_label).join(" · ");

  return (
    <Link
      href={`/producto/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl bg-blanco-crema shadow-calida ring-1 ring-tinta/5 transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[0.4deg] hover:shadow-calida-lg"
    >
      <div className="relative px-4 pt-4">
        {/* Arco de horno con el fondo pleno-pastel del sabor */}
        <div
          className={`relative flex aspect-[7/8] items-end justify-center overflow-hidden rounded-t-[10rem] rounded-b-2xl ${accent.archClass}`}
        >
          {mainImage ? (
            // Foto real de producto (misma paleta, arco como escenografía)
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <BowlIllustration
              primary={accent.primary}
              secondary={accent.secondary}
              className="mb-1 h-auto w-[88%] transition-transform duration-300 group-hover:-rotate-1 group-hover:scale-105"
            />
          )}
        </div>
        {/* Sticker del sabor, apenas rotado */}
        {product.badge && (
          <Badge
            className={`absolute left-6 top-8 -rotate-3 shadow-calida ${accent.badgeClass}`}
          >
            {PRODUCT_BADGE_LABELS[product.badge] ?? product.badge}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="font-display text-2xl font-semibold text-tinta">
          {product.name}
        </h3>
        <p className="flex-1 text-cacao">{product.tagline}</p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            {sizes && (
              <p className="text-xs font-bold uppercase tracking-wide text-cacao/70">
                {sizes}
              </p>
            )}
            {product.is_quote_only ? (
              <p className="mt-0.5 font-display text-lg font-semibold text-tinta">
                Solo por cotización
              </p>
            ) : (
              minPrice !== null && (
                <p className="mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-sm text-cacao">Desde</span>
                  <span className="font-display text-2xl font-semibold text-tinta">
                    {formatPrice(minPrice)}
                  </span>
                </p>
              )
            )}
          </div>
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amarillo-suave text-tinta transition-all duration-200 group-hover:bg-tinta group-hover:text-amarillo"
            aria-hidden
          >
            <ArrowRight className="size-5" />
          </span>
        </div>
      </div>

      {/* Firma de sabor */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent.gradientClass}`} />
    </Link>
  );
}

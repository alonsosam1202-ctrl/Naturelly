import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import PurchasePanel from "@/components/tienda/PurchasePanel";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import BowlIllustration from "@/components/marca/BowlIllustration";
import RotatingSeal from "@/components/marca/RotatingSeal";
import { getProductBySlug, getProducts } from "@/lib/catalog";
import { FLAVOR_ACCENTS, PRODUCT_BADGE_LABELS } from "@/lib/constants";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return { title: product.name, description: product.tagline };
}

export default async function ProductoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const mainImage = product.images[0];
  const accent = FLAVOR_ACCENTS[product.category];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div
          className={`relative flex aspect-square items-end justify-center overflow-hidden rounded-t-[12rem] rounded-b-3xl p-10 ${accent.archClass}`}
        >
          {mainImage ? (
            <Image
              src={mainImage.url}
              alt={mainImage.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <BowlIllustration
              primary={accent.primary}
              secondary={accent.secondary}
              className="h-auto w-4/5"
            />
          )}
          {/* En el ápice del arco: left/top en la esquina quedan fuera del
              radio de 12rem y el overflow-hidden recortaba la etiqueta */}
          {product.badge && (
            <Badge
              className={`absolute left-1/2 top-5 -translate-x-1/2 -rotate-3 whitespace-nowrap shadow-calida ${accent.badgeClass}`}
            >
              {PRODUCT_BADGE_LABELS[product.badge] ?? product.badge}
            </Badge>
          )}
          {/* Visible también en mobile, más pequeño; el SVG escala completo
              (texto incluido), así que no hace falta reducir el tracking */}
          <RotatingSeal
            pathId="seal-producto"
            className="absolute bottom-3 right-3 size-[76px] sm:bottom-4 sm:right-4 sm:size-24"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-lg text-cacao">{product.tagline}</p>
          </div>

          {product.is_quote_only ? (
            // Solo por cotización: sin precio, sin cantidad, sin carrito.
            // Disponibilidad, diseño y precio se coordinan por WhatsApp.
            <div className="flex flex-col gap-3 rounded-2xl bg-lavanda/30 p-5">
              <p className="font-bold text-tinta">Solo por cotización</p>
              <p className="text-cacao">
                Este producto se coordina directamente con Nelly: el tamaño,
                el diseño y el precio se conversan antes de confirmar tu
                pedido.
              </p>
              <div>
                <WhatsAppButton
                  message={`¡Hola! Vengo de la web de Naturelly y quiero cotizar: ${product.name}.`}
                  label="Cotizar por WhatsApp"
                />
              </div>
            </div>
          ) : (
            <PurchasePanel product={product} />
          )}

          <p className="text-cacao">{product.description}</p>

          {product.benefits.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {product.benefits.map((benefit) => (
                <li key={benefit}>
                  <Badge className="bg-salvia/15 text-salvia-oscura">{benefit}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {product.story && (
          <section className="rounded-2xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-2xl font-semibold text-tinta">
              Su historia
            </h2>
            <p className="mt-3 text-cacao">{product.story}</p>
          </section>
        )}
        {product.ingredients.length > 0 && (
          <section className="rounded-2xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-2xl font-semibold text-tinta">
              Ingredientes
            </h2>
            <ul className="mt-3 space-y-2">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient} className="flex items-center gap-3 text-tinta">
                  <span className="size-2 rounded-full bg-miel" aria-hidden />
                  {ingredient}
                </li>
              ))}
            </ul>
          </section>
        )}
        {product.allergens.length > 0 && (
          <section className="rounded-2xl bg-blanco-crema p-6 shadow-calida">
            <h2 className="font-display text-2xl font-semibold text-tinta">
              Alérgenos
            </h2>
            <p className="mt-3 text-sm text-cacao">
              Elaborado en una cocina casera donde se manipulan estos
              ingredientes:
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.allergens.map((allergen) => (
                <li key={allergen}>
                  <Badge className="bg-terracota/10 text-terracota">
                    {allergen}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

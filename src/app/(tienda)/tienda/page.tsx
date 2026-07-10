import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/tienda/ProductCard";
import CustomCakesSection from "@/components/marca/CustomCakesSection";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/constants";
import type { ProductCategory } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Delicias artesanales hechas por Nelly en Arequipa: granola artesanal, torta de zanahoria (carrot cake), torta de chocolate, torta de naranja, postres y cupcakes.",
};

const SELLOS = [
  "Hecho a mano",
  "Pedido hoy, listo mañana",
  "Entrega en toda Arequipa",
];

type SearchParams = Promise<{ categoria?: string }>;

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria } = await searchParams;
  const products = await getProducts();

  const isValidCategory = CATEGORIES.some((c) => c.value === categoria);
  const filtered = isValidCategory
    ? products.filter((p) => p.category === (categoria as ProductCategory))
    : products;
  const categoryLabel = isValidCategory
    ? CATEGORIES.find((c) => c.value === categoria)?.label
    : null;

  return (
    <>
      {/* Hero "Atmósfera" (spec Tinta & Oro): panel con el degradado de
          tinta + hairline dorado — nunca bloque plano. La foto (asset de
          Alonso, site-assets) vive DENTRO del panel con hairline crema;
          reemplazó al video de prueba el 2026-07-10. */}
      <div className="px-4 pt-6 sm:px-6">
        <section className="bg-atmosfera hairline-oro relative mx-auto max-w-6xl overflow-hidden rounded-xl">
          <div className="grid items-center gap-10 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:p-14">
            <div className="flex flex-col gap-5">
              <p className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.26em] text-oro">
                Tienda
                <span className="h-px w-14 bg-oro/50" aria-hidden />
              </p>
              <h1 className="font-display text-4xl font-semibold text-crema-clara sm:text-6xl">
                Elige tu <em className="italic text-oro">antojo</em>
              </h1>
              <p className="max-w-xl text-lg text-crema-clara/85">
                Delicias artesanales hechas a mano en la cocina de Nelly.
              </p>

              <div className="mt-1 flex flex-wrap gap-3">
                <ButtonLink href="/tienda?categoria=torta">
                  Ver tortas
                </ButtonLink>
                <a
                  href="#personalizadas"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-crema-clara/45 px-6 py-3 font-bold text-crema-clara transition-colors hover:border-oro hover:text-oro"
                >
                  Cotizar una torta personalizada
                </a>
              </div>

              {/* Sellos (pills) sobre el degradado — estilo de la spec */}
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {SELLOS.map((sello) => (
                  <li
                    key={sello}
                    className="sello-atmosfera rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em]"
                  >
                    {sello}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hairline-crema relative aspect-[4/5] overflow-hidden rounded-xl max-lg:mx-auto max-lg:w-full max-lg:max-w-sm">
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/site-assets/images/hero-tienda.png`}
                alt="Primer plano de delicias de Naturelly: torta de chocolate en capas, tartaleta de frutos rojos, cupcake y postre de chocolate"
                fill
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
                className="object-cover"
              />
            </div>
          </div>

          {/* Filtro por categoría OCULTO temporalmente: se restituye con el
              rediseño de la grilla (secciones por categoría). El filtrado
              por ?categoria= sigue funcionando (lo usa el CTA "Ver tortas")
              y abajo hay salida visible para volver al catálogo completo. */}
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {isValidCategory && (
          <p className="mb-6 flex flex-wrap items-center gap-3 text-piedra">
            Mostrando: <strong className="text-tinta">{categoryLabel}</strong>
            <Link
              href="/tienda"
              className="font-bold text-oro-texto underline-offset-4 hover:underline"
            >
              Ver todo el catálogo
            </Link>
          </p>
        )}

        {filtered.length === 0 ? (
          <p className="rounded-3xl bg-blanco-crema p-10 text-center text-cacao shadow-calida">
            Aún no hay productos disponibles por aquí. Vuelve pronto o
            escríbenos por WhatsApp para saber qué está preparando Nelly.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Se oculta sola mientras el WhatsApp del negocio sea placeholder */}
        <CustomCakesSection />
      </div>
    </>
  );
}

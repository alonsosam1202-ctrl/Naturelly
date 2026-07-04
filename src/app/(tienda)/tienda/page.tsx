import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/tienda/ProductCard";
import { getProducts } from "@/lib/catalog";
import { CATEGORIES, FLAVOR_ACCENTS } from "@/lib/constants";
import type { ProductCategory } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Todas nuestras granolas artesanales: clásicas, andinas y con chocolate. Hechas a mano en Arequipa.",
};

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

  return (
    <>
      {/* Cabecera editorial sobre lino */}
      <div className="bg-blush">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pb-10 pt-12 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
            Tienda
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-semibold text-tinta sm:text-5xl">
            Elige tu <em className="italic text-miel-oscura">sabor</em>
          </h1>
          <p className="max-w-xl text-lg text-cacao">
            Cada bolsa sale de una tanda pequeña, tostada a mano y endulzada
            solo con miel. Cada sabor tiene su propio color.
          </p>

          <nav
            className="mt-2 flex flex-wrap gap-2"
            aria-label="Filtrar por categoría"
          >
            <Link
              href="/tienda"
              className={`rounded-full border-2 px-5 py-2 font-bold transition-colors ${
                !isValidCategory
                  ? "border-tinta bg-tinta text-amarillo"
                  : "border-transparent bg-blanco-crema text-tinta shadow-calida hover:border-tinta"
              }`}
            >
              Todas
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                href={`/tienda?categoria=${category.value}`}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-2 font-bold transition-colors ${
                  categoria === category.value
                    ? "border-tinta bg-tinta text-amarillo"
                    : "border-transparent bg-blanco-crema text-tinta shadow-calida hover:border-tinta"
                }`}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: FLAVOR_ACCENTS[category.value].primary }}
                  aria-hidden
                />
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {filtered.length === 0 ? (
          <p className="rounded-3xl bg-blanco-crema p-10 text-center text-cacao shadow-calida">
            Aún no hay granolas en esta categoría. Vuelve pronto: cada semana
            sale una tanda nueva.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

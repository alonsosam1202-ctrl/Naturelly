import type { Metadata } from "next";
import ProductCard from "@/components/tienda/ProductCard";
import CustomCakesSection from "@/components/marca/CustomCakesSection";
import { getProducts } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/constants";
import type { ProductCategory } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Delicias artesanales hechas por Nelly en Arequipa: granola artesanal, torta de zanahoria (carrot cake), torta de chocolate y torta de naranja.",
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
            Elige tu <em className="italic text-miel-oscura">antojo</em>
          </h1>
          <p className="max-w-xl text-lg text-cacao">
            Delicias artesanales hechas a mano en la cocina de Nelly.
          </p>

          {/* Filtro por categoría OCULTO temporalmente: las categorías
              actuales de la BD ('clasica'|'andina'|'chocolate'|'especial')
              son sabores placeholder de granola que aún no existen como
              productos reales (Nelly tiene UNA receta validada). Se
              restituye cuando el catálogo real tenga categorías reales
              (granola / tortas), lo que requiere la migración propuesta en
              docs/LAUNCH_CHECKLIST.md. El filtrado por ?categoria= sigue
              funcionando para no romper enlaces. */}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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

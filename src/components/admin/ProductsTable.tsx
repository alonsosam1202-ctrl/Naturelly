import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import type { ProductCategory } from "@/types";

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  is_active: boolean;
  minPrice: number | null;
  totalStock: number;
  activeVariants: number;
  thumb: { url: string; alt: string } | null;
}

function categoryLabel(category: ProductCategory): string {
  return CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function StateBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="bg-salvia/20 text-salvia">Visible</Badge>
  ) : (
    <Badge className="bg-terracota/10 text-terracota">Desactivado</Badge>
  );
}

function Thumb({ thumb }: { thumb: AdminProductListItem["thumb"] }) {
  if (!thumb) {
    return (
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-amarillo/40 text-xs font-bold text-tinta">
        Sin foto
      </div>
    );
  }
  return (
    <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-crema">
      <Image src={thumb.url} alt={thumb.alt} fill sizes="56px" className="object-cover" />
    </div>
  );
}

/** Listado de productos mobile-first: cards en celular, tabla en desktop. */
export default function ProductsTable({
  products,
}: {
  products: AdminProductListItem[];
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-3xl bg-blanco-crema p-8 text-center text-cacao shadow-calida">
        Aún no hay productos. Crea el primero con el botón de arriba.
      </p>
    );
  }

  return (
    <>
      {/* Celular */}
      <ul className="space-y-3 md:hidden">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/admin/productos/${product.id}/editar`}
              className="flex items-center gap-4 rounded-3xl bg-blanco-crema p-4 shadow-calida active:bg-crema"
            >
              <Thumb thumb={product.thumb} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-tinta">{product.name}</p>
                <p className="text-sm text-cacao">
                  {categoryLabel(product.category)}
                  {product.minPrice !== null &&
                    ` · Desde ${formatPrice(product.minPrice)}`}
                </p>
                <p className="text-sm text-cacao">
                  Stock total: {product.totalStock}
                </p>
              </div>
              <StateBadge isActive={product.is_active} />
            </Link>
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-3xl bg-blanco-crema shadow-calida md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-amarillo-suave text-sm uppercase tracking-wide text-cacao">
              <th className="px-5 py-4">Producto</th>
              <th className="px-5 py-4">Categoría</th>
              <th className="px-5 py-4">Desde</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Presentaciones activas</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-amarillo-suave/50 last:border-0"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Thumb thumb={product.thumb} />
                    <span className="font-bold text-tinta">{product.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-cacao">
                  {categoryLabel(product.category)}
                </td>
                <td className="px-5 py-4 font-bold text-tinta">
                  {product.minPrice !== null ? formatPrice(product.minPrice) : "—"}
                </td>
                <td className="px-5 py-4 text-tinta">{product.totalStock}</td>
                <td className="px-5 py-4 text-tinta">{product.activeVariants}</td>
                <td className="px-5 py-4">
                  <StateBadge isActive={product.is_active} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="font-bold text-miel hover:text-miel-oscura"
                    >
                      Editar
                    </Link>
                    {product.is_active && (
                      <Link
                        href={`/producto/${product.slug}`}
                        target="_blank"
                        className="text-sm font-bold text-cacao hover:text-tinta"
                      >
                        Ver
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

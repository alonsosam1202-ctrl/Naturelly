import { ButtonLink } from "@/components/ui/Button";
import ProductsTable, {
  type AdminProductListItem,
} from "@/components/admin/ProductsTable";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, name, slug, category, is_active, sort_order, product_variants(price, stock, is_active), product_images(url, alt, position)"
    )
    .order("sort_order");

  const products: AdminProductListItem[] = (data ?? []).map((product) => {
    const variants = product.product_variants ?? [];
    const images = [...(product.product_images ?? [])].sort(
      (a, b) => a.position - b.position
    );
    const prices = variants.map((v) => Number(v.price));
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category as ProductCategory,
      is_active: product.is_active,
      minPrice: prices.length > 0 ? Math.min(...prices) : null,
      totalStock: variants.reduce((acc, v) => acc + v.stock, 0),
      activeVariants: variants.filter((v) => v.is_active).length,
      thumb: images[0] ? { url: images[0].url, alt: images[0].alt } : null,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-tinta">
          Productos
        </h1>
        <ButtonLink href="/admin/productos/nuevo">Nuevo producto</ButtonLink>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}

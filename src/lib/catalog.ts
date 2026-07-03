import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, isSupabaseConfigured } from "./supabase/config";
import type { Database } from "@/types/database";
import { PLACEHOLDER_BUNDLES, PLACEHOLDER_PRODUCTS } from "./placeholder-catalog";
import type { CatalogBundle, CatalogProduct } from "@/types";

/**
 * Acceso al catálogo público. Si Supabase está configurado consulta la BD
 * (publishable key + RLS: solo filas activas); si no, usa el catálogo placeholder
 * para que la web sea navegable durante el desarrollo.
 *
 * Se usa un cliente sin cookies a propósito: el catálogo es público y así
 * las páginas pueden seguir siendo estáticas/revalidables.
 */
function createPublicClient() {
  const env = getSupabasePublicEnv();
  if (!env) throw new Error("Supabase no está configurado.");
  return createClient<Database>(env.url, env.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  story: string | null;
  ingredients: string[] | null;
  benefits: string[] | null;
  category: CatalogProduct["category"];
  badge: CatalogProduct["badge"];
  sort_order: number;
  product_variants: CatalogProduct["variants"] | null;
  product_images: CatalogProduct["images"] | null;
}

function mapProduct(row: ProductRow): CatalogProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    story: row.story ?? "",
    ingredients: row.ingredients ?? [],
    benefits: row.benefits ?? [],
    category: row.category,
    badge: row.badge,
    sort_order: row.sort_order,
    variants: (row.product_variants ?? [])
      .filter((variant) => variant.is_active)
      .sort((a, b) => a.weight_grams - b.weight_grams),
    images: (row.product_images ?? []).sort((a, b) => a.position - b.position),
  };
}

export async function getProducts(): Promise<CatalogProduct[]> {
  if (!isSupabaseConfigured()) return PLACEHOLDER_PRODUCTS;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*)")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    console.error("Error cargando productos:", error.message);
    return [];
  }
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<CatalogProduct | null> {
  if (!isSupabaseConfigured()) {
    return PLACEHOLDER_PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*), product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error cargando producto:", error.message);
    return null;
  }
  return data ? mapProduct(data as unknown as ProductRow) : null;
}

interface BundleRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  bundle_items:
    | {
        quantity: number;
        product_variants: {
          size_label: string;
          products: { name: string } | null;
        } | null;
      }[]
    | null;
}

export async function getBundles(): Promise<CatalogBundle[]> {
  if (!isSupabaseConfigured()) return PLACEHOLDER_BUNDLES;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("bundles")
    .select(
      "*, bundle_items(quantity, product_variants(size_label, products(name)))"
    )
    .eq("is_active", true);

  if (error) {
    console.error("Error cargando packs:", error.message);
    return [];
  }
  return (data as unknown as BundleRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    price: row.price,
    image_url: row.image_url,
    items: (row.bundle_items ?? []).map((item) => ({
      name: item.product_variants?.products?.name ?? "Producto",
      size_label: item.product_variants?.size_label ?? "",
      quantity: item.quantity,
    })),
  }));
}

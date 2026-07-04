import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/config";
import { PLACEHOLDER_PRODUCTS } from "@/lib/placeholder-catalog";

// Sin hardcodear localhost: la URL provisional de Render es el fallback
const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naturelly.onrender.com";

// Solo páginas públicas: nunca carrito, checkout, pedidos, login,
// recuperación, auth ni admin. Los packs no tienen página individual
// (solo el listado /packs), así que no se agregan entradas por pack.
const STATIC_PATHS: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/tienda", priority: 0.9 },
  { path: "/packs", priority: 0.8 },
  { path: "/nosotros", priority: 0.6 },
  { path: "/recetas", priority: 0.4 },
  { path: "/faq", priority: 0.5 },
  { path: "/contacto", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${BASE}${entry.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: entry.priority,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  const env = getSupabasePublicEnv();
  if (env) {
    // Si Supabase no responde, el sitemap sale sin productos pero el
    // build/respuesta nunca se rompe.
    try {
      const supabase = createClient(env.url, env.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data } = await supabase
        .from("products")
        .select("slug, updated_at")
        .eq("is_active", true);
      productEntries = (data ?? []).map((product) => ({
        url: `${BASE}/producto/${product.slug}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    } catch (error) {
      console.error("sitemap: no se pudo leer el catálogo", error);
    }
  } else {
    // Modo placeholder (sin Supabase configurado): los mismos slugs que ve la web
    productEntries = PLACEHOLDER_PRODUCTS.map((product) => ({
      url: `${BASE}/producto/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  }

  return [...staticEntries, ...productEntries];
}

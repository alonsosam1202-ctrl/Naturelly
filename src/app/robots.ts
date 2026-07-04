import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://naturelly.onrender.com";

/**
 * robots.txt NO es seguridad: /admin, /auth y /api están protegidos por
 * sesión/rol en servidor y RLS. Aquí solo se evita el rastreo de rutas
 * privadas. Las demás páginas no indexables (carrito, checkout, pedido,
 * login, recuperación) quedan RASTREABLES a propósito para que el crawler
 * pueda leer su metadata `noindex`.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin", "/api/", "/auth/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}

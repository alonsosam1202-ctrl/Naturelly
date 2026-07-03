import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";

/**
 * Cliente para Server Components y Route Handlers con sesión del usuario
 * (cookies). Usa la publishable key + RLS; para operaciones privilegiadas
 * ver `admin.ts`.
 */
export async function createSupabaseServerClient() {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase no está configurado. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local."
    );
  }
  const cookieStore = await cookies();
  return createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignorado: los Server Components no pueden escribir cookies;
          // el middleware refrescará la sesión cuando exista auth.
        }
      },
    },
  });
}

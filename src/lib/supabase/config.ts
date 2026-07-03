/**
 * Chequeos de configuración. La web debe funcionar en modo "catálogo
 * placeholder" mientras el proyecto de Supabase no exista todavía.
 *
 * Sistema moderno de claves de Supabase:
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_...): clientes
 *   públicos, siempre bajo RLS.
 * - SUPABASE_SECRET_KEY (sb_secret_...): SOLO servidor, salta RLS.
 *   Nunca con prefijo NEXT_PUBLIC_, nunca en componentes cliente, logs
 *   ni respuestas de API.
 */

export function getSupabasePublicEnv(): {
  url: string;
  publishableKey: string;
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}

/** Solo tiene sentido llamarlo desde código de servidor. */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SECRET_KEY);
}

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";

/** Cliente para componentes cliente. Usa exclusivamente la anon key + RLS. */
export function createClient() {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase no está configurado. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local."
    );
  }
  return createBrowserClient(env.url, env.anonKey);
}

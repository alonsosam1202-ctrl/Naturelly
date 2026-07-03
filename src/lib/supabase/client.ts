import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./config";
import type { Database } from "@/types/database";

/** Cliente para componentes cliente. Usa exclusivamente la publishable key + RLS. */
export function createClient() {
  const env = getSupabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase no está configurado. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.local."
    );
  }
  return createBrowserClient<Database>(env.url, env.publishableKey);
}

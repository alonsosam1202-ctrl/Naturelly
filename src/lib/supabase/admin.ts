import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./config";

/**
 * Cliente con service role. SOLO para Route Handlers / Server Actions.
 * La service role key salta RLS: jamás importar desde un componente cliente.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() no puede usarse en el navegador.");
  }
  const env = getSupabasePublicEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !serviceRoleKey) {
    throw new Error(
      "Supabase (service role) no está configurado. Completa SUPABASE_SERVICE_ROLE_KEY en .env.local."
    );
  }
  return createClient(env.url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

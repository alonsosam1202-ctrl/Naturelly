import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "./config";
import type { Database } from "@/types/database";

/**
 * Cliente privilegiado con la SECRET KEY. SOLO para Route Handlers /
 * Server Actions. La secret key salta RLS (equivale al rol service_role):
 * jamás importar desde un componente cliente, jamás loguearla ni
 * devolverla en una respuesta de API.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient() no puede usarse en el navegador.");
  }
  const env = getSupabasePublicEnv();
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!env || !secretKey) {
    throw new Error(
      "Supabase (secret key) no está configurado. Completa SUPABASE_SECRET_KEY en .env.local."
    );
  }
  return createClient<Database>(env.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

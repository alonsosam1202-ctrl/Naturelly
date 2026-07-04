import { createSupabaseServerClient } from "./server";

/**
 * Verificación explícita de sesión + rol admin para server actions del
 * panel. Devuelve el cliente de SESIÓN (publishable key + cookies): la
 * autorización final la siguen haciendo RLS y las RPC — nunca se usa la
 * secret key como sustituto de esta verificación.
 */
export async function getAdminSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return null;

  return { supabase, user };
}

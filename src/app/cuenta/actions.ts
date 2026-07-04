"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations/auth";

export type ProfileActionResult = { ok: boolean; message: string };

/**
 * Actualiza el perfil del usuario autenticado.
 * - Identidad desde la SESIÓN del servidor (getUser), nunca del cliente.
 * - Whitelist estricta: SOLO full_name y phone. role/id/created_at no se
 *   tocan; updated_at lo asigna el trigger; el correo vive en Supabase Auth.
 * - Se usa el cliente de sesión (RLS: solo su propia fila), jamás la
 *   secret key.
 */
export async function updateProfile(
  input: unknown
): Promise<ProfileActionResult> {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Revisa los datos.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, message: "Tu sesión expiró. Vuelve a iniciar sesión." };
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !updated) {
    console.error("actualizar perfil falló:", error?.message);
    return { ok: false, message: "No se pudieron guardar tus datos. Inténtalo de nuevo." };
  }

  revalidatePath("/cuenta");
  return { ok: true, message: "¡Datos guardados!" };
}

import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Callback de autenticación (PKCE): intercambia el `code` de OAuth o de los
 * enlaces de correo por una sesión en cookies. También acepta
 * `token_hash` + `type` para ser robusto ante la plantilla de correo.
 *
 * Destinos:
 * - `next` (solo rutas internas) — la recuperación usa /actualizar-contrasena.
 * - Sin `next` (p. ej. Google) — /admin: el layout del panel decide por rol
 *   (admin → panel; no-admin → "Acceso denegado" con cierre de sesión).
 *   El rol JAMÁS se otorga por proveedor, correo o dominio.
 * - Cualquier error → /login?error=enlace, sin exponer detalles internos.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=enlace`);
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  // Solo rutas internas (evita open redirect)
  const safeNext =
    next && next.startsWith("/") && !next.startsWith("//") ? next : null;

  const supabase = await createSupabaseServerClient();
  let authenticated = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authenticated = !error;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authenticated = !error;
  }

  if (!authenticated) {
    return NextResponse.redirect(`${origin}/login?error=enlace`);
  }

  return NextResponse.redirect(`${origin}${safeNext ?? "/admin"}`);
}

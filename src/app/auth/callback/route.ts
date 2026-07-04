import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Origen confiable para las redirecciones absolutas del callback.
 *
 * Detrás del proxy de Render, `request.url` apunta al puerto interno
 * (http://localhost:10000), así que NUNCA se usa para construir la
 * redirección final: se usa NEXT_PUBLIC_SITE_URL. El origen de la petición
 * queda únicamente como fallback de desarrollo cuando la variable no está
 * configurada, jamás con prioridad sobre ella.
 */
function getRedirectBase(requestOrigin: string): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const base = configured || requestOrigin;
  // Sin barras finales duplicadas al concatenar rutas
  return base.replace(/\/+$/, "");
}

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
  const { searchParams, origin: requestOrigin } = new URL(request.url);
  const base = getRedirectBase(requestOrigin);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${base}/login?error=enlace`);
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");
  // Solo rutas internas: debe empezar con "/", nunca con "//" ni ser un
  // dominio externo (evita open redirect)
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
    return NextResponse.redirect(`${base}/login?error=enlace`);
  }

  return NextResponse.redirect(`${base}${safeNext ?? "/admin"}`);
}

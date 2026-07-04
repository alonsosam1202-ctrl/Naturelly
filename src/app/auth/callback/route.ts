import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { homePathForRole, sanitizeNextPath } from "@/lib/auth-redirect";

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
 * enlaces de correo (confirmación de registro y recuperación) por una
 * sesión en cookies. También acepta `token_hash` + `type`.
 *
 * Destinos:
 * - `next` interno válido (sanitizado) — recuperación usa
 *   /actualizar-contrasena; la confirmación de registro usa /cuenta.
 * - Sin `next` — POR ROL: admin → /admin, customer → /cuenta. El rol se lee
 *   del profile propio (RLS) y JAMÁS se otorga por proveedor/correo/dominio.
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
  const safeNext = sanitizeNextPath(searchParams.get("next"));

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

  if (safeNext) {
    return NextResponse.redirect(`${base}${safeNext}`);
  }

  // Sin next: destino por rol (verificado en servidor contra la BD)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role ?? null;
  }

  return NextResponse.redirect(`${base}${homePathForRole(role)}`);
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/supabase/config";

/**
 * Protege /admin/**: refresca la sesión (cookies) y redirige a /login si no
 * hay usuario. Es solo la primera barrera: la autorización real (sesión +
 * role = admin) se verifica de nuevo server-side en app/admin/layout.tsx y
 * dentro de la RPC set_order_status.
 */
export async function middleware(request: NextRequest) {
  const env = getSupabasePublicEnv();
  if (!env) {
    // Sin Supabase configurado no existe el panel
    return NextResponse.redirect(new URL("/", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[]
      ) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

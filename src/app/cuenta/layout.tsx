import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

/**
 * Guardián server-side del área del cliente: además del middleware, toda
 * página bajo /cuenta verifica aquí la sesión. Los admin se redirigen a su
 * panel (comportamiento aprobado); la lectura de datos queda protegida por
 * RLS con la sesión del propio usuario.
 */
export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/cuenta");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-blanco-crema px-5 py-4 shadow-calida">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
            Mi cuenta
          </p>
          <p className="font-display text-xl font-semibold text-tinta">
            Hola{profile?.full_name ? `, ${profile.full_name}` : ""}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2" aria-label="Cuenta">
          <Link
            href="/cuenta"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Mis datos
          </Link>
          <Link
            href="/cuenta/pedidos"
            className="rounded-full px-4 py-2 font-bold text-tinta hover:bg-amarillo-suave"
          >
            Mis pedidos
          </Link>
          <LogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}

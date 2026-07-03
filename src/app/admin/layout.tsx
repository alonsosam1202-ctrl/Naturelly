import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import AccessDenied from "@/components/admin/AccessDenied";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false },
};

/**
 * Guardián server-side del panel: además del middleware, TODA página bajo
 * /admin verifica aquí sesión + role = 'admin' contra la BD. Nunca se
 * confía solo en el middleware ni en controles visuales.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-dvh">
      <AdminHeader name={profile.full_name} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}

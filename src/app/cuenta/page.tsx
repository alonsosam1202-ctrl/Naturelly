import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/cuenta/ProfileForm";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function CuentaPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El layout ya garantiza sesión; esto es solo para tipado
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <section className="flex flex-col gap-4 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h1 className="font-display text-2xl font-semibold text-tinta">
          Mis datos
        </h1>
        <p className="text-cacao">
          Correo: <span className="font-bold text-tinta">{user.email}</span>
        </p>
        <ProfileForm
          initialFullName={profile?.full_name ?? ""}
          initialPhone={profile?.phone ?? ""}
        />
        <p className="text-sm text-cacao">
          ¿Quieres cambiar tu contraseña?{" "}
          <Link
            href="/recuperar"
            className="font-bold text-miel-oscura hover:text-tinta"
          >
            Solicítalo aquí
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="font-display text-2xl font-semibold text-tinta">
          Mis pedidos
        </h2>
        <p className="text-cacao">
          Revisa el estado de tus pedidos y su historial completo.
        </p>
        <ButtonLink href="/cuenta/pedidos" className="w-full sm:w-fit">
          Ver mis pedidos
        </ButtonLink>
      </section>
    </div>
  );
}

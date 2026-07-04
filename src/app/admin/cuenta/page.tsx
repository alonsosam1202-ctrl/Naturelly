import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCuentaPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-tinta">
          Mi cuenta
        </h1>
        {user?.email && (
          <p className="mt-1 text-cacao">Sesión iniciada como {user.email}</p>
        )}
      </div>
      <section className="rounded-3xl bg-blanco-crema p-6 shadow-calida">
        <h2 className="mb-4 font-display text-xl font-semibold text-tinta">
          Cambiar contraseña
        </h2>
        <UpdatePasswordForm successHref="/admin" successLabel="Volver al panel" />
      </section>
    </div>
  );
}

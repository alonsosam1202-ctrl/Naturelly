import type { Metadata } from "next";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false },
};

export default function ActualizarContrasenaPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
          Naturelly
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-tinta">
          Crea tu contraseña nueva
        </h1>
      </div>
      <div className="rounded-3xl bg-blanco-crema p-6 shadow-calida sm:p-8">
        <UpdatePasswordForm checkSession />
      </div>
    </div>
  );
}

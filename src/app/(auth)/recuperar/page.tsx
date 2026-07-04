import type { Metadata } from "next";
import Link from "next/link";
import RecoverForm from "@/components/auth/RecoverForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false },
};

export default function RecuperarPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
          Naturelly
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-tinta">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-cacao">
          Escribe tu correo y te enviaremos un enlace para crear una
          contraseña nueva.
        </p>
      </div>
      <div className="rounded-3xl bg-blanco-crema p-6 shadow-calida sm:p-8">
        <RecoverForm />
      </div>
      <p className="text-center">
        <Link href="/login" className="font-bold text-miel-oscura hover:text-tinta">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}

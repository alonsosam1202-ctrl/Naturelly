import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default function RegistroPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel-oscura">
          Naturelly
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-tinta">
          Crear cuenta
        </h1>
        <p className="mt-2 text-cacao">
          Guarda tus datos y revisa el estado de tus pedidos.
        </p>
      </div>
      <div className="rounded-3xl bg-blanco-crema p-6 shadow-calida sm:p-8">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}

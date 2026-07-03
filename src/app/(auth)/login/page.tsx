import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel">
          Naturelly
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-tinta">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-cacao">
          Ingresa con tu correo y contraseña.
        </p>
      </div>
      <div className="rounded-3xl bg-blanco-crema p-6 shadow-calida sm:p-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

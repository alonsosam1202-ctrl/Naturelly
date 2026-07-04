"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

/** Logo "G" de Google en SVG inline (sin librerías nuevas). */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.86-3c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28a7.2 7.2 0 0 1 0-4.56V6.63H1.29a12.01 12.01 0 0 0 0 10.74l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.59 1.79l3.43-3.43C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.29 6.63l3.98 3.09C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

// El botón de Google queda oculto hasta configurar el OAuth Client
// (Google Auth Platform + provider en Supabase). El código OAuth se conserva.
const GOOGLE_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Solo rutas internas (evita open redirect)
  const redirectParam = searchParams.get("redirect");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
      ? redirectParam
      : "/admin";

  // Enlace de recuperación/OAuth inválido o vencido (desde /auth/callback)
  const linkError = searchParams.get("error") === "enlace";

  async function onSubmit(values: LoginValues) {
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        // Mensaje genérico: no revelar si el correo existe o no
        setErrorMessage("Correo o contraseña incorrectos.");
        return;
      }
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
    }
  }

  async function handleGoogle() {
    setErrorMessage(null);
    setGooglePending(true);
    try {
      const supabase = createClient();
      // PKCE: /auth/callback intercambia el code; el rol lo decide el
      // servidor (layout del panel + RLS), nunca el proveedor.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setErrorMessage("No se pudo iniciar sesión con Google. Inténtalo de nuevo.");
        setGooglePending(false);
      }
      // Si no hay error, el navegador redirige a Google
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
      setGooglePending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {linkError && (
        <p
          role="alert"
          className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota"
        >
          El enlace no es válido o ya venció. Inicia sesión o pide uno nuevo
          en &quot;¿Olvidaste tu contraseña?&quot;.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <div className="flex flex-col gap-1.5">
          <Input
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Link
            href="/recuperar"
            className="self-end text-sm font-bold text-miel-oscura hover:text-tinta"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota"
          >
            {errorMessage}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting || googlePending} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Ingresando…
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </form>

      {GOOGLE_AUTH_ENABLED && (
        <>
          <div className="flex items-center gap-3" aria-hidden>
            <span className="h-px flex-1 bg-amarillo-suave" />
            <span className="text-sm font-bold text-cacao">o</span>
            <span className="h-px flex-1 bg-amarillo-suave" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting || googlePending}
            className="inline-flex w-full items-center justify-center gap-3 rounded-full border-2 border-tinta bg-blanco-crema px-6 py-3 font-bold text-tinta transition-all hover:-translate-y-0.5 hover:shadow-calida disabled:opacity-50"
          >
            {googlePending ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : (
              <GoogleIcon />
            )}
            Continuar con Google
          </button>
        </>
      )}
    </div>
  );
}

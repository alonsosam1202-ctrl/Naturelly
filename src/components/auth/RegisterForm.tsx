"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ResendConfirmation from "@/components/auth/ResendConfirmation";
import { registerSchema, type RegisterValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { sanitizeNextPath } from "@/lib/auth-redirect";

const GOOGLE_AUTH_ENABLED =
  process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";

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

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"form" | "check-email">("form");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  const safeNext = sanitizeNextPath(searchParams.get("next"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterValues) {
    setErrorMessage(null);
    try {
      const supabase = createClient();
      // El enlace de confirmación pasa por /auth/callback (redirect URL
      // aprobada) y termina en /cuenta salvo que exista un next interno
      const emailRedirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(
        safeNext ?? "/cuenta"
      )}`;
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // handle_new_user copia full_name al profile
          data: { full_name: values.fullName },
          emailRedirectTo,
        },
      });
      if (error) {
        // Sin revelar si el correo ya existe
        setErrorMessage(
          error.message.toLowerCase().includes("password")
            ? "La contraseña no cumple los requisitos. Revisa las indicaciones."
            : "No pudimos crear tu cuenta en este momento. Inténtalo de nuevo o inicia sesión si ya tienes una."
        );
        return;
      }
      // Con confirmación de correo activa, session llega null: NUNCA se
      // simula sesión. (Para correos ya registrados Supabase responde
      // igual, así que este mensaje tampoco revela existencia.)
      if (!data.session) {
        setSubmittedEmail(values.email);
        setPhase("check-email");
        return;
      }
      // Confirmación desactivada (no es el caso actual): sesión real
      location.assign(safeNext ?? "/cuenta");
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
      const callback = `${location.origin}/auth/callback${
        safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""
      }`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: callback },
      });
      if (error) {
        setErrorMessage("No se pudo continuar con Google. Inténtalo de nuevo.");
        setGooglePending(false);
      }
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
      setGooglePending(false);
    }
  }

  if (phase === "check-email") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl bg-salvia/15 p-6 text-center">
          <p className="font-display text-xl font-semibold text-salvia-oscura">
            Revisa tu correo
          </p>
          <p className="mt-2 text-cacao">
            Te enviamos un enlace para confirmar tu cuenta. Si no llega en
            unos minutos, revisa el spam.
          </p>
        </div>
        <ResendConfirmation defaultEmail={submittedEmail} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        <Input
          label="Tu nombre"
          autoComplete="name"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <Input
          label="Correo"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          hint="Mínimo 8 caracteres, con al menos una letra y un número."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />

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
              Creando tu cuenta…
            </>
          ) : (
            "Crear cuenta"
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

      <p className="text-center text-cacao">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={`/login${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ""}`}
          className="font-bold text-miel-oscura hover:text-tinta"
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}

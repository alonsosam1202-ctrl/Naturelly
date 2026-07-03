"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginSchema, type LoginValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota"
        >
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Ingresando…
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>
      {/* TODO (bloque Cuentas): página /recuperar para restablecer contraseña */}
    </form>
  );
}

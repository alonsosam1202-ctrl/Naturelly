"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  updatePasswordSchema,
  type UpdatePasswordValues,
} from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

type UpdatePasswordFormProps = {
  /**
   * true en /actualizar-contrasena (la sesión viene del enlace del correo y
   * puede no existir si el enlace venció); false dentro del panel, donde el
   * layout ya garantiza sesión.
   */
  checkSession?: boolean;
  /** A dónde invitar al usuario después del cambio. */
  successHref?: string;
  successLabel?: string;
};

export default function UpdatePasswordForm({
  checkSession = false,
  successHref = "/login",
  successLabel = "Ir a iniciar sesión",
}: UpdatePasswordFormProps) {
  const [phase, setPhase] = useState<
    "checking" | "ready" | "no-session" | "done"
  >(checkSession ? "checking" : "ready");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
  });

  useEffect(() => {
    if (!checkSession) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!cancelled) setPhase(user ? "ready" : "no-session");
      } catch {
        if (!cancelled) setPhase("no-session");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [checkSession]);

  async function onSubmit(values: UpdatePasswordValues) {
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("different")) {
          setErrorMessage(
            "La contraseña nueva debe ser diferente a la anterior."
          );
        } else if (error.message.toLowerCase().includes("session")) {
          setPhase("no-session");
        } else {
          setErrorMessage("No se pudo guardar la contraseña. Inténtalo de nuevo.");
        }
        return;
      }
      setPhase("done");
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
    }
  }

  if (phase === "checking") {
    return (
      <p className="flex items-center gap-2 text-cacao">
        <Loader2 className="size-5 animate-spin" aria-hidden />
        Verificando tu enlace…
      </p>
    );
  }

  if (phase === "no-session") {
    return (
      <div className="rounded-2xl bg-terracota/10 p-6 text-center">
        <p className="font-bold text-terracota">
          El enlace no es válido o ya venció.
        </p>
        <p className="mt-2 text-cacao">
          Los enlaces duran poco tiempo y deben abrirse en el mismo navegador
          donde pediste la recuperación.
        </p>
        <Link
          href="/recuperar"
          className="mt-4 inline-block font-bold text-miel-oscura hover:text-tinta"
        >
          Pedir un enlace nuevo
        </Link>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="rounded-2xl bg-salvia/15 p-6 text-center">
        <p className="font-display text-xl font-semibold text-salvia-oscura">
          ¡Contraseña actualizada!
        </p>
        <p className="mt-2 text-cacao">
          Ya puedes usar tu contraseña nueva.
        </p>
        <Link
          href={successHref}
          className="mt-4 inline-block font-bold text-miel-oscura hover:text-tinta"
        >
          {successLabel}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Contraseña nueva"
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

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Guardando…
          </>
        ) : (
          "Guardar contraseña nueva"
        )}
      </Button>
    </form>
  );
}

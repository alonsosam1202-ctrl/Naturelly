"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { recoverSchema, type RecoverValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

export default function RecoverForm() {
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverValues>({ resolver: zodResolver(recoverSchema) });

  async function onSubmit(values: RecoverValues) {
    setErrorMessage(null);
    try {
      const supabase = createClient();
      // El resultado SIEMPRE es genérico: no se revela si el correo existe.
      await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${location.origin}/auth/callback?next=/actualizar-contrasena`,
      });
      setSent(true);
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-salvia/15 p-6 text-center">
        <p className="font-display text-xl font-semibold text-salvia">
          Revisa tu correo
        </p>
        <p className="mt-2 text-cacao">
          Si existe una cuenta con ese correo, te enviamos un enlace para
          crear una contraseña nueva. Ábrelo en este mismo navegador. Si no
          llega en unos minutos, revisa el spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Tu correo"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
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
            Enviando…
          </>
        ) : (
          "Enviarme el enlace"
        )}
      </Button>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { recoverSchema, type RecoverValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

/** Espera entre reenvíos (Supabase además aplica su propio límite de 60 s). */
const COOLDOWN_SECONDS = 60;

/**
 * Formulario para reenviar el correo de confirmación de registro
 * (`supabase.auth.resend` con type "signup"). La respuesta es SIEMPRE la
 * misma: no revela si el correo existe ni si la cuenta ya está confirmada.
 */
export default function ResendConfirmation({
  defaultEmail = "",
}: {
  defaultEmail?: string;
}) {
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoverValues>({
    resolver: zodResolver(recoverSchema),
    defaultValues: { email: defaultEmail },
  });

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  async function onSubmit(values: RecoverValues) {
    setErrorMessage(null);
    try {
      const supabase = createClient();
      // Mismo callback aprobado que usa el registro. `location.origin` es
      // correcto en local y producción porque esto corre en el navegador.
      const emailRedirectTo = `${location.origin}/auth/callback?next=${encodeURIComponent(
        "/cuenta"
      )}`;
      await supabase.auth.resend({
        type: "signup",
        email: values.email,
        options: { emailRedirectTo },
      });
      // Respuesta genérica también cuando GoTrue devuelve 4xx (cuenta ya
      // confirmada, correo inexistente o límite de envío): mostrar esos
      // errores revelaría la existencia o el estado de la cuenta.
      setSent(true);
      setCooldown(COOLDOWN_SECONDS);
    } catch {
      setErrorMessage(
        "No pudimos conectarnos en este momento. Inténtalo de nuevo."
      );
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {sent && (
        <p
          role="status"
          aria-live="polite"
          className="rounded-2xl bg-salvia/15 px-4 py-3 font-bold text-salvia-oscura"
        >
          Si tu correo está registrado y aún no está confirmado, te enviamos
          un nuevo enlace. Revisa también el spam.
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
        noValidate
      >
        <Input
          label="Correo"
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

        <Button
          type="submit"
          variant="secondary"
          disabled={isSubmitting || cooldown > 0}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden />
              Enviando…
            </>
          ) : cooldown > 0 ? (
            `Podrás pedir otro enlace en ${cooldown} s`
          ) : (
            "Reenviar correo de confirmación"
          )}
        </Button>
      </form>
    </div>
  );
}

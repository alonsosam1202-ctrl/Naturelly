"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(values: ContactFormValues) {
    setStatus("idle");
    setErrorMessage(null);

    const response = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data: { error?: string } = await response.json().catch(() => ({}));
      setErrorMessage(
        data.error ?? "No pudimos enviar tu mensaje. Inténtalo de nuevo."
      );
      setStatus("error");
      return;
    }

    reset();
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-salvia/15 p-6 text-center">
        <p className="font-display text-xl font-semibold text-salvia-oscura">
          ¡Mensaje enviado!
        </p>
        <p className="mt-2 text-cacao">
          Gracias por escribirnos. Te responderemos al toque.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Tu nombre"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Tu correo"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Tu celular (opcional)"
        type="tel"
        inputMode="numeric"
        placeholder="9XXXXXXXX"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Textarea
        label="Tu mensaje"
        placeholder="Cuéntanos en qué te podemos ayudar"
        error={errors.message?.message}
        {...register("message")}
      />

      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl bg-terracota/10 px-4 py-3 font-bold text-terracota"
        >
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Enviando…
          </>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  );
}

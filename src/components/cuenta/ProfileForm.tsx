"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { profileSchema, type ProfileValues } from "@/lib/validations/auth";
import {
  updateProfile,
  type ProfileActionResult,
} from "@/app/cuenta/actions";

type ProfileFormProps = {
  initialFullName: string;
  initialPhone: string;
};

/** Edición de datos básicos: SOLO nombre y celular (whitelist en servidor). */
export default function ProfileForm({
  initialFullName,
  initialPhone,
}: ProfileFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<ProfileActionResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: initialFullName, phone: initialPhone },
  });

  async function onSubmit(values: ProfileValues) {
    setResult(null);
    const response = await updateProfile(values);
    setResult(response);
    if (response.ok) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
      <Input
        label="Tu nombre"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label="Tu celular (opcional)"
        type="tel"
        inputMode="numeric"
        placeholder="9XXXXXXXX"
        hint="Lo usamos para precargar tus datos en el checkout."
        error={errors.phone?.message}
        {...register("phone")}
      />

      {result && (
        <p
          role="status"
          className={`rounded-2xl px-4 py-3 font-bold ${
            result.ok
              ? "bg-salvia/15 text-salvia-oscura"
              : "bg-terracota/10 text-terracota"
          }`}
        >
          {result.message}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">
        {isSubmitting ? (
          <>
            <Loader2 className="size-5 animate-spin" aria-hidden />
            Guardando…
          </>
        ) : (
          "Guardar datos"
        )}
      </Button>
    </form>
  );
}

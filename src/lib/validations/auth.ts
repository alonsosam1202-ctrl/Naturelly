import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const recoverSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
});

export type RecoverValues = z.infer<typeof recoverSchema>;

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Usa al menos 8 caracteres")
      .regex(/[A-Za-zÀ-ÿ]/, "Incluye al menos una letra")
      .regex(/\d/, "Incluye al menos un número"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

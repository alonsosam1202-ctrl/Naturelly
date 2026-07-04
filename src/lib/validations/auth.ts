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

const passwordField = z
  .string()
  .min(8, "Usa al menos 8 caracteres")
  .regex(/[A-Za-zÀ-ÿ]/, "Incluye al menos una letra")
  .regex(/\d/, "Incluye al menos un número");

export const updatePasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Cuéntanos tu nombre")
      .max(80, "El nombre es muy largo"),
    email: z.string().trim().email("Ingresa un correo válido"),
    password: passwordField,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    path: ["confirm"],
    message: "Las contraseñas no coinciden",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

/** Campos del perfil que el cliente SÍ puede editar (whitelist). */
export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Cuéntanos tu nombre")
    .max(80, "El nombre es muy largo"),
  phone: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, "Ingresa un celular válido de 9 dígitos")
    .optional()
    .or(z.literal("")),
});

export type ProfileValues = z.infer<typeof profileSchema>;

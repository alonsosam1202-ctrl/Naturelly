import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Cuéntanos tu nombre"),
  email: z.string().trim().email("Ingresa un correo válido"),
  phone: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, "Ingresa un celular válido de 9 dígitos")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más (mínimo 10 caracteres)")
    .max(1000, "El mensaje es muy largo (máximo 1000 caracteres)"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

import { z } from "zod";

/**
 * Esquemas del CRUD de packs (bundles). El MISMO esquema valida el
 * formulario y la server action. Solo campos que existen en
 * DATABASE_SCHEMA.md: los packs no tienen compare_at_price, badge ni orden
 * de ítems (documentado). El precio del pack es fijo (lo define Nelly) y
 * SIEMPRE se valida/lee en servidor: la suma y el ahorro del formulario son
 * solo informativos.
 */

export const bundleItemSchema = z.object({
  variantId: z.string().uuid("Elige un producto válido"),
  quantity: z
    .number({ invalid_type_error: "Ingresa la cantidad" })
    .int("Solo números enteros")
    .min(1, "La cantidad mínima es 1")
    .max(50, "Cantidad demasiado grande"),
});

export const bundleFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z
      .string()
      .trim()
      .min(2, "El nombre es muy corto")
      .max(80, "El nombre es muy largo"),
    slug: z
      .string()
      .trim()
      .min(2, "El enlace es muy corto")
      .max(80, "El enlace es muy largo")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Solo minúsculas, números y guiones (ej. pack-trio)"
      ),
    description: z
      .string()
      .trim()
      .max(1000, "Muy largo")
      .optional()
      .or(z.literal("")),
    price: z
      .number({ invalid_type_error: "Ingresa el precio" })
      .min(0, "El precio no puede ser negativo")
      .max(99999, "Precio demasiado alto"),
    is_active: z.boolean(),
    items: z
      .array(bundleItemSchema)
      .min(1, "Agrega al menos un producto al pack"),
  })
  .superRefine((data, ctx) => {
    // La misma variante no puede repetirse dentro del pack
    const seen = new Set<string>();
    data.items.forEach((item, index) => {
      if (seen.has(item.variantId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["items", index, "variantId"],
          message: "Este producto ya está en el pack: ajusta su cantidad en vez de repetirlo",
        });
      }
      seen.add(item.variantId);
    });
  });

export type BundleFormValues = z.infer<typeof bundleFormSchema>;

/** Opción de variante para el selector del formulario (cargada en servidor). */
export interface VariantOption {
  variantId: string;
  label: string;
  productName: string;
  sizeLabel: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
}

import { z } from "zod";

/**
 * Esquemas del CRUD de productos del admin. El MISMO esquema valida el
 * formulario (cliente) y la server action (servidor): nunca confiar en el
 * cliente. Reglas duras: precio y stock nunca negativos; slug y SKU con
 * formato estricto (la unicidad real la garantizan los constraints de BD y
 * se verifica también en la action).
 */

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  size_label: z
    .string()
    .trim()
    .min(1, "Indica la presentación (ej. 250 g)")
    .max(40, "Muy largo"),
  // NULL cuando la presentación se describe por tamaño o porciones (tortas:
  // "Mediana — 22 porciones"). Requiere la migración 20260704120000 en BD.
  weight_grams: z
    .number({ invalid_type_error: "Ingresa el peso en gramos" })
    .int("Solo números enteros")
    .min(1, "El peso debe ser mayor a 0")
    .max(100000, "Peso demasiado grande")
    .nullable(),
  // NULL = precio pendiente de definir. Regla dura (ver superRefine): una
  // variante sin precio NO puede estar activa — así el catálogo público y
  // create_order jamás ven precios pendientes.
  price: z
    .number({ invalid_type_error: "Ingresa el precio" })
    .min(0, "El precio no puede ser negativo")
    .max(99999, "Precio demasiado alto")
    .nullable(),
  compare_at_price: z
    .number({ invalid_type_error: "Ingresa un número" })
    .min(0, "No puede ser negativo")
    .max(99999, "Demasiado alto")
    .nullable(),
  stock: z
    .number({ invalid_type_error: "Ingresa el stock" })
    .int("Solo números enteros")
    .min(0, "El stock no puede ser negativo")
    .max(1000000, "Stock demasiado grande"),
  sku: z
    .string()
    .trim()
    .min(3, "El SKU necesita al menos 3 caracteres")
    .max(40, "Muy largo")
    .regex(/^[A-Za-z0-9-]+$/, "Solo letras, números y guiones"),
  is_active: z.boolean(),
});

export const productFormSchema = z
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
        "Solo minúsculas, números y guiones (ej. clasica-de-miel)"
      ),
    category: z.enum(
      // Reales primero; las cuatro últimas son legado de placeholders
      [
        "granola",
        "torta",
        "postre",
        "salado",
        "cupcake",
        "personalizado",
        "clasica",
        "andina",
        "chocolate",
        "especial",
      ],
      {
        errorMap: () => ({ message: "Elige una categoría" }),
      }
    ),
    // Solo por cotización: sin presentaciones ni precio; la página del
    // producto muestra "Cotizar por WhatsApp" en vez del panel de compra
    is_quote_only: z.boolean(),
    // "" = sin etiqueta (la action lo convierte a null en BD)
    badge: z.enum(["", "nuevo", "mas_vendido", "edicion_limitada"]),
    tagline: z.string().trim().max(120, "Muy largo").optional().or(z.literal("")),
    description: z
      .string()
      .trim()
      .max(1500, "Muy largo")
      .optional()
      .or(z.literal("")),
    story: z.string().trim().max(3000, "Muy largo").optional().or(z.literal("")),
    ingredientsText: z
      .string()
      .trim()
      .max(1500, "Muy largo")
      .optional()
      .or(z.literal("")),
    benefitsText: z
      .string()
      .trim()
      .max(1500, "Muy largo")
      .optional()
      .or(z.literal("")),
    allergensText: z
      .string()
      .trim()
      .max(1500, "Muy largo")
      .optional()
      .or(z.literal("")),
    is_active: z.boolean(),
    // min(1) se valida en superRefine porque los solo-cotización llevan 0
    variants: z.array(variantSchema),
  })
  .superRefine((data, ctx) => {
    // Los solo-cotización no llevan presentaciones; el resto necesita 1+
    if (data.is_quote_only && data.variants.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message:
          "Un producto solo por cotización no lleva presentaciones ni precio: quita las presentaciones o desmarca la opción.",
      });
    }
    if (!data.is_quote_only && data.variants.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message: "Agrega al menos una presentación",
      });
    }

    // Una presentación ACTIVA necesita precio definido (NULL = pendiente)
    data.variants.forEach((variant, index) => {
      if (variant.is_active && variant.price === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "price"],
          message:
            "Esta presentación no tiene precio todavía. Ponle precio o desactívala.",
        });
      }
    });

    // SKUs repetidos dentro del mismo formulario
    const seen = new Set<string>();
    data.variants.forEach((variant, index) => {
      const key = variant.sku.toUpperCase();
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["variants", index, "sku"],
          message: "Este SKU está repetido en el formulario",
        });
      }
      seen.add(key);
    });

    // Comportamiento documentado: un producto ACTIVO necesita al menos una
    // presentación activa — salvo los solo-cotización, que no llevan.
    if (
      data.is_active &&
      !data.is_quote_only &&
      !data.variants.some((v) => v.is_active)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["variants"],
        message:
          "Un producto activo necesita al menos una presentación activa. Activa una presentación o desactiva el producto.",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

/** Convierte el textarea "uno por línea" en array limpio. */
export function splitLines(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

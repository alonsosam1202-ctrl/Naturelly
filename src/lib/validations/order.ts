import { z } from "zod";

const checkoutBaseSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Cuéntanos tu nombre para preparar tu pedido"),
  customerPhone: z
    .string()
    .trim()
    .regex(/^9\d{8}$/, "Ingresa un celular válido de 9 dígitos (empieza con 9)"),
  deliveryMethod: z.enum(["delivery", "recojo"], {
    errorMap: () => ({ message: "Elige cómo quieres recibir tu pedido" }),
  }),
  deliveryDistrict: z.string().trim().max(80).optional().or(z.literal("")),
  deliveryAddress: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function requireDeliveryData(
  data: z.infer<typeof checkoutBaseSchema>,
  ctx: z.RefinementCtx
) {
  if (data.deliveryMethod === "delivery") {
    if (!data.deliveryAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deliveryAddress"],
        message: "Necesitamos tu dirección para el delivery",
      });
    }
    if (!data.deliveryDistrict) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["deliveryDistrict"],
        message: "Elige tu distrito",
      });
    }
  }
}

/** Esquema del formulario de checkout (cliente). */
export const checkoutFormSchema = checkoutBaseSchema.superRefine(
  requireDeliveryData
);

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const orderItemSchema = z
  .object({
    variantId: z.string().uuid().optional(),
    bundleId: z.string().uuid().optional(),
    quantity: z.number().int().min(1).max(50),
  })
  .refine((item) => Boolean(item.variantId) !== Boolean(item.bundleId), {
    message: "Cada ítem debe ser una variante o un pack, no ambos",
  });

/**
 * Esquema del POST /api/pedidos. El MISMO formulario + los ítems del carrito.
 * El carrito solo envía ids y cantidades: los precios se recalculan en la BD.
 */
export const createOrderSchema = checkoutBaseSchema
  .extend({
    items: z.array(orderItemSchema).min(1, "Tu carrito está vacío"),
  })
  .superRefine(requireDeliveryData);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

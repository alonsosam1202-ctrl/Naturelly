import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validations/order";
import { isSupabaseAdminConfigured } from "@/lib/supabase/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderSummary } from "@/types";

/**
 * POST /api/pedidos — crea un pedido.
 *
 * Nunca confiar en el cliente: se re-valida con Zod y la función RPC
 * `create_order` recalcula todos los precios desde la BD dentro de una
 * transacción (valida stock, descuenta y genera el código NAT-XXXX).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El pedido llegó incompleto. Inténtalo de nuevo." },
      { status: 400 }
    );
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revisa los datos de tu pedido, por favor.",
        detalles: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "La tienda aún no puede registrar pedidos: falta configurar la base de datos. Escríbenos por WhatsApp mientras tanto.",
      },
      { status: 503 }
    );
  }

  const input = parsed.data;
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("create_order", {
    payload: {
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      delivery_method: input.deliveryMethod,
      delivery_district: input.deliveryDistrict || null,
      delivery_address: input.deliveryAddress || null,
      notes: input.notes || null,
      items: input.items.map((item) => ({
        variant_id: item.variantId ?? null,
        bundle_id: item.bundleId ?? null,
        quantity: item.quantity,
      })),
    },
  });

  if (error) {
    console.error("create_order falló:", error.message);
    // Los mensajes de la RPC ya vienen en español y sin datos sensibles.
    const known =
      error.message.includes("Stock insuficiente") ||
      error.message.includes("no disponible") ||
      error.message.includes("Cantidad inválida");
    return NextResponse.json(
      {
        error: known
          ? error.message
          : "No pudimos registrar tu pedido. Inténtalo de nuevo en un momento.",
      },
      { status: known ? 409 : 500 }
    );
  }

  // El RPC devuelve jsonb (tipado como Json); la forma real es OrderSummary
  const summary = data as unknown as OrderSummary;
  return NextResponse.json({ codigo: summary.code }, { status: 201 });
}

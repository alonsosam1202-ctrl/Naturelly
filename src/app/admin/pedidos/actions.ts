"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const updateStatusSchema = z.object({
  orderId: z.string().uuid(),
  newStatus: z.enum([
    "pendiente",
    "confirmado",
    "en_preparacion",
    "en_camino",
    "entregado",
    "cancelado",
  ]),
});

export type UpdateStatusResult = { ok: boolean; message: string };

/**
 * Cambia el estado de un pedido. Tres capas de autorización:
 * 1) middleware (sesión), 2) esta acción (sesión + role admin en BD),
 * 3) la RPC set_order_status vuelve a exigir is_admin() y valida
 *    transiciones + reposición de stock de forma transaccional.
 * Se usa el cliente de SESIÓN (publishable key), nunca la secret key:
 * la autorización es explícita, no un bypass.
 */
export async function updateOrderStatus(
  input: unknown
): Promise<UpdateStatusResult> {
  const parsed = updateStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Los datos enviados no son válidos." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      message: "Tu sesión expiró. Vuelve a iniciar sesión.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") {
    return { ok: false, message: "No tienes permisos para hacer esto." };
  }

  const { data, error } = await supabase.rpc("set_order_status", {
    p_order_id: parsed.data.orderId,
    p_new_status: parsed.data.newStatus,
  });

  if (error) {
    console.error("set_order_status falló:", error.message);
    const known =
      error.message.includes("Transición no permitida") ||
      error.message.includes("No autorizado") ||
      error.message.includes("Pedido no encontrado") ||
      error.message.includes("Estado inválido");
    return {
      ok: false,
      message: known
        ? error.message
        : "No se pudo actualizar el pedido. Inténtalo de nuevo.",
    };
  }

  const result = data as unknown as {
    code: string;
    changed: boolean;
    restocked: boolean;
    new_status: keyof typeof ORDER_STATUS_LABELS;
  };

  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${parsed.data.orderId}`);

  if (!result.changed) {
    return {
      ok: true,
      message: `El pedido ${result.code} ya estaba en ese estado.`,
    };
  }

  const label = ORDER_STATUS_LABELS[result.new_status]?.label ?? result.new_status;
  return {
    ok: true,
    message:
      `Listo: el pedido ${result.code} pasó a "${label}".` +
      (result.restocked ? " El stock de sus productos fue repuesto." : ""),
  };
}

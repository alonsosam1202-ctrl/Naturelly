import { createAdminClient } from "./supabase/admin";
import { isSupabaseAdminConfigured } from "./supabase/config";
import type { OrderWithItems } from "@/types";

/**
 * Busca un pedido por su código legible (NAT-XXXX) para la página de
 * confirmación. Los pedidos de invitado tienen `user_id` NULL y no son
 * visibles vía RLS, por eso se usa el cliente de servidor: el código no es
 * adivinable y solo lo conoce quien hizo el pedido.
 */
export async function getOrderByCode(
  code: string
): Promise<OrderWithItems | null> {
  if (!isSupabaseAdminConfigured()) return null;
  if (!/^NAT-[A-Z0-9]{4}$/.test(code)) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "code, customer_name, delivery_method, delivery_address, delivery_district, status, subtotal, delivery_fee, total, created_at, order_items(item_name, unit_price, quantity, subtotal)"
    )
    .eq("code", code)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as unknown as Omit<OrderWithItems, "items"> & {
    order_items: {
      item_name: string;
      unit_price: number;
      quantity: number;
      subtotal: number;
    }[];
  };

  return {
    code: row.code,
    customer_name: row.customer_name,
    delivery_method: row.delivery_method,
    delivery_address: row.delivery_address,
    delivery_district: row.delivery_district,
    status: row.status,
    subtotal: row.subtotal,
    delivery_fee: row.delivery_fee,
    total: row.total,
    created_at: row.created_at,
    items: row.order_items.map((item) => ({
      name: item.item_name,
      unit_price: item.unit_price,
      quantity: item.quantity,
      subtotal: item.subtotal,
    })),
  };
}

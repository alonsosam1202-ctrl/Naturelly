// Tipos de dominio. Los tipos generados desde Supabase (database.ts) se
// crearán con `supabase gen types typescript` cuando el proyecto exista.

export type ProductCategory = "clasica" | "andina" | "chocolate" | "especial";

export type ProductBadge = "nuevo" | "mas_vendido" | "edicion_limitada";

export interface ProductVariant {
  id: string;
  size_label: string;
  weight_grams: number;
  price: number;
  compare_at_price: number | null;
  stock: number;
  sku: string;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  ingredients: string[];
  benefits: string[];
  category: ProductCategory;
  badge: ProductBadge | null;
  sort_order: number;
  variants: ProductVariant[];
  images: ProductImage[];
}

export interface CatalogBundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  items: { name: string; size_label: string; quantity: number }[];
}

export type OrderStatus =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "cancelado";

export interface OrderSummaryItem {
  name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

/** Lo que devuelve la función RPC `create_order`. */
export interface OrderSummary {
  code: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: OrderSummaryItem[];
}

export interface OrderWithItems {
  code: string;
  customer_name: string;
  delivery_method: "delivery" | "recojo";
  delivery_address: string | null;
  delivery_district: string | null;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  items: OrderSummaryItem[];
}

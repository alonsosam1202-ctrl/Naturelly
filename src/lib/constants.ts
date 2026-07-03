import type { OrderStatus, ProductCategory } from "@/types";

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "clasica", label: "Clásicas" },
  { value: "andina", label: "Andinas" },
  { value: "chocolate", label: "Chocolate" },
  { value: "especial", label: "Especiales" },
];

/**
 * Acento visual de cada sabor (BRAND_GUIDE.md — "Acentos por sabor",
 * dirección Bright Wellness). primary/secondary son hex para SVG e
 * ilustraciones; `archClass` es el fondo pastel fuerte del arco. Al llegar
 * fotos reales, el arco se mantiene como escenografía del sabor.
 */
export const FLAVOR_ACCENTS: Record<
  ProductCategory,
  {
    primary: string;
    secondary: string;
    archClass: string;
    badgeClass: string;
    gradientClass: string;
  }
> = {
  clasica: {
    primary: "#E6A12D",
    secondary: "#FEDB5F",
    archClass: "bg-amarillo/70",
    badgeClass: "bg-miel text-blanco-crema",
    gradientClass: "from-amarillo to-miel",
  },
  andina: {
    primary: "#7CA66A",
    secondary: "#FEDB5F",
    archClass: "bg-salvia/30",
    badgeClass: "bg-salvia text-blanco-crema",
    gradientClass: "from-salvia to-amarillo",
  },
  chocolate: {
    primary: "#5A3A28",
    secondary: "#E6A12D",
    archClass: "bg-lavanda/50",
    badgeClass: "bg-tinta text-amarillo",
    gradientClass: "from-lavanda to-miel",
  },
  especial: {
    primary: "#E9B6D0",
    secondary: "#E6A12D",
    archClass: "bg-berry/50",
    badgeClass: "bg-berry text-tinta",
    gradientClass: "from-berry to-lavanda",
  },
};

// TODO: confirmar con Nelly la lista completa de distritos con delivery.
// Los tres primeros vienen del ejemplo de DATABASE_SCHEMA.md.
export const DELIVERY_DISTRICTS = [
  "Cercado",
  "Hunter",
  "José Luis Bustamante y Rivero",
];

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pendiente: { label: "Pendiente", className: "bg-amarillo-suave text-cacao" },
  confirmado: { label: "Confirmado", className: "bg-salvia/20 text-salvia" },
  en_preparacion: {
    label: "En preparación",
    className: "bg-amarillo/40 text-cacao",
  },
  en_camino: { label: "En camino", className: "bg-amarillo/40 text-cacao" },
  entregado: { label: "Entregado", className: "bg-salvia/20 text-salvia" },
  cancelado: {
    label: "Cancelado",
    className: "bg-terracota/10 text-terracota",
  },
};

export const ORDER_STATUSES: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "en_camino",
  "entregado",
  "cancelado",
];

/**
 * Flujo de estados (DATABASE_SCHEMA.md): siguiente paso normal de cada
 * estado; null = estado final. Las transiciones reales las valida la RPC
 * `set_order_status` en la BD — esto es solo para pintar los botones.
 */
export const ORDER_NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pendiente: "confirmado",
  confirmado: "en_preparacion",
  en_preparacion: "en_camino",
  en_camino: "entregado",
  entregado: null,
  cancelado: null,
};

/** Etiqueta del botón que lleva a cada estado destino. */
export const ORDER_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  confirmado: "Confirmar pedido",
  en_preparacion: "Empezar preparación",
  en_camino: "Marcar en camino",
  entregado: "Marcar como entregado",
};

/** Estados desde los que se puede cancelar (todo lo previo a entregado). */
export const CANCELABLE_STATUSES: OrderStatus[] = [
  "pendiente",
  "confirmado",
  "en_preparacion",
  "en_camino",
];

export const PRODUCT_BADGE_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  mas_vendido: "Más vendido",
  edicion_limitada: "Edición limitada",
};

/** Ingredientes andinos documentados en PROJECT_BRIEF.md (cinta marquee). */
export const MARQUEE_INGREDIENTS = [
  "Quinua",
  "Kiwicha",
  "Aguaymanto",
  "Cacao",
  "Miel de abeja",
  "Tostada a mano",
  "Tandas pequeñas",
];

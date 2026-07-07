import type { OrderStatus, ProductCategory } from "@/types";

/**
 * Categorías del selector del admin y del filtro de tienda. Las tres
 * primeras son las reales del negocio (requieren la migración
 * 20260704120000 aplicada); las marcadas "(antiguo)" existen solo porque
 * los productos placeholder las usan — no elegirlas para productos nuevos.
 */
export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "granola", label: "Granola" },
  { value: "torta", label: "Tortas" },
  { value: "postre", label: "Postres" },
  { value: "salado", label: "Salados" },
  { value: "cupcake", label: "Cupcakes" },
  { value: "personalizado", label: "Personalizados" },
  { value: "clasica", label: "Clásicas (antiguo)" },
  { value: "andina", label: "Andinas (antiguo)" },
  { value: "chocolate", label: "Chocolate (antiguo)" },
  { value: "especial", label: "Especiales (antiguo)" },
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
  granola: {
    primary: "#E6A12D",
    secondary: "#FEDB5F",
    archClass: "bg-amarillo/70",
    badgeClass: "bg-miel text-tinta",
    gradientClass: "from-amarillo to-miel",
  },
  torta: {
    primary: "#E9B6D0",
    secondary: "#FEDB5F",
    archClass: "bg-berry/50",
    badgeClass: "bg-berry text-tinta",
    gradientClass: "from-berry to-amarillo",
  },
  postre: {
    primary: "#E8C7F0",
    secondary: "#FEDB5F",
    archClass: "bg-lavanda/50",
    badgeClass: "bg-lavanda text-tinta",
    gradientClass: "from-lavanda to-amarillo",
  },
  salado: {
    primary: "#7CA66A",
    secondary: "#E6A12D",
    archClass: "bg-salvia/30",
    badgeClass: "bg-salvia text-blanco-crema",
    gradientClass: "from-salvia to-miel",
  },
  cupcake: {
    primary: "#FEDB5F",
    secondary: "#E9B6D0",
    archClass: "bg-amarillo/70",
    badgeClass: "bg-amarillo text-tinta",
    gradientClass: "from-amarillo to-berry",
  },
  personalizado: {
    primary: "#E8C7F0",
    secondary: "#E6A12D",
    archClass: "bg-lavanda/50",
    badgeClass: "bg-lavanda text-tinta",
    gradientClass: "from-lavanda to-berry",
  },
  clasica: {
    primary: "#E6A12D",
    secondary: "#FEDB5F",
    archClass: "bg-amarillo/70",
    badgeClass: "bg-miel text-tinta",
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

/**
 * Zona de entrega confirmada (2026-07-07): toda Arequipa metropolitana, sin
 * restricción por distrito. El costo del envío NO lo maneja la plataforma:
 * se coordina por WhatsApp con delivery externo (InDriver u otro).
 */
export const DELIVERY_DISTRICTS = [
  "Alto Selva Alegre",
  "Arequipa (Cercado)",
  "Cayma",
  "Cerro Colorado",
  "Characato",
  "Jacobo Hunter",
  "José Luis Bustamante y Rivero",
  "Mariano Melgar",
  "Miraflores",
  "Mollebaya",
  "Paucarpata",
  "Quequeña",
  "Sabandía",
  "Sachaca",
  "Socabaya",
  "Tiabaya",
  "Uchumayo",
  "Yanahuara",
  "Yura",
];

export const ORDER_STATUS_LABELS: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pendiente: { label: "Pendiente", className: "bg-amarillo-suave text-cacao" },
  confirmado: { label: "Confirmado", className: "bg-salvia/20 text-salvia-oscura" },
  en_preparacion: {
    label: "En preparación",
    className: "bg-amarillo/40 text-cacao",
  },
  en_camino: { label: "En camino", className: "bg-amarillo/40 text-cacao" },
  entregado: { label: "Entregado", className: "bg-salvia/20 text-salvia-oscura" },
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

/**
 * Cinta marquee: productos y valores REALES del negocio (catálogo confirmado
 * por Alonso el 2026-07-07; torta de naranja retirada — aún no se vende).
 * No listar ingredientes ni sabores sin confirmar con Nelly. En español.
 */
export const MARQUEE_INGREDIENTS = [
  "Granola artesanal",
  "Tortas caseras",
  "Postres especiales",
  "Cupcakes",
  "Pedidos personalizados",
  "Hecho a mano",
  "Arequipa · Perú",
];

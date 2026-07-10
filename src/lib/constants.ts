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
 * Acento visual por categoría — joyas de "Tinta & Oro" (spec 2026-07-07):
 * SOLO dots, tags y detalles; nunca bloques grandes. primary/secondary son
 * hex para SVG e ilustraciones; `archClass` es un tinte suave del arco
 * (visible solo si un producto no tiene foto).
 *
 * Notas de la spec:
 * - Ciruela #55405F queda como JOYA DE RESERVA para una futura 5ª
 *   categoría: NO se asigna a ninguna existente.
 * - La spec no define color para "salado": se usa Piedra #4C463A como
 *   PROVISIONAL (neutro AA) hasta decidirlo con Alonso.
 * - Ámbar #97722E solo en dots/texto grande; como texto normal usar
 *   --color-ambar-texto (#7D5E24).
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
    primary: "#97722E",
    secondary: "#C39A52",
    archClass: "bg-ambar/10",
    badgeClass: "bg-ambar text-crema-clara",
    gradientClass: "from-ambar to-oro",
  },
  torta: {
    primary: "#5F3A26",
    secondary: "#C39A52",
    archClass: "bg-chocolate/10",
    badgeClass: "bg-chocolate text-crema-clara",
    gradientClass: "from-chocolate to-oro",
  },
  postre: {
    primary: "#2F6353",
    secondary: "#C39A52",
    archClass: "bg-esmeralda/10",
    badgeClass: "bg-esmeralda text-crema-clara",
    gradientClass: "from-esmeralda to-oro",
  },
  salado: {
    // PROVISIONAL: la spec no asigna joya a salados (ciruela es reserva)
    primary: "#4C463A",
    secondary: "#C39A52",
    archClass: "bg-piedra/10",
    badgeClass: "bg-piedra text-crema-clara",
    gradientClass: "from-piedra to-oro",
  },
  cupcake: {
    primary: "#A2496B",
    secondary: "#C39A52",
    archClass: "bg-frambuesa/10",
    badgeClass: "bg-frambuesa text-crema-clara",
    gradientClass: "from-frambuesa to-oro",
  },
  personalizado: {
    primary: "#C39A52",
    secondary: "#5F3A26",
    archClass: "bg-oro/10",
    badgeClass: "bg-oro text-tinta",
    gradientClass: "from-oro to-chocolate",
  },
  // ── Legado (sin productos tras la limpieza; pendiente de retirar con
  //    migración propia). Tonos neutros de la paleta vigente. ──
  clasica: {
    primary: "#97722E",
    secondary: "#C39A52",
    archClass: "bg-ambar/10",
    badgeClass: "bg-ambar text-crema-clara",
    gradientClass: "from-ambar to-oro",
  },
  andina: {
    primary: "#2F6353",
    secondary: "#C39A52",
    archClass: "bg-esmeralda/10",
    badgeClass: "bg-esmeralda text-crema-clara",
    gradientClass: "from-esmeralda to-oro",
  },
  chocolate: {
    primary: "#5F3A26",
    secondary: "#C39A52",
    archClass: "bg-chocolate/10",
    badgeClass: "bg-chocolate text-crema-clara",
    gradientClass: "from-chocolate to-oro",
  },
  especial: {
    primary: "#A2496B",
    secondary: "#C39A52",
    archClass: "bg-frambuesa/10",
    badgeClass: "bg-frambuesa text-crema-clara",
    gradientClass: "from-frambuesa to-oro",
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

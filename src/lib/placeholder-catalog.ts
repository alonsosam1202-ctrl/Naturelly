import type { CatalogBundle, CatalogProduct } from "@/types";

/**
 * Catálogo de desarrollo usado cuando Supabase aún no está configurado.
 * ⚠️ TODO: confirmar con Nelly — TODOS los nombres, precios, stock e
 * ingredientes de este archivo son placeholders provisionales (los nombres
 * salen de la lista "a validar" de DATABASE_SCHEMA.md). No son datos reales.
 */

const PLACEHOLDER_NOTE =
  "Producto de muestra: los datos finales se cargarán desde el panel de administración.";

export const PLACEHOLDER_PRODUCTS: CatalogProduct[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    slug: "clasica-de-miel",
    // TODO: confirmar con Nelly nombre real
    name: "Clásica de Miel",
    tagline: "La receta de siempre, dorada y crocante",
    description: `Avena tostada en tandas pequeñas y endulzada solo con miel de abeja. ${PLACEHOLDER_NOTE}`,
    story:
      "Cada lote se tuesta a mano en la cocina de Nelly, en Arequipa. TODO: confirmar con Nelly la historia real de esta granola.",
    // TODO: confirmar con Nelly la receta exacta
    ingredients: ["Avena", "Miel de abeja"],
    benefits: ["Endulzada solo con miel", "Tostada a mano en tandas pequeñas"],
    allergens: [],
    is_quote_only: false,
    category: "clasica",
    badge: null,
    sort_order: 1,
    variants: [
      {
        id: "00000000-0000-4000-8000-000000000011",
        size_label: "250 g",
        weight_grams: 250,
        price: 20, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10, // TODO: confirmar con Nelly (stock placeholder)
        sku: "NAT-CLA-250",
        is_active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000012",
        size_label: "500 g",
        weight_grams: 500,
        price: 36, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10,
        sku: "NAT-CLA-500",
        is_active: true,
      },
    ],
    images: [],
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    slug: "andina-power",
    // TODO: confirmar con Nelly nombre real
    name: "Andina Power",
    tagline: "Quinua, kiwicha y aguaymanto de la tierra",
    description: `Granola con superalimentos andinos comprados frescos, del origen. ${PLACEHOLDER_NOTE}`,
    story:
      "Donde otros dicen “granos ancestrales”, nosotros decimos de la tierra donde nacieron esos granos. TODO: confirmar con Nelly la historia real.",
    // TODO: confirmar con Nelly la receta exacta
    ingredients: ["Avena", "Quinua", "Kiwicha", "Aguaymanto", "Miel de abeja"],
    benefits: ["Superalimentos andinos", "Endulzada solo con miel"],
    allergens: [],
    is_quote_only: false,
    category: "andina",
    badge: "mas_vendido",
    sort_order: 2,
    variants: [
      {
        id: "00000000-0000-4000-8000-000000000021",
        size_label: "250 g",
        weight_grams: 250,
        price: 24, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10,
        sku: "NAT-AND-250",
        is_active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000022",
        size_label: "500 g",
        weight_grams: 500,
        price: 42, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10,
        sku: "NAT-AND-500",
        is_active: true,
      },
    ],
    images: [],
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    slug: "cacao-cafe",
    // TODO: confirmar con Nelly nombre real
    name: "Cacao & Café",
    tagline: "Intensa, chocolatosa y nada empalagosa",
    description: `Granola con cacao peruano, tostada a mano. ${PLACEHOLDER_NOTE}`,
    story:
      "TODO: confirmar con Nelly la historia real de esta granola (origen del cacao y del café).",
    // TODO: confirmar con Nelly la receta exacta
    ingredients: ["Avena", "Cacao", "Café", "Miel de abeja"],
    benefits: ["Cacao peruano", "Endulzada solo con miel"],
    allergens: [],
    is_quote_only: false,
    category: "chocolate",
    badge: "nuevo",
    sort_order: 3,
    variants: [
      {
        id: "00000000-0000-4000-8000-000000000031",
        size_label: "250 g",
        weight_grams: 250,
        price: 24, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10,
        sku: "NAT-CAF-250",
        is_active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000032",
        size_label: "500 g",
        weight_grams: 500,
        price: 42, // TODO: confirmar con Nelly (precio placeholder)
        compare_at_price: null,
        stock: 10,
        sku: "NAT-CAF-500",
        is_active: true,
      },
    ],
    images: [],
  },
];

export const PLACEHOLDER_BUNDLES: CatalogBundle[] = [
  {
    id: "00000000-0000-4000-8000-000000000100",
    slug: "pack-trio-naturelly",
    // TODO: confirmar con Nelly nombre y precio real del pack
    name: "Pack Trío Naturelly",
    description:
      "Nuestras tres granolas de 250 g para probarlas todas. TODO: confirmar con Nelly precio y contenido final.",
    price: 62, // TODO: confirmar con Nelly (precio placeholder)
    image_url: null,
    items: [
      { name: "Clásica de Miel", size_label: "250 g", quantity: 1 },
      { name: "Andina Power", size_label: "250 g", quantity: 1 },
      { name: "Cacao & Café", size_label: "250 g", quantity: 1 },
    ],
  },
];

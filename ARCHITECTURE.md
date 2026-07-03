# ARCHITECTURE — Naturelly

## Principios

1. **App Router con Server Components por defecto.** Solo se marca `"use client"` donde hay interactividad real (carrito, formularios, galería).
2. **La lógica sensible vive en el servidor.** Crear pedidos, mutar productos y cambiar estados pasa por Route Handlers o Server Actions con validación Zod.
3. **RLS como última línea de defensa.** Aunque el middleware proteja rutas, la base de datos rechaza por sí misma accesos indebidos.
4. **El carrito es estado del cliente.** Supabase solo registra pedidos confirmados, nunca carritos.

## Estructura de carpetas

```
naturelly/
├── docs/                          # Esta documentación
├── public/                        # Estáticos (logo, favicon, og-image)
├── supabase/
│   ├── migrations/                # SQL versionado (esquema + RLS + seeds)
│   └── seed.sql                   # Datos iniciales de desarrollo
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: fuentes, metadata, providers
│   │   ├── page.tsx               # Inicio (storytelling)
│   │   ├── (tienda)/              # Grupo: experiencia de compra
│   │   │   ├── tienda/page.tsx
│   │   │   ├── producto/[slug]/page.tsx
│   │   │   ├── packs/page.tsx
│   │   │   ├── carrito/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   └── pedido/[codigo]/confirmado/page.tsx
│   │   ├── (marca)/               # Grupo: contenido de marca
│   │   │   ├── nosotros/page.tsx
│   │   │   ├── ingredientes/page.tsx
│   │   │   ├── recetas/page.tsx
│   │   │   ├── recetas/[slug]/page.tsx
│   │   │   ├── faq/page.tsx
│   │   │   └── contacto/page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── registro/page.tsx
│   │   │   └── recuperar/page.tsx
│   │   ├── cuenta/
│   │   │   ├── layout.tsx         # Requiere sesión
│   │   │   ├── page.tsx           # Perfil
│   │   │   └── pedidos/page.tsx   # Historial
│   │   ├── admin/
│   │   │   ├── layout.tsx         # Requiere rol admin
│   │   │   ├── page.tsx           # Dashboard
│   │   │   ├── productos/...      # Listado, crear, editar
│   │   │   ├── packs/...
│   │   │   ├── pedidos/...        # Listado + cambio de estado
│   │   │   ├── recetas/...        # Fase 2
│   │   │   └── faq/...            # Fase 2
│   │   └── api/
│   │       ├── pedidos/route.ts   # POST: crear pedido (valida + service role)
│   │       └── contacto/route.ts  # POST: guardar mensaje
│   ├── components/
│   │   ├── ui/                    # Primitivos: Button, Input, Badge, Card, Modal...
│   │   ├── layout/                # Header, Footer, MobileNav, CartDrawer
│   │   ├── tienda/                # ProductCard, VariantSelector, QuantityStepper,
│   │   │                          # ProductGallery, BundleCard, PriceTag
│   │   ├── carrito/               # CartItem, CartSummary, EmptyCart
│   │   ├── checkout/              # CheckoutForm, DeliveryOptions, OrderSummary
│   │   ├── cuenta/                # OrderHistoryList, OrderStatusBadge, ProfileForm
│   │   ├── admin/                 # ProductForm, ImageUploader, OrdersTable,
│   │   │                          # StatusSelect, AdminSidebar
│   │   └── marca/                 # Hero, StorySection, IngredientGrid,
│   │                              # RecipeCard, FaqAccordion, TestimonialCard
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Cliente browser (anon key)
│   │   │   ├── server.ts          # Cliente server (cookies de sesión)
│   │   │   └── admin.ts           # Cliente service role (solo server)
│   │   ├── validations/           # Esquemas Zod (pedido, producto, contacto...)
│   │   ├── whatsapp.ts            # Construcción del mensaje wa.me del pedido
│   │   ├── utils.ts               # Formato de precios (S/), slugs, códigos NAT-XXXX
│   │   └── constants.ts           # Estados de pedido, zonas de delivery, tallas
│   ├── stores/
│   │   └── cart.ts                # Zustand: items, totales, persist
│   ├── types/
│   │   ├── database.ts            # Generado por Supabase CLI
│   │   └── index.ts               # Tipos de dominio (CartItem, OrderWithItems...)
│   └── middleware.ts              # Protege /cuenta (sesión) y /admin (rol admin)
├── .env.example
├── tailwind.config.ts             # Tokens de BRAND_GUIDE.md
└── package.json
```

## Componentes principales

| Componente | Responsabilidad | Tipo |
|---|---|---|
| `Header` / `MobileNav` | Navegación, acceso a cuenta, contador del carrito | Client |
| `CartDrawer` | Carrito lateral accesible desde cualquier página | Client |
| `ProductCard` | Foto, nombre, precio "desde", etiqueta (nuevo/más vendido) | Server |
| `VariantSelector` | Elegir 250 g / 500 g y ver precio actualizado | Client |
| `QuantityStepper` | Sumar/restar cantidad con límites de stock | Client |
| `ProductGallery` | Fotos del producto con miniaturas | Client |
| `CheckoutForm` | Datos del cliente + entrega, validado con Zod | Client |
| `OrderSummary` | Resumen inmutable del pedido antes de confirmar | Server/Client |
| `OrderStatusBadge` | Estado del pedido con color semántico | Server |
| `ProductForm` (admin) | Crear/editar producto con variantes e imágenes | Client |
| `ImageUploader` (admin) | Subida a Supabase Storage con preview | Client |
| `OrdersTable` (admin) | Pedidos con filtros por estado y cambio de estado | Client |
| `Hero`, `StorySection` | Storytelling del inicio | Server |
| `FaqAccordion` | Preguntas frecuentes plegables | Client |

## Flujo técnico de creación de pedido

```
CheckoutForm (client)
  → valida con Zod en el cliente
  → POST /api/pedidos  { items, cliente, entrega, notas }
      → re-valida con el MISMO esquema Zod (nunca confiar en el cliente)
      → re-calcula precios desde la BD (nunca confiar en precios del cliente)
      → verifica stock
      → inserta `orders` + `order_items` en una transacción (función RPC de Postgres)
      → genera código legible NAT-XXXX
      → responde { codigo, whatsappUrl }
  → el cliente limpia el carrito y navega a /pedido/[codigo]/confirmado
  → esa página muestra el resumen y el botón "Confirmar por WhatsApp" (wa.me)
```

**Decisión importante:** el total NUNCA se recibe del cliente. El servidor recalcula con precios vigentes de la base de datos. El carrito solo envía `variant_id` + `quantity`.

## Protección de rutas

| Ruta | Regla | Mecanismo |
|---|---|---|
| `/cuenta/**` | Sesión activa | `middleware.ts` redirige a `/login` |
| `/admin/**` | `profiles.role = 'admin'` | Middleware + verificación server-side en layout + RLS |
| `/api/pedidos` | Público (permite invitados) | Rate limiting básico + validación Zod |

## SEO y rendimiento

- Metadata dinámica por producto y receta (`generateMetadata`).
- `sitemap.ts` y `robots.ts` generados por Next.
- Imágenes servidas vía `next/image` con tamaños responsivos.
- Objetivo: LCP < 2.5 s en 4G, catálogo como Server Component con caché revalidable (`revalidateTag('products')` al editar desde el admin).

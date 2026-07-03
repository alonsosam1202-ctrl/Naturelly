# TECH_STACK — Naturelly

## Resumen

| Capa | Tecnología | Versión objetivo |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Lenguaje | TypeScript (modo `strict`) | 5.x |
| Estilos | Tailwind CSS | 4.x |
| Backend as a Service | Supabase (Postgres 15, Auth, Storage, RLS) | Cloud |
| Estado global (carrito) | Zustand + middleware `persist` | 5.x |
| Validación de datos | Zod | 3.x |
| Formularios | React Hook Form + resolver de Zod | 7.x |
| Iconos | Lucide React | latest |
| Fuentes | `next/font` con Fraunces (display) y Karla (texto) | — |
| Deploy | Render (URL provisional: https://naturelly.onrender.com) | — |
| Gestor de paquetes | npm | — |

## Justificación de cada elección

### Next.js 15 con App Router
- Server Components para el catálogo → SEO real (Google indexa productos y recetas), crítico para una marca que quiere crecer.
- Route Handlers (`app/api/`) para lógica sensible (creación de pedidos con la secret key del servidor).
- `next/image` para optimizar fotos de producto (formato WebP, lazy loading) → clave en 4G.
- Middleware para proteger rutas `/cuenta` y `/admin`.

### TypeScript estricto
- Los tipos de la base de datos se generan desde Supabase (`supabase gen types typescript`) → el frontend nunca se desincroniza del esquema.
- Menos bugs en cálculos de precios y totales.

### Tailwind CSS
- Los tokens de `BRAND_GUIDE.md` se definen una sola vez en la configuración del tema y todo el sitio los consume.
- Mobile-first por defecto, que coincide con la prioridad del proyecto.

### Supabase
- **Postgres**: modelo relacional real para productos, variantes, pedidos e ítems.
- **Auth**: login email/contraseña listo, con opción de agregar Google después.
- **Storage**: bucket para imágenes de producto, subidas desde el panel admin.
- **RLS**: seguridad a nivel de fila (el equipo ya tiene experiencia con RLS del proyecto VOZI). Los clientes solo ven sus pedidos; el rol admin gestiona todo.
- Plan gratuito suficiente para el MVP.

### Zustand (carrito)
- Ligero, sin boilerplate, con `persist` para que el carrito sobreviva a recargas y funcione para invitados sin tocar la base de datos.
- El carrito vive solo en el cliente; la base de datos solo conoce **pedidos confirmados**.

### Zod + React Hook Form
- Validación compartida cliente/servidor (mismo esquema valida el formulario y el Route Handler).
- Formularios del admin robustos sin escribir validación manual.

## Variables de entorno

```bash
# .env.example — sistema moderno de claves de Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # sb_publishable_... (clientes públicos, siempre bajo RLS)
SUPABASE_SECRET_KEY=                    # sb_secret_... SOLO en servidor. Nunca exponer.
NEXT_PUBLIC_WHATSAPP_NUMBER=51XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://naturelly.onrender.com   # provisional en Render; TODO: confirmar con Nelly el dominio final
```

**Regla:** `SUPABASE_SECRET_KEY` (equivale al rol `service_role`, salta RLS) solo se usa en Route Handlers / Server Actions; jamás con prefijo `NEXT_PUBLIC_`, jamás en componentes cliente, logs o respuestas de API. Cualquier código que corra en el navegador usa exclusivamente la `publishable key` + RLS. Las mismas variables deben configurarse en el dashboard de Render para el deploy.

## Integraciones futuras (preparadas, no implementadas)

| Integración | Fase | Nota de preparación |
|---|---|---|
| Culqi (tarjetas, Perú) | 3 | `orders.payment_method` acepta `culqi` |
| Mercado Pago | 3 | Alternativa a Culqi; misma estructura |
| Yape / Plin | 3 | Vía QR estático primero; `payment_method: 'yape' \| 'plin'` |
| WhatsApp Business API | 4 | Fase 1 usa enlaces `wa.me`, sin API |
| Shopify | — | Descartado como plataforma: el stack propio cubre el caso y evita mensualidad; se reevalúa solo si el volumen lo justifica |

## Herramientas de desarrollo

- ESLint + Prettier con configuración estándar de Next.js.
- Supabase CLI para migraciones versionadas en `supabase/migrations/` (formato oficial `<YYYYMMDDHHMMSS>_<nombre>.sql`).
- Convención de commits: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `chore:`.

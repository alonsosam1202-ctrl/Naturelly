# Naturelly 🥣

Ecommerce artesanal premium para **Naturelly**, marca de granolas hechas a mano por Nelly en Arequipa, Perú. Construido con Next.js, TypeScript, Tailwind CSS y Supabase.

## Estado actual

✅ **MVP técnico completo y validado en producción** (2026-07-03).

- **Producción:** https://naturelly.onrender.com
- Todos los flujos verificados manualmente de punta a punta (tienda, pedidos, panel admin, autenticación, SEO técnico, accesibilidad y responsive).
- Lo pendiente para el lanzamiento público es **información y recursos, no código**: datos reales de Nelly, logo y fotografías. Ver [`docs/LAUNCH_CHECKLIST.md`](./docs/LAUNCH_CHECKLIST.md).

## Funciones principales

**Tienda pública (mobile-first, español peruano)**
- Catálogo con categorías, detalle de producto con variantes (250 g / 500 g) y packs con precio especial.
- Carrito persistente (invitados incluidos) y checkout validado.
- Los pedidos se registran SIEMPRE en Supabase (código `NAT-XXXX`, precios recalculados en servidor con validación de stock transaccional) y luego se confirman por WhatsApp.
- SEO técnico: sitemap dinámico, robots, Open Graph con previsualización correcta en WhatsApp.

**Panel administrativo (`/admin`, para usuaria no técnica)**
- Gestión de pedidos: filtros por estado, detalle completo, transiciones válidas (`pendiente → confirmado → en_preparacion → en_camino → entregado`), cancelación con **reposición idempotente de stock** (variantes y packs).
- CRUD de productos con variantes e imágenes (subida directa a Storage, alt obligatorio, orden y reemplazo).
- CRUD de packs con selector de variantes, ahorro estimado y disponibilidad calculada.
- Todo con soft delete: nada se borra físicamente.

**Autenticación y seguridad**
- Login con correo/contraseña y con Google (OAuth PKCE), recuperación y cambio de contraseña.
- Triple capa de autorización para el panel: middleware → verificación server-side de sesión + rol → RLS y RPCs en la base de datos.
- Grants de mínimo privilegio + RLS en todas las tablas; la clave secreta jamás sale del servidor.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS 4 (tokens de `BRAND_GUIDE.md`) |
| Backend | Supabase (Postgres 15, Auth, Storage, RLS) |
| Estado (carrito) | Zustand + persist |
| Validación | Zod (cliente y servidor) |
| Formularios | React Hook Form |
| Deploy | Render (https://naturelly.onrender.com) |

## Variables de entorno

Copiar `.env.example` a `.env.local` y completar (solo nombres; los valores nunca se documentan):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` — **solo servidor**
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED`

Para la CLI de Supabase (migraciones), además: `SUPABASE_DB_PASSWORD` en `.env.local`.

> ⚠️ **Nunca exponer claves privadas.** `SUPABASE_SECRET_KEY` y `SUPABASE_DB_PASSWORD` no llevan prefijo `NEXT_PUBLIC_`, no se importan en componentes cliente, no se loguean, no se commitean (`.env.local` está en `.gitignore`) y no se pegan en chats ni documentación. Las mismas variables públicas + la secret key deben configurarse en el dashboard de Render.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar variables
npm run dev                  # http://localhost:3000
```

- Sin Supabase configurado, la web funciona en modo catálogo placeholder (el checkout avisa que no puede registrar pedidos).
- Base de datos: las migraciones viven en `supabase/migrations/` (formato `<YYYYMMDDHHMMSS>_<nombre>.sql`) y se aplican con `npx supabase db push` sobre el proyecto vinculado. `supabase/seed.sql` es solo para desarrollo.
- Verificación antes de cerrar cualquier cambio: `npx tsc --noEmit` y `npm run build`.

## Documentación

| Documento | Contenido |
|---|---|
| `CLAUDE.md` | Reglas de trabajo del proyecto |
| `PROJECT_BRIEF.md` | Visión, usuarios y alcance |
| `ARCHITECTURE.md` | Estructura, rutas y componentes |
| `DATABASE_SCHEMA.md` | Esquema, RLS, grants y RPCs |
| `BRAND_GUIDE.md` | Dirección visual "Bright Wellness" y tokens |
| `ROADMAP.md` / `TODO.md` | Fases y estado de tareas |
| `docs/LAUNCH_CHECKLIST.md` | Pendientes para el lanzamiento público |

## Licencia

Proyecto privado. Todos los derechos reservados a Naturelly.

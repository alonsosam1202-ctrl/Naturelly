# TODO — Naturelly

> Convención: `[ ]` pendiente · `[x]` hecho · `[~]` en progreso. Las tareas se marcan en el mismo commit que las completa.

## Fase 0 — Fundaciones
- [x] Redactar documentación base (README, BRIEF, TECH_STACK, ARCHITECTURE, DATABASE_SCHEMA, BRAND_GUIDE, ROADMAP, TODO, CLAUDE).
- [ ] Aprobar documentación en chat.
- [ ] Confirmar con Nelly: nombres y precios reales de productos, tamaños, stock inicial.
- [ ] Confirmar número de WhatsApp del negocio y distritos con delivery.
- [ ] Conseguir fotos reales de productos (o decidir seguir con ilustraciones SVG en el MVP).
- [ ] Crear proyecto en Supabase (org + proyecto `naturelly`).
- [ ] Crear repositorio Git y carpeta de trabajo `naturelly`.

## Fase 1 — MVP

### Setup
- [x] `create-next-app` con TypeScript, Tailwind, ESLint, App Router, `src/` (scaffold manual equivalente: la carpeta ya contenía los docs).
- [x] Configurar tokens de marca en Tailwind según `BRAND_GUIDE.md`.
- [x] Configurar fuentes Fraunces + Karla con `next/font`.
- [x] Instalar y configurar Zustand, Zod, React Hook Form, Lucide.
- [x] Clientes Supabase (`client.ts`, `server.ts`, `admin.ts`) + `.env.example`.

### Base de datos
- [~] Migración 001: tablas de catálogo (products, variants, images, bundles, bundle_items).
- [~] Migración 002: profiles + trigger `handle_new_user`.
- [~] Migración 003: orders + order_items + RPC `create_order`.
- [~] Migración 004: políticas RLS completas + función `is_admin()`.
- [~] Migración 005: contenido (faqs, contact_messages, site_settings; recipes queda creada para fase 2).
- [~] Buckets de Storage con políticas (migración 006).
- [~] Seed de desarrollo + generar tipos (`database.ts`).

> Nota: el SQL ya está escrito en `supabase/migrations/` y `supabase/seed.sql`, pero queda `[~]` hasta aplicarse en el proyecto Supabase real (pendiente crearlo, ver Fase 0) y generar `database.ts` con la CLI.

### Tienda pública
- [x] Layout global: Header, Footer, MobileNav, CartDrawer.
- [~] Página de inicio con storytelling (implementada con diseño propio según `BRAND_GUIDE.md`; falta contrastar con el prototipo HTML aprobado, no disponible en el repo).
- [x] `/tienda` con grid de productos y filtro por categoría.
- [x] `/producto/[slug]`: galería, selector de variante, historia, ingredientes.
- [x] `/packs` con bundles.
- [x] Carrito: store Zustand + página `/carrito` + drawer.
- [x] `/checkout`: formulario validado, invitado (logueado llega con Cuentas).
- [x] `/api/pedidos`: validación Zod + RPC + respuesta con código.
- [x] `/pedido/[codigo]/confirmado` + generador de mensaje WhatsApp.
- [x] Páginas `/nosotros`, `/faq`, `/contacto` (+ `/api/contacto`). `/recetas` quedó como teaser (el blog es fase 2).

### Cuentas
- [ ] `/registro`, `/login`, `/recuperar` con Supabase Auth.
- [ ] Middleware de protección de rutas.
- [ ] `/cuenta` (perfil editable) y `/cuenta/pedidos` (historial con estados).

### Admin
- [ ] Layout admin con verificación de rol.
- [ ] Dashboard con resumen (pedidos pendientes, ventas de la semana).
- [ ] CRUD de productos con variantes.
- [ ] Subida de imágenes a Storage con preview.
- [ ] CRUD de bundles.
- [ ] Tabla de pedidos con filtro por estado y cambio de estado.

### Calidad y deploy
- [ ] Revisión responsive completa (360 px como piso).
- [ ] Accesibilidad: foco visible, labels, contraste, `prefers-reduced-motion`.
- [ ] Metadata y Open Graph básicos.
- [ ] Deploy en Vercel + variables de entorno + dominio.
- [ ] Prueba de punta a punta con Nelly (crear producto → recibir pedido → cambiar estado).

## Fase 2 — Contenido (resumen; detallar al iniciar)
- [ ] Admin y páginas públicas de recetas.
- [ ] Página de ingredientes enriquecida.
- [ ] FAQ y contacto gestionables.
- [ ] SEO avanzado + analytics + testimonios.

## Fase 3 — Pagos (resumen; detallar al iniciar)
- [ ] Comparar comisiones vigentes Culqi vs Mercado Pago y decidir.
- [ ] Integración de pasarela + Yape/Plin.
- [ ] Correos transaccionales.
- [ ] Páginas legales (T&C, privacidad, libro de reclamaciones).

## Ideas / backlog (no comprometido)
- Modo "lote de la semana" con cuenta regresiva.
- Programa de referidos.
- Etiquetas imprimibles con QR al pedido.

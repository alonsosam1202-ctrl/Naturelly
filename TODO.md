# TODO — Naturelly

> Convención: `[ ]` pendiente · `[x]` hecho · `[~]` en progreso. Las tareas se marcan en el mismo commit que las completa.

## Fase 0 — Fundaciones
- [x] Redactar documentación base (README, BRIEF, TECH_STACK, ARCHITECTURE, DATABASE_SCHEMA, BRAND_GUIDE, ROADMAP, TODO, CLAUDE).
- [ ] Aprobar documentación en chat.
- [ ] Confirmar con Nelly: nombres y precios reales de productos, tamaños, stock inicial.
- [ ] Confirmar número de WhatsApp del negocio y distritos con delivery.
- [ ] Conseguir fotos reales de productos (o decidir seguir con ilustraciones SVG en el MVP).
- [x] Crear proyecto en Supabase (org + proyecto `naturelly`).
- [x] Crear repositorio Git y carpeta de trabajo `naturelly`.

## Fase 1 — MVP

### Setup
- [x] `create-next-app` con TypeScript, Tailwind, ESLint, App Router, `src/` (scaffold manual equivalente: la carpeta ya contenía los docs).
- [x] Configurar tokens de marca en Tailwind según `BRAND_GUIDE.md`.
- [x] Configurar fuentes Fraunces + Karla con `next/font`.
- [x] Instalar y configurar Zustand, Zod, React Hook Form, Lucide.
- [x] Clientes Supabase (`client.ts`, `server.ts`, `admin.ts`) + `.env.example`.

### Base de datos
- [x] Migración `catalog`: tablas de catálogo (products, variants, images, bundles, bundle_items).
- [x] Migración `profiles`: profiles + trigger `handle_new_user`.
- [x] Migración `orders`: orders + order_items + RPC `create_order`.
- [x] Migración `rls`: políticas RLS completas + función `is_admin()`.
- [x] Migración `content`: contenido (faqs, contact_messages, site_settings; recipes queda creada para fase 2).
- [x] Migración `storage`: buckets de Storage con políticas.
- [x] Migración `grants`: privilegios de mínimo privilegio por rol (GRANTs + RLS son dos capas; ver `DATABASE_SCHEMA.md`).
- [x] Seed de desarrollo aplicado + tipos generados (`database.ts`) + clientes tipados.

> Las 7 migraciones están aplicadas en el proyecto remoto y verificadas: flujo de pedido probado de punta a punta en local (pedido `NAT-5XFK`, cancelado tras la prueba) y en producción/Render (pedido `NAT-W3KE`), RLS y grants validados con anon/authenticated/secret. Falta crear el usuario admin de Nelly cuando exista su correo.
>
> ⚠️ Comportamiento actual documentado: **cancelar un pedido (status → `cancelado`) NO repone el stock automáticamente**. La reposición segura está en el backlog del panel admin.

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
- [ ] Reposición segura de stock al cancelar un pedido (transaccional, idempotente — que cancelar dos veces no reponga doble; hoy cancelar NO repone stock).

### Calidad y deploy
- [ ] Revisión responsive completa (360 px como piso).
- [ ] Accesibilidad: foco visible, labels, contraste, `prefers-reduced-motion`.
- [ ] Metadata y Open Graph básicos.
- [x] Deploy en Render (https://naturelly.onrender.com) con variables de Supabase configuradas. **Flujo validado de punta a punta en producción**: pedido `NAT-W3KE` registrado con su order_item y stock descontado 9→8 (quedó como pedido de prueba, no se borra).
- [ ] Dominio propio (TODO: confirmar con Nelly).
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

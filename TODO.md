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
- [~] `/registro`, `/login`, `/recuperar` con Supabase Auth (`/login` y `/recuperar` + `/actualizar-contrasena` + `/auth/callback` hechos; `/registro` pendiente para el bloque Cuentas).
- [x] Cambio de contraseña del usuario autenticado en `/admin/cuenta` (updateUser con sesión propia, sin secret key).
- [~] Login con Google (`signInWithOAuth` + PKCE implementado; el botón está **oculto tras `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false`** hasta configurar el OAuth Client en Google/Supabase y probarlo).
- [~] Middleware de protección de rutas (protege `/admin/**`; falta `/cuenta/**`).
- [ ] `/cuenta` (perfil editable) y `/cuenta/pedidos` (historial con estados).

> Pruebas del bloque de contraseñas (2026-07-03): login con contraseña OK; flujo completo de recuperación a nivel API (enlace → sesión → contraseña nueva → login con la nueva, la vieja rechazada, enlace de un solo uso); callback con código inválido no crea sesión y redirige a `/login?error=enlace`; la UI de `/recuperar` muestra SIEMPRE mensaje genérico. Pendientes manuales: correo real de recuperación, Google (tras configuración) y revisión visual del badge corregido.

### Admin
- [x] Layout admin con verificación de rol (middleware + verificación server-side + RLS/RPC).
- [x] Dashboard con resumen (pedidos pendientes, en proceso, entregados, ventas de últimos 7 días).
- [x] CRUD de productos con variantes (`/admin/productos`, crear/editar, soft delete con confirmación; variantes nunca se borran, se desactivan).
- [x] Subida de imágenes a Storage con preview, alt obligatorio, reemplazo, orden y eliminación controlada (BD primero, Storage después).
- [x] CRUD de bundles (`/admin/packs`: crear/editar con selector de variantes, resumen de ahorro y disponibilidad estimada, imagen única en `bundles.image_url`, soft delete con confirmación). Limitaciones de esquema documentadas en `DATABASE_SCHEMA.md` (sin precio tachado, badge ni orden de ítems).
- [x] Tabla de pedidos con filtro por estado y cambio de estado (`/admin/pedidos` + detalle con acciones).
- [x] Reposición segura de stock al cancelar un pedido (RPC `set_order_status`: transaccional, con lock e idempotente — verificado que cancelar dos veces no repone doble).

> Pruebas del CRUD de packs (2026-07-03): 12/12 pasaron (crear pack con 2 variantes, slug duplicado y cantidad 0 rechazados, no-admin bloqueado para crear/editar, pack activo visible/inactivo invisible para anon, la compra descuenta componentes exactos, el pedido histórico conserva nombre y precio tras editar el pack, cancelar repone exactamente una vez, borrado físico bloqueado por FK de pedidos). En BD quedaron: pack "Pack de prueba interna EDITADO" (desactivado; no se puede borrar porque tiene el pedido `NAT-VUKV` cancelado) — puede renombrarse y reutilizarse. **Validado manualmente en local y producción**: creación con varias variantes, resumen de suma/ahorro/disponibilidad, duplicados impedidos, edición de precio y cantidades, imagen (subir/reemplazar/quitar), desactivar/reactivar, visibilidad en `/packs`, compra con descuento de componentes, cancelación con reposición idempotente, y panel revisado en celular.
>
> Pruebas del CRUD de productos (2026-07-03): 11/11 verificaciones de permisos pasaron (admin crea/edita producto y variante, sube imagen servida públicamente; anon y no-admin bloqueados para crear/editar catálogo y subir al bucket; SKU duplicado rechazado por constraint; producto desactivado desaparece de la tienda). Datos y usuarios de prueba eliminados. **Validado manualmente en local y producción**: crear producto con variante, subir imagen con alt, editar nombre/descripción/ingredientes/precio/stock, reemplazar y reordenar imágenes, desactivar/reactivar, cambios reflejados en `/tienda` y `/producto/[slug]`, y formulario revisado desde celular. El CRUD de packs queda desbloqueado.
>
> Pruebas del bloque admin (2026-07-03): las 13 verificaciones automatizadas pasaron (login, RLS, transiciones, saltos bloqueados, restock exacto de variantes y bundles, no-op del doble cancelado, redirección del middleware). **Validado además manualmente en navegador**: flujo completo `pendiente → confirmado → en_preparacion → en_camino → entregado`, bloqueo del pedido entregado, botón de WhatsApp al cliente y visualización del pedido en el panel. Pedidos de prueba que quedaron en la BD: `NAT-YQFC` y `NAT-PPJ5` (cancelados), `NAT-GU8G` (entregado) — no se borran. Pendiente menor: ver en navegador la pantalla "Acceso denegado" con un usuario no-admin (la protección de datos ya está probada a nivel de RLS y RPC).

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

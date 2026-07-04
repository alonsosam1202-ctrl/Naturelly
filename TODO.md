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

> 🔶 **MVP AMPLIADO (2026-07-03): cuentas de clientes dentro del alcance.** Todo lo anterior sigue validado en producción (tienda, pedidos + WhatsApp, panel admin completo, auth correo + Google, recuperación, calidad/SEO/accesibilidad/responsive). El módulo de **registro y cuentas de clientes** está implementado y con 22/22 pruebas automatizadas en verde; **el MVP no se considera cerrado hasta su validación manual** por Alonso. Pendientes de lanzamiento (información y recursos): ver `docs/LAUNCH_CHECKLIST.md`.

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
- [x] `/registro`, `/login`, `/recuperar` con Supabase Auth (registro con confirmación de correo y Google; login general con **redirección por rol**: admin → `/admin`, customer → `/cuenta`; recuperación validada en producción).
- [x] Cambio de contraseña del usuario autenticado en `/admin/cuenta` (updateUser con sesión propia, sin secret key) — validado en producción.
- [x] Login con Google para admin **y clientes** (PKCE + `/auth/callback` con origen confiable desde `NEXT_PUBLIC_SITE_URL` y destino por rol; vinculación automática Google↔contraseña por correo conservada; "Acceso denegado" solo al entrar manualmente a `/admin`).
- [x] Middleware de protección de rutas (`/admin/**` por rol y `/cuenta/**` por sesión, con `next` sanitizado).
- [x] `/cuenta` (perfil editable: SOLO nombre y celular) + `/cuenta/pedidos` (historial propio vía RLS) + `/cuenta/pedidos/[id]` (detalle con precios snapshot).
- [x] Checkout: prefill desde el perfil con sesión, pedido asociado al usuario verificado con `getUser()` en servidor (jamás `user_id` del cliente); compra invitada intacta con invitación discreta a registrarse.

> Pruebas del módulo de cuentas (2026-07-03): 22/22 automatizadas en verde — login customer/admin, middleware de `/cuenta` y `/admin`, `next=//evil.com` rechazado, redirección por rol en callback (customer→/cuenta, admin→/admin), compra invitada con `user_id` malicioso IGNORADO (quedó null), compra autenticada de punta a punta por la API con cookie real (user_id correcto) y visible en su historial, IDOR bloqueado (B no ve pedidos/items de A), escalada de `role` bloqueada, RPC y edición directa de pedidos/precios/stock bloqueadas para customer, whitelist de perfil + trigger `updated_at`, precios snapshot intactos, cancelación idempotente, sitemap sin rutas privadas y noindex en `/registro` y `/cuenta`. Usuarios `qa-cuentas-*` eliminados por UUID; pedidos de prueba `NAT-Y5GA`, `NAT-GXC2`, `NAT-9PZZ` y `NAT-C5P3` cancelados con stock repuesto. **Pendiente: validación manual de Alonso.**

> Pruebas del bloque de contraseñas (2026-07-03): login con contraseña OK; flujo completo de recuperación a nivel API (enlace → sesión → contraseña nueva → login con la nueva, la vieja rechazada, enlace de un solo uso); callback con código inválido no crea sesión y redirige a `/login?error=enlace`; la UI de `/recuperar` muestra SIEMPRE mensaje genérico. Todo validado después en producción: recuperación con correo real, Google OAuth (admin → `/admin`, customer → "Acceso denegado", logout) y el badge corregido.

### Admin
- [x] Layout admin con verificación de rol (middleware + verificación server-side + RLS/RPC).
- [x] Dashboard con resumen (pedidos pendientes, en proceso, entregados, ventas de últimos 7 días).
- [x] CRUD de productos con variantes (`/admin/productos`, crear/editar, soft delete con confirmación; variantes nunca se borran, se desactivan).
- [x] Subida de imágenes a Storage con preview, alt obligatorio, reemplazo, orden y eliminación controlada (BD primero, Storage después).
- [x] CRUD de bundles (`/admin/packs`: crear/editar con selector de variantes, resumen de ahorro y disponibilidad estimada, imagen única en `bundles.image_url`, soft delete con confirmación). Limitaciones de esquema documentadas en `DATABASE_SCHEMA.md` (sin precio tachado, badge ni orden de ítems).
- [x] Tabla de pedidos con filtro por estado y cambio de estado (`/admin/pedidos` + detalle con acciones).
- [x] Reposición segura de stock al cancelar un pedido (RPC `set_order_status`: transaccional, con lock e idempotente — verificado que cancelar dos veces no repone doble).

> Cierre de calidad (2026-07-03): verificado en server local — `robots.txt` correcto, `sitemap.xml` solo con URLs públicas (0 privadas), `opengraph-image` 200 image/png (45 KB), og:image/twitter:card/og:locale presentes en el HTML, noindex en las 5 rutas no indexables y ausente en `/` y `/tienda`. `NEXT_PUBLIC_SITE_URL` ya está configurada en Render (verificada en producción con el flujo OAuth y la previsualización OG).
>
> Pruebas del CRUD de packs (2026-07-03): 12/12 pasaron (crear pack con 2 variantes, slug duplicado y cantidad 0 rechazados, no-admin bloqueado para crear/editar, pack activo visible/inactivo invisible para anon, la compra descuenta componentes exactos, el pedido histórico conserva nombre y precio tras editar el pack, cancelar repone exactamente una vez, borrado físico bloqueado por FK de pedidos). En BD quedaron: pack "Pack de prueba interna EDITADO" (desactivado; no se puede borrar porque tiene el pedido `NAT-VUKV` cancelado) — puede renombrarse y reutilizarse. **Validado manualmente en local y producción**: creación con varias variantes, resumen de suma/ahorro/disponibilidad, duplicados impedidos, edición de precio y cantidades, imagen (subir/reemplazar/quitar), desactivar/reactivar, visibilidad en `/packs`, compra con descuento de componentes, cancelación con reposición idempotente, y panel revisado en celular.
>
> Pruebas del CRUD de productos (2026-07-03): 11/11 verificaciones de permisos pasaron (admin crea/edita producto y variante, sube imagen servida públicamente; anon y no-admin bloqueados para crear/editar catálogo y subir al bucket; SKU duplicado rechazado por constraint; producto desactivado desaparece de la tienda). Datos y usuarios de prueba eliminados. **Validado manualmente en local y producción**: crear producto con variante, subir imagen con alt, editar nombre/descripción/ingredientes/precio/stock, reemplazar y reordenar imágenes, desactivar/reactivar, cambios reflejados en `/tienda` y `/producto/[slug]`, y formulario revisado desde celular. El CRUD de packs queda desbloqueado.
>
> Pruebas del bloque admin (2026-07-03): las 13 verificaciones automatizadas pasaron (login, RLS, transiciones, saltos bloqueados, restock exacto de variantes y bundles, no-op del doble cancelado, redirección del middleware). **Validado además manualmente en navegador**: flujo completo `pendiente → confirmado → en_preparacion → en_camino → entregado`, bloqueo del pedido entregado, botón de WhatsApp al cliente y visualización del pedido en el panel. Pedidos de prueba que quedaron en la BD: `NAT-YQFC` y `NAT-PPJ5` (cancelados), `NAT-GU8G` (entregado) — no se borran. Pendiente menor: ver en navegador la pantalla "Acceso denegado" con un usuario no-admin (la protección de datos ya está probada a nivel de RLS y RPC).

### Calidad y deploy
- [x] Revisión responsive completa **validada en producción** (360, 390, 430 px y escritorio; auditoría de código + pasada visual).
- [x] Accesibilidad **validada en producción**: contraste AA verificado y corregido con variantes de texto oscuras (`miel-oscura #9C6410`, `salvia-oscura #3E6B35`, `terracota #B04527`, WhatsApp `#2E7D3F`), foco visible AA, `h1` en todas las páginas (SectionHeader con prop `as`), Escape + bloqueo de scroll + foco inicial en drawers, labels/aria ya presentes, `prefers-reduced-motion` global.
- [x] Metadata y Open Graph: `sitemap.ts` dinámico (solo públicas + productos activos con `updated_at`, tolerante a fallos), `robots.ts` (disallow solo `/admin`, `/api`, `/auth`), imagen OG temporal 1200×630 con `next/og` (TODO: reemplazar cuando exista el logo), OG/Twitter completos, noindex verificado en carrito/checkout/pedido/login/recuperación/admin.
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

# LAUNCH_CHECKLIST — Naturelly

> Estado al 2026-07-03: **MVP técnico cerrado y validado en producción**
> (https://naturelly.onrender.com). Este documento separa lo que ya está
> listo de lo que falta para abrir la tienda al público. Lo pendiente es
> información y recursos, no código.

---

## A. Completado técnicamente ✅

Validado manualmente en producción:

- Tienda pública completa: catálogo, detalle con variantes, packs, carrito persistente, checkout.
- Pedidos registrados en Supabase (código `NAT-XXXX`, precios recalculados en servidor, stock transaccional) + mensaje de WhatsApp prellenado.
- Panel admin: gestión de pedidos con transiciones válidas y **reposición idempotente de stock al cancelar** (variantes y packs), CRUD de productos con imágenes, CRUD de packs, resumen del negocio.
- Autenticación: correo/contraseña, **Google OAuth activado y validado en producción** (`NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` en Render; admin → `/admin`, customer → "Acceso denegado", logout OK), recuperación y cambio de contraseña validados en producción.
- Seguridad: middleware + verificación server-side de rol + RLS y grants de mínimo privilegio + RPCs con autorización interna. 8 migraciones aplicadas y versionadas.
- Calidad: contraste AA, `h1` y aria correctos, teclado en drawers, `prefers-reduced-motion`, responsive 360/390/430/desktop, `robots.txt`, `sitemap.xml` dinámico, imagen Open Graph con previsualización correcta al compartir por WhatsApp.
- `tsc --noEmit` y `npm run build` limpios.

---

## B. Información real pendiente de Nelly 📋

Recopilar en una sesión con Nelly. Entre paréntesis, **dónde se carga**:

**Catálogo** (todo desde el panel admin → `/admin/productos` y `/admin/packs`):
- [ ] Nombre real y descripción de cada granola (los 3 actuales son provisionales).
- [ ] Ingredientes exactos de cada receta.
- [ ] **Alérgenos** — el esquema no tiene columna propia: incluirlos dentro de ingredientes o descripción (ej. "Contiene frutos secos"); si se quiere campo dedicado, requiere migración (ver E).
- [ ] Tamaños/presentaciones reales (¿250 g y 500 g son correctos?).
- [ ] Precios reales por presentación.
- [ ] Stock inicial real.
- [ ] Beneficios o características reales (sin inventar claims).
- [ ] Historia de cada granola (campo "Su historia").
- [ ] Packs reales: composición, nombre y precio (renombrar o desactivar el "Pack de prueba interna EDITADO").

**Negocio** (se cargan en configuración o código, ver inventario abajo):
- [ ] Número de WhatsApp del negocio.
- [ ] Horarios de atención.
- [ ] Zonas (distritos) de delivery y costos por zona.
- [ ] Medios de pago aceptados al coordinar (efectivo, Yape, Plin…).
- [ ] Historia de Nelly y de Naturelly (página `/nosotros`).
- [ ] Preguntas frecuentes reales (revisar/completar las 5 actuales).
- [ ] Datos de contacto (correo del negocio, redes si existen).
- [ ] Políticas de pedidos, cambios y entregas (mínimos, anticipación, qué pasa si no está el cliente, etc.).

---

## C. Recursos visuales pendientes 🎨

- [ ] **Logo definitivo** de Naturelly (hoy: wordmark tipográfico temporal).
- [ ] **Fotografías reales de productos** (guía en `BRAND_GUIDE.md`: luz natural, fondos pastel de la paleta por sabor) — se suben desde el panel; reemplazan a las ilustraciones automáticamente.
- [ ] **Imágenes de packs** (una por pack, desde el panel).
- [ ] **Imagen Open Graph definitiva** (la actual es temporal, marcada con TODO en `src/app/opengraph-image.tsx`).
- [ ] **Favicon definitivo** derivado del logo (hoy: bowl genérico en `src/app/icon.svg`).
- [ ] **Textos alternativos** de las fotos reales al subirlas (el panel los exige; escribirlos descriptivos, ej. "Bolsa de granola Clásica de Miel de 250 g").

---

## Inventario de placeholders (qué, dónde y cómo se reemplaza)

| Dato placeholder | Ubicación | Valor actual | Reemplazo | Se cambia desde |
|---|---|---|---|---|
| Nombres de productos | Tabla `products` | "Clásica de Miel", "Andina Power", "Cacao & Café" (+ "granola granolera" de prueba) | Nombres reales | **Panel admin** |
| Precios de variantes | Tabla `product_variants` | S/ 20 / 24 / 36 / 42 | Precios reales | **Panel admin** |
| Stock | Tabla `product_variants` | 10 por variante (± pruebas) | Stock real | **Panel admin** |
| Historias de producto | `products.story` | "TODO: confirmar con Nelly la historia real…" | Historias reales | **Panel admin** |
| Ingredientes/beneficios | `products` | Listas provisionales | Recetas reales (incl. alérgenos) | **Panel admin** |
| Packs | Tabla `bundles` | "Pack Trío Naturelly" S/ 62 + "Pack de prueba interna EDITADO" (desactivado) | Packs reales | **Panel admin** |
| Nº de WhatsApp | `NEXT_PUBLIC_WHATSAPP_NUMBER` | `51XXXXXXXXX` (botones deshabilitados con aviso) | Número real | **Render** (env) + `.env.local` |
| Nº de WhatsApp (copia informativa) | Tabla `site_settings`, clave `whatsapp_number` | `"51XXXXXXXXX"` | Número real | **Supabase** (Table Editor) |
| Distritos de delivery | `src/lib/constants.ts` → `DELIVERY_DISTRICTS` | Cercado, Hunter, JLByR | Lista confirmada | **Código** (una línea) |
| Distritos (copia informativa) | `site_settings`, clave `delivery_districts` | Los 3 mismos | Lista confirmada | **Supabase** |
| Costo de delivery | RPC `create_order` (`delivery_fee = 0`) + `site_settings.delivery_fee_default` | S/ 0 (se coordina por WhatsApp) | Tarifas reales por zona | **Código/migración** cuando existan tarifas |
| Textos de FAQ | `src/app/(marca)/faq/page.tsx` | 5 preguntas con datos por confirmar (zonas, pagos, duración) | Respuestas reales | **Código** (gestionable en Fase 2) |
| Historia de Nelly | `src/app/(marca)/nosotros/page.tsx` | "Muy pronto te contaremos aquí la historia completa…" | Historia real | **Código** |
| Imagen OG | `src/app/opengraph-image.tsx` | Wordmark temporal (TODO) | Diseño con logo final | **Código** |
| Favicon | `src/app/icon.svg` | Bowl genérico | Ícono del logo | **Código** |
| Dominio | `NEXT_PUBLIC_SITE_URL` + Supabase/Google config + `TECH_STACK.md` | naturelly.onrender.com | Dominio propio | **Render + Supabase + Google + docs** |
| Pedidos de prueba | Tabla `orders` | `NAT-5XFK`, `NAT-W3KE`, `NAT-YQFC`, `NAT-GU8G`, `NAT-PPJ5`, `NAT-VUKV`, etc. | No se borran (regla); quedan como histórico | — |
| Seed de desarrollo | `supabase/seed.sql` | Datos provisionales | Solo afecta entornos nuevos de dev; no tocar producción | — |

---

## D. Configuración recomendada antes del lanzamiento público ⚙️

**Ya configurado y validado en producción** (no pendiente): variables de Supabase, `NEXT_PUBLIC_SITE_URL`, y **Google OAuth activo** (`NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` en Render — cuenta admin entra a `/admin`, cuenta customer ve "Acceso denegado", cierre de sesión OK). La **recuperación de contraseña también está validada en producción** con el servicio de correo predeterminado de Supabase.

Pendientes y recomendaciones:

- [ ] **WhatsApp real**: `NEXT_PUBLIC_WHATSAPP_NUMBER` sigue placeholder en Render y `.env.local` hasta tener el número de Nelly — es lo único que mantiene deshabilitados los botones verdes.
- [ ] **Usuario admin definitivo de Nelly**: crear con su correo real, promover a admin, y que ella defina su contraseña vía `/recuperar` o `/admin/cuenta`. Retirar accesos de prueba.
- [ ] **SMTP propio (recomendación)**: el correo predeterminado de Supabase funciona y está validado para pruebas, pero tiene límites de envío por hora y no es la configuración recomendada para un lanzamiento comercial. Configurar Resend o SES (ya contemplado en `TECH_STACK.md`) antes de aumentar el volumen de usuarios.
- [ ] **Plan de hosting (recomendación)**: el plan gratuito de Render duerme el servicio tras inactividad (arranques fríos de ~30–60 s); evaluar plan de pago o keep-alive. Revisar también la política de backups del plan de Supabase antes de operar con volumen real.
- [ ] **Dominio propio (recomendación)**: al decidirlo, actualizar `NEXT_PUBLIC_SITE_URL` en Render, Site URL/Redirect URLs en Supabase, orígenes y redirect del OAuth de Google, y `TECH_STACK.md`.
- [ ] **Google Search Console (recomendación)**: verificar propiedad y enviar `sitemap.xml`.
- [ ] **Sesión de carga con Nelly**: recopilar la sección B y cargar el catálogo real desde el panel — sirve además como la "prueba de punta a punta con Nelly" pendiente en `TODO.md`, y de paso se renombra o reutiliza el pack de prueba.

## E. Funciones post-lanzamiento 🔜

Por fase (ver `ROADMAP.md`); ninguna bloquea el lanzamiento:

- **Fase 1 restante:** cuentas de clientes (`/registro`, `/cuenta`, `/cuenta/pedidos`, middleware de `/cuenta`).
- **Fase 2:** blog/recetas gestionables, FAQ y contacto administrables, página de ingredientes, SEO fino (datos estructurados de producto), analytics, testimonios.
- **Fase 3:** pagos online (Culqi vs Mercado Pago, Yape/Plin), correos transaccionales, páginas legales (T&C, privacidad, libro de reclamaciones — requisito legal para cobrar online en Perú).
- **Fase 4:** cupones, reseñas verificadas, suscripción mensual, canal mayorista, notificaciones por WhatsApp Business API.
- **Mejoras técnicas opcionales:** rate limiting en `/api/pedidos` (mencionado en `ARCHITECTURE.md`), migraciones para columnas hoy inexistentes (alérgenos en productos; `compare_at_price`/`badge`/orden de ítems en packs), imagen OG definitiva, monitoreo de errores.

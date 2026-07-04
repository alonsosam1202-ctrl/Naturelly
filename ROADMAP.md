# ROADMAP — Naturelly

## Fase 0 — Fundaciones ✅ (actual)
**Objetivo:** documentación aprobada como fuente de verdad.

- Documentación base (este repositorio de docs).
- Validar con Nelly: nombres reales de productos, precios, tamaños, número de WhatsApp, zonas de delivery.
- Crear proyecto Supabase y repositorio.

**Criterio de salida:** documentación revisada y aprobada en chat; carpeta `naturelly` lista para desarrollo.

## Fase 1 — MVP: catálogo + pedidos por WhatsApp
**Objetivo:** un cliente puede pedir desde la web y ningún pedido se pierde.

1. Setup del proyecto (Next.js + TS + Tailwind + tokens de marca + Supabase).
2. Migraciones SQL: esquema completo + RLS + seeds.
3. Layout global (Header, Footer, MobileNav, CartDrawer).
4. Inicio con storytelling (adaptando el prototipo HTML ya aprobado).
5. Catálogo `/tienda` + detalle `/producto/[slug]` + `/packs`.
6. Carrito (Zustand persist) + `/carrito`.
7. Checkout + RPC `create_order` + página de confirmación + enlace WhatsApp.
8. Auth (registro, login, recuperar) + `/cuenta` + historial de pedidos.
9. Admin: CRUD productos/variantes/imágenes, bundles, gestión de pedidos.
10. Páginas estáticas mínimas: nosotros, FAQ (contenido fijo), contacto.
11. Deploy en Render (provisional: https://naturelly.onrender.com) + dominio propio.

**Criterio de salida:** Nelly gestiona el catálogo sola y procesa pedidos reales de punta a punta.

**Estado (2026-07-03):** todos los flujos previos **validados manualmente en producción** (https://naturelly.onrender.com): tienda pública, carrito, checkout, pedidos con WhatsApp, panel admin completo, autenticación con correo y Google, recuperación de contraseña, y cierre de calidad (SEO técnico, accesibilidad AA, responsive). **Alcance ampliado por decisión de producto: las cuentas de clientes entraron al MVP** — registro (correo + Google), login general con redirección por rol, `/cuenta` con perfil editable, historial y detalle de pedidos propios, y checkout que asocia pedidos a la cuenta (invitados intactos). Implementado con 22/22 pruebas automatizadas en verde; **el MVP se cierra cuando Alonso valide manualmente este módulo**. Para lanzar al público faltan además información y recursos (datos de Nelly, logo/fotos) — ver `docs/LAUNCH_CHECKLIST.md`.

## Fase 2 — Contenido y experiencia de marca
**Objetivo:** la web trabaja el posicionamiento, no solo la venta.

- Blog/recetas con admin propio (markdown + portada + producto relacionado).
- Página de ingredientes/beneficios enriquecida.
- FAQ y mensajes de contacto gestionables desde el admin.
- SEO fino: metadata por página, sitemap, Open Graph, datos estructurados de producto.
- Testimonios reales de clientes.
- Métricas básicas (herramienta por definir, compatible con Render; p. ej. Plausible o Umami) y dashboard admin con resumen de ventas.

## Fase 3 — Pagos online
**Objetivo:** cobrar sin salir de la web (WhatsApp pasa a ser opcional).

- Elegir pasarela tras comparar comisiones vigentes: Culqi vs Mercado Pago.
- Integrar pago con tarjeta + Yape/Plin.
- Estados de pago (`payment_status`) conectados al flujo del pedido.
- Correos transaccionales de confirmación (Resend o SES, experiencia previa del equipo con SES en VOZI).
- Términos y condiciones, política de privacidad y libro de reclamaciones (requisito legal en Perú para ecommerce).

## Fase 4 — Crecimiento
**Objetivo:** recompra y nuevos canales.

- Cupones y descuentos.
- Reseñas de clientes verificadas (compraron el producto).
- Suscripción "Granola del mes".
- Canal mayorista (wholesale) con precios por volumen y acceso especial.
- Notificaciones de estado por WhatsApp Business API.
- Evaluación de envíos fuera de Arequipa.

## Reglas del roadmap

- No se inicia una fase sin cerrar el criterio de salida de la anterior.
- Cualquier funcionalidad nueva que aparezca en el camino se anota en `TODO.md` bajo "Ideas / backlog", no se cuela en la fase actual.
- El esquema de base de datos de la Fase 1 ya contempla las fases 3 y 4 (campos de pago, estructura de bundles) para evitar migraciones dolorosas.

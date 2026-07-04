# PROJECT_BRIEF — Naturelly

## 1. Visión

Naturelly es la marca de **delicias artesanales** de Nelly en Arequipa, Perú. Todo se prepara a mano, en pequeñas cantidades, en su propia cocina.

**Posicionamiento aprobado (2026-07-04): "Naturelly — Delicias artesanales hechas por Nelly".** "Delicias artesanales" es el término paraguas que une la granola, las tortas y los futuros productos artesanales; la web NO se presenta como tienda solo de granola.

La web debe transmitir una experiencia de **marca premium, natural y cálida**, inspirada en el nivel de ecommerce de referentes como Purely Elizabeth, pero con identidad propia. El ángulo narrativo central: **de la cocina de Nelly, para compartir**.

### Realidad actual del negocio (actualizado 2026-07-04)

- Nelly tiene **una sola receta de granola validada**, que ya vende de manera interna a familiares y amigos. **No existen todavía otros sabores o recetas de granola**: la web no debe prometer variedades hasta que Nelly las pruebe y estandarice.
- Sus productos más fuertes y solicitados hoy son las **tortas**: torta de zanahoria (el término "carrot cake" solo se usa como palabra secundaria de búsqueda, nunca como nombre principal), torta de chocolate y torta de naranja, además de tortas con **decoraciones sencillas de fondant** (figuras simples, no trabajos profesionales de alta complejidad).
- Catálogo del arranque: la granola artesanal principal + las tres tortas + la opción de torta personalizada con fondant sencillo. La torta personalizada **no tiene precio fijo ni compra directa**: se presenta como "Cotizar por WhatsApp", con disponibilidad, diseño y precio coordinados previamente.
- **Primera etapa = uso interno** (familiares, amigos y clientes actuales de Nelly), no un lanzamiento público masivo; los requisitos de cada etapa están en `docs/LAUNCH_CHECKLIST.md`.
- Los ingredientes, endulzante, presentaciones y beneficios concretos de cada producto **están pendientes de confirmar con Nelly**; ningún texto de la web debe afirmarlos antes.

## 2. Problema que resuelve

| Situación actual | Con la plataforma |
|---|---|
| Pedidos informales por WhatsApp, sin registro | Pedidos estructurados y guardados en Supabase |
| Sin catálogo visible; los precios se preguntan uno a uno | Catálogo público con precios, tamaños y fotos |
| Sin historial de clientes ni de ventas | Cuentas de cliente + historial + datos para decisiones |
| Gestión de productos depende del desarrollador | Panel admin donde Nelly gestiona todo sola |
| Marca sin presencia digital premium | Storytelling, recetas y experiencia de marca |

## 3. Usuarios

- **Cliente final**: personas en Arequipa (fase 1) que compran granola y tortas para su familia o para ocasiones especiales. Compran desde el celular mayoritariamente → **mobile-first obligatorio**.
- **Invitado**: puede explorar y pedir sin crear cuenta (solo nombre + teléfono). Reducir fricción es prioridad.
- **Admin (Nelly)**: usuaria no técnica. El panel debe ser extremadamente simple: formularios claros, en español, sin jerga.

## 4. Funcionalidades

### Fase 1 — MVP
1. Catálogo de productos con variantes de tamaño (250 g / 500 g), fotos y stock.
2. Página individual de producto con historia, ingredientes y beneficios.
3. Packs / combos (bundles) con precio especial.
4. Carrito persistente (sobrevive a recargas, sin necesidad de cuenta).
5. Checkout que **guarda el pedido en Supabase** y luego abre WhatsApp con el resumen prellenado.
6. Registro / login de clientes (email + contraseña vía Supabase Auth).
7. Cuenta de cliente: datos personales, dirección de entrega, historial de pedidos con estados.
8. Panel admin básico: CRUD de productos, variantes, imágenes (Supabase Storage), bundles y gestión de estados de pedidos.

### Fase 2 — Contenido y marca
9. Blog / recetas gestionables desde el admin.
10. Página de ingredientes y beneficios.
11. FAQ gestionable.
12. Formulario de contacto (mensajes guardados en BD).

### Fase 3+ — Pagos y crecimiento (preparado desde el diseño, no implementado en MVP)
13. Pagos online: Culqi o Mercado Pago (tarjetas), Yape/Plin (QR). La tabla `orders` incluye desde el día 1 los campos `payment_method`, `payment_status` y `payment_reference` para no migrar después.
14. Cupones de descuento, reseñas de clientes, suscripciones (granola mensual), canal mayorista (wholesale).

## 5. Páginas

| Ruta | Página | Acceso |
|---|---|---|
| `/` | Inicio con storytelling de marca | Público |
| `/tienda` | Catálogo con filtros por categoría | Público |
| `/producto/[slug]` | Detalle de producto | Público |
| `/packs` | Combos y bundles | Público |
| `/carrito` | Carrito de compras | Público |
| `/checkout` | Datos de entrega y confirmación | Público (invitado o logueado) |
| `/pedido/[codigo]/confirmado` | Confirmación + botón WhatsApp | Público (con código) |
| `/ingredientes` | Superalimentos y beneficios | Público |
| `/recetas` y `/recetas/[slug]` | Blog de recetas | Público |
| `/nosotros` | Historia de Nelly y la marca | Público |
| `/faq` | Preguntas frecuentes | Público |
| `/contacto` | Formulario de contacto | Público |
| `/login`, `/registro`, `/recuperar` | Autenticación | Público |
| `/cuenta` | Perfil del cliente | Cliente |
| `/cuenta/pedidos` | Historial de pedidos | Cliente |
| `/admin` | Dashboard resumen | Admin |
| `/admin/productos` (+ crear/editar) | Gestión de catálogo | Admin |
| `/admin/packs` | Gestión de bundles | Admin |
| `/admin/pedidos` | Gestión de pedidos y estados | Admin |
| `/admin/recetas`, `/admin/faq` | Gestión de contenido (fase 2) | Admin |

## 6. Flujo de usuario (cliente)

```
Descubre la web → Explora inicio (storytelling) → Entra a /tienda
→ Ve producto → Elige variante (250g/500g) y cantidad → Agrega al carrito
→ Sigue comprando o va a /carrito → Revisa y ajusta cantidades
→ /checkout:
    ├── Logueado: datos precargados
    └── Invitado: nombre + teléfono (+ opción de crear cuenta)
→ Elige entrega (delivery en Arequipa / recojo) → Confirma pedido
→ El pedido se guarda en Supabase (estado: "pendiente", código NAT-XXXX)
→ Se abre WhatsApp con mensaje prellenado (código + resumen + total)
→ Nelly confirma por WhatsApp y actualiza el estado desde /admin/pedidos
→ El cliente logueado ve el estado en /cuenta/pedidos
```

**Regla de oro del flujo:** el pedido SIEMPRE se guarda en la base de datos ANTES de redirigir a WhatsApp. WhatsApp es el canal de confirmación, no el registro.

## 7. Flujo de compra (estados del pedido)

```
pendiente → confirmado → en_preparacion → en_camino → entregado
                └──────────────→ cancelado (desde cualquier estado previo a entregado)
```

- `pendiente`: creado desde la web, aún no confirmado por WhatsApp.
- `confirmado`: Nelly validó el pedido y el método de pago acordado.
- `en_preparacion`: el lote está en producción.
- `en_camino`: salió a delivery.
- `entregado` / `cancelado`: estados finales.

## 8. Fuera de alcance (por ahora)

- Pasarela de pagos en el MVP (solo se deja preparada la estructura).
- Multi-idioma (solo español).
- Envíos fuera de Arequipa (el checkout debe permitir agregar zonas después).
- App móvil nativa.

## 9. Criterios de éxito del MVP

1. Nelly puede crear un producto con foto y precio sin ayuda técnica.
2. Un cliente puede completar un pedido desde el celular en menos de 3 minutos.
3. Ningún pedido se pierde: todo queda registrado en Supabase con código único.
4. La web carga rápido en 4G y se ve impecable en pantallas de 360 px.

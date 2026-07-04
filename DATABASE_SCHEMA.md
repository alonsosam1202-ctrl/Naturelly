# DATABASE_SCHEMA — Naturelly (Supabase / Postgres)

## Diagrama de relaciones

```
auth.users ─1:1─ profiles
                    │1:N
                  orders ─1:N─ order_items ─N:1─ product_variants ─N:1─ products
                                    │                                      │1:N
                                    └────N:1─ bundles ─1:N─ bundle_items──┘│
                                                                 product_images
recipes    faqs    contact_messages    site_settings   (independientes)
```

## Tablas

### `profiles`
Extiende `auth.users`. Se crea automáticamente con un trigger al registrarse.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | = `auth.users.id` |
| `full_name` | `text` | |
| `phone` | `text` | Formato `9XXXXXXXX` |
| `address` | `text` | Dirección de entrega por defecto |
| `district` | `text` | Distrito de Arequipa |
| `role` | `text` | `'customer'` (default) \| `'admin'` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | default `now()`, trigger `set_updated_at` (migración `20260703130000`) |

**Comportamientos del módulo de cuentas (documentados):**
- Desde `/cuenta` el cliente solo puede editar `full_name` y `phone` (whitelist en la server action con su propia sesión — nunca service_role). `role`, `id`, `created_at` y `updated_at` no son editables por el usuario (`updated_at` lo maneja el trigger); el correo se gestiona en Supabase Auth, no en `profiles`.
- `orders.user_id` es `ON DELETE SET NULL`: si una cuenta se elimina, sus pedidos históricos sobreviven como pedidos de invitado.
- Los pedidos de invitado existentes (`user_id = null`) **nunca** se vinculan automáticamente por correo, nombre ni teléfono.
- El `user_id` de un pedido nuevo proviene EXCLUSIVAMENTE de la sesión verificada en el servidor (`getUser()`); jamás del formulario/JSON del navegador.

### `products`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | default `gen_random_uuid()` |
| `slug` | `text` UNIQUE | ej. `andina-power` |
| `name` | `text` | ej. "Andina Power" |
| `tagline` | `text` | frase corta para la card |
| `description` | `text` | descripción completa |
| `story` | `text` | historia/origen (storytelling del detalle) |
| `ingredients` | `text[]` | lista de ingredientes |
| `benefits` | `text[]` | beneficios destacados |
| `category` | `text` | `'clasica' \| 'andina' \| 'chocolate' \| 'especial'` |
| `badge` | `text` NULL | `'nuevo' \| 'mas_vendido' \| 'edicion_limitada'` |
| `is_active` | `boolean` | default `true`; soft delete |
| `sort_order` | `int` | orden en el catálogo |
| `created_at` / `updated_at` | `timestamptz` | |

### `product_variants`
Cada producto se vende en presentaciones distintas. **El precio vive aquí, no en `products`.**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `product_id` | `uuid` FK → products | `on delete cascade` |
| `size_label` | `text` | `'250 g'` \| `'500 g'` |
| `weight_grams` | `int` | 250 / 500 |
| `price` | `numeric(10,2)` | en soles (S/) |
| `compare_at_price` | `numeric(10,2)` NULL | precio tachado para ofertas |
| `stock` | `int` | default 0; el checkout valida contra esto |
| `sku` | `text` UNIQUE | ej. `NAT-AND-250` |
| `is_active` | `boolean` | default `true` |

**Comportamientos del panel admin (documentados):**
- Los productos y variantes **nunca se eliminan físicamente** (los pedidos históricos los referencian): se desactivan con `is_active` (soft delete). Las variantes existentes tampoco se quitan del formulario, solo se desactivan.
- Un producto **activo** no puede quedar sin ninguna presentación activa: el panel bloquea guardar/activar en ese caso con un mensaje claro (no hay override — primero se activa una presentación o se desactiva el producto).
- Al eliminar o reemplazar una imagen, la fila de `product_images` se modifica PRIMERO y el archivo del bucket se borra solo tras confirmarse la BD; un archivo huérfano en Storage es tolerable, una fila apuntando a un archivo inexistente no.

### `product_images`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `product_id` | `uuid` FK → products | `on delete cascade` |
| `url` | `text` | pública, de Supabase Storage (bucket `product-images`) |
| `alt` | `text` | accesibilidad y SEO |
| `position` | `int` | 0 = principal |

### `bundles` y `bundle_items`

```sql
bundles: id, slug UNIQUE, name, description, price numeric(10,2),
         image_url, is_active boolean, created_at

bundle_items: id, bundle_id FK → bundles (cascade),
              variant_id FK → product_variants, quantity int default 1
```

El precio del bundle es fijo (definido por Nelly), no la suma de sus partes: ahí está el descuento.

**Comportamientos del panel admin (documentados):**
- Los packs **nunca se eliminan físicamente** (`order_items` referencia `bundle_id`): se desactivan con `is_active`. Los pedidos históricos conservan nombre y precio (snapshot en `order_items`).
- Al guardar, los `bundle_items` se **reemplazan** por la composición nueva — seguro porque los pedidos no referencian `bundle_items`.
- Un pack **activo** exige al menos una variante activa (de producto activo); el panel bloquea guardar/activar en caso contrario.
- **Imagen**: una sola (`bundles.image_url`), subida al bucket `product-images` bajo `bundles/<id>/…` (el bucket cubre "productos y bundles"). No hay columna `alt`: la tienda usa el nombre del pack como texto alternativo. Reemplazar/quitar sigue la regla BD-primero-Storage-después.
- **Limitaciones del esquema** (se agregarían con migración si Nelly las pide): los packs no tienen `compare_at_price` (precio tachado), `badge`, `sort_order`, ni orden de ítems (`bundle_items` no tiene `position`).
- La **disponibilidad estimada** del panel es `min(floor(stock / cantidad))` sobre sus componentes; la validación real de stock la hace `create_order` con lock al comprar.

### `orders`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `code` | `text` UNIQUE | legible: `NAT-` + 4 caracteres (ej. `NAT-7K2M`) |
| `user_id` | `uuid` FK → profiles, NULL | NULL = pedido de invitado. `ON DELETE SET NULL` (los pedidos sobreviven si se elimina la cuenta). Índice compuesto `(user_id, created_at desc)` para el historial del cliente |
| `customer_name` | `text` | siempre se guarda (aunque haya cuenta) |
| `customer_phone` | `text` | |
| `delivery_method` | `text` | `'delivery' \| 'recojo'` |
| `delivery_address` | `text` NULL | requerido si delivery |
| `delivery_district` | `text` NULL | |
| `notes` | `text` NULL | indicaciones del cliente |
| `subtotal` | `numeric(10,2)` | calculado por el servidor |
| `delivery_fee` | `numeric(10,2)` | default 0 en MVP |
| `total` | `numeric(10,2)` | |
| `status` | `text` | `'pendiente' \| 'confirmado' \| 'en_preparacion' \| 'en_camino' \| 'entregado' \| 'cancelado'` |
| `payment_method` | `text` NULL | preparado para fase 3: `'efectivo' \| 'yape' \| 'plin' \| 'culqi' \| 'mercadopago'` |
| `payment_status` | `text` | `'no_aplica'` (MVP) \| `'pendiente' \| 'pagado' \| 'reembolsado'` |
| `payment_reference` | `text` NULL | id de transacción de la pasarela (fase 3) |
| `created_at` / `updated_at` | `timestamptz` | |

### `order_items`
Snapshot inmutable: si mañana cambia el precio, el pedido histórico no cambia.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | `uuid` PK | |
| `order_id` | `uuid` FK → orders | `on delete cascade` |
| `variant_id` | `uuid` FK → product_variants, NULL | NULL si el ítem es bundle |
| `bundle_id` | `uuid` FK → bundles, NULL | NULL si el ítem es variante |
| `item_name` | `text` | snapshot: "Andina Power · 250 g" |
| `unit_price` | `numeric(10,2)` | snapshot del precio al momento de compra |
| `quantity` | `int` | |
| `subtotal` | `numeric(10,2)` | `unit_price * quantity` |

Constraint: `CHECK ((variant_id IS NOT NULL) <> (bundle_id IS NOT NULL))` — exactamente uno de los dos.

### Contenido (fase 2)

```sql
recipes: id, slug UNIQUE, title, excerpt, content (markdown), cover_url,
         related_product_id FK NULL, is_published boolean, published_at, created_at

faqs: id, question, answer, position int, is_active boolean

contact_messages: id, name, email, phone, message, is_read boolean default false, created_at

site_settings: key text PK, value jsonb
-- ej: ('whatsapp_number', '"51XXXXXXXXX"'), ('delivery_fee_default', '5.00'),
--     ('delivery_districts', '["Cercado","Hunter","JLByR", ...]')
```

## Privilegios (GRANTs) + RLS: dos capas obligatorias

Postgres evalúa el acceso en dos capas independientes y **ambas son necesarias**:

1. **GRANTs**: controlan qué roles (`anon`, `authenticated`, `service_role`) pueden *alcanzar* cada tabla o función (SELECT/INSERT/UPDATE/DELETE/EXECUTE). Sin GRANT, la petición muere con `42501 permission denied` antes de mirar cualquier política.
2. **RLS**: decide *qué filas* y operaciones se permiten dentro de lo ya alcanzable.

Los proyectos de Supabase no otorgan privilegios implícitos sobre las tablas creadas por migraciones, así que la migración `20260703110000_grants.sql` implementa la matriz de mínimo privilegio:

| Rol | Privilegios |
|---|---|
| `anon` | SELECT en catálogo y contenido público; INSERT en `contact_messages`; EXECUTE en `is_admin()` (lo requieren las políticas) |
| `authenticated` | Lo de `anon` + SELECT/UPDATE en `profiles`, SELECT en `orders`/`order_items`, y escritura en catálogo/contenido/pedidos **gateada por RLS `is_admin()`** (el GRANT solo abre la puerta; la política decide) |
| `service_role` | ALL en todas las tablas presentes y futuras (`ALTER DEFAULT PRIVILEGES FOR ROLE postgres`), único con EXECUTE en `create_order(jsonb)` |
| Funciones de trigger (`set_updated_at`, `handle_new_user`, `protect_profile_role`) | Sin EXECUTE para roles de API: solo las dispara el sistema |

## Row Level Security (RLS)

RLS activado en **todas** las tablas. Función auxiliar:

```sql
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
```

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | dueño o admin | trigger del sistema | dueño (sin tocar `role`) o admin | solo admin |
| `products`, `product_variants`, `product_images`, `bundles`, `bundle_items` | público (solo `is_active = true`; admin ve todo) | admin | admin | admin |
| `orders` | dueño (`user_id = auth.uid()`) o admin | **nadie directo** — solo vía función RPC con service role | admin (cambio de estado) | nadie (se cancela, no se borra) |
| `order_items` | vía su order (dueño o admin) | solo RPC | nadie | nadie |
| `recipes`, `faqs` | público (`is_published`/`is_active`; admin ve todo) | admin | admin | admin |
| `contact_messages` | admin | público (cualquiera envía) | admin (`is_read`) | admin |
| `site_settings` | público | admin | admin | admin |

**Nota sobre pedidos de invitados:** como `user_id` es NULL, un invitado no puede consultar su pedido vía RLS. La página de confirmación obtiene los datos mediante un Route Handler que busca por `code` (código no adivinable) usando el cliente de servidor.

## Funciones y triggers

1. `handle_new_user()` — trigger sobre `auth.users` que crea el `profile`.
   - `protect_profile_role()` (trigger en `profiles`): impide que una **sesión de usuario** no-admin cambie roles. Las conexiones de servidor (dashboard SQL como `postgres`, o `service_role`) sí pueden — necesario para promover al primer admin (bootstrap); la clave secreta nunca sale del servidor.
2. `create_order(payload jsonb)` — función RPC transaccional: valida stock, recalcula precios desde BD, inserta `orders` + `order_items`, descuenta stock y devuelve el código. Se invoca solo desde `/api/pedidos` con la `SUPABASE_SECRET_KEY` (rol `service_role`).
3. `set_order_status(p_order_id uuid, p_new_status text)` — función RPC transaccional para el panel admin (migración `20260703120000_order_status.sql`):
   - **Autorización interna:** exige `is_admin()` para sesiones de usuario; EXECUTE solo para `authenticated` y `service_role`. Ni un cliente logueado no-admin llamándola directo por PostgREST puede usarla.
   - **Transiciones válidas:** `pendiente→confirmado→en_preparacion→en_camino→entregado`; `cancelado` desde cualquier estado previo a `entregado`. `entregado` y `cancelado` son finales (no se reactiva un cancelado ni se retrocede un entregado).
   - **Cancelación con reposición de stock:** bloquea la fila del pedido (`FOR UPDATE`), verifica el estado anterior y repone el stock de variantes y de los componentes de bundles **exactamente una vez**. Llamarla de nuevo con `cancelado` es un no-op (idempotente). `updated_at` se actualiza vía trigger.
   - Nota: la reposición de bundles usa la composición **actual** de `bundle_items`; si un pack cambió después del pedido, revisar el stock manualmente.
   - Un `UPDATE` directo de `status` (dashboard/SQL) **no** repone stock: el panel siempre usa esta RPC.
4. `set_updated_at()` — trigger genérico para `updated_at`.

## Storage

| Bucket | Acceso | Contenido |
|---|---|---|
| `product-images` | Lectura pública, escritura solo admin | Fotos de productos y bundles |
| `recipe-images` | Lectura pública, escritura solo admin | Portadas de recetas (fase 2) |

## Datos semilla (seed de desarrollo)

- 1 usuario admin (correo de Nelly).
- 3 productos con 2 variantes cada uno (Clásica de Miel, Andina Power, Cacao & Café — nombres provisionales a validar con Nelly).
- 1 bundle ("Pack Trío Naturelly" — nombre provisional a validar con Nelly).
- 5 FAQs y ajustes iniciales de `site_settings`.

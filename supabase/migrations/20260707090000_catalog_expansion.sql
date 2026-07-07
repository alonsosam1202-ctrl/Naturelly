-- Expansión del catálogo real (Etapa 1, aprobada por Alonso 2026-07-07):
-- 1) Categorías nuevas del negocio: postre, salado, cupcake.
-- 2) allergens: alérgenos declarados por producto (patrón de ingredients).
-- 3) is_quote_only: productos solo por cotización (torta de novia, naked
--    cake) — sin variantes ni precio; la UI muestra "Cotizar por WhatsApp"
--    y nunca entran al carrito ni a create_order.
-- 4) price nullable: variantes con precio PENDIENTE. Regla de aplicación
--    (panel + Zod en servidor): una variante sin precio no puede activarse;
--    create_order solo vende variantes activas, así que un precio NULL
--    jamás llega al checkout. El RPC no se toca.
--
-- No modifica filas existentes ni RLS/grants (las columnas nuevas heredan
-- los privilegios de la tabla).

alter table public.products
  drop constraint products_category_check;

alter table public.products
  add constraint products_category_check
  check (category in (
    'granola', 'torta', 'postre', 'salado', 'cupcake', 'personalizado',
    -- legado de placeholders (retirar cuando ya no existan productos que los usen)
    'clasica', 'andina', 'chocolate', 'especial'
  ));

alter table public.products
  add column allergens text[] not null default '{}';

alter table public.products
  add column is_quote_only boolean not null default false;

alter table public.product_variants
  alter column price drop not null;

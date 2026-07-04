-- Categorías reales del catálogo + peso opcional en variantes.
--
-- Contexto (DATABASE_SCHEMA.md, actualizado primero):
-- 1) El negocio real vende granola (una receta), tortas y pedidos
--    personalizados. El CHECK original solo admitía sabores placeholder de
--    granola. Se agregan 'granola' | 'torta' | 'personalizado' y se
--    CONSERVAN los cuatro valores antiguos porque los productos placeholder
--    existentes los usan (sus pedidos históricos no se tocan).
-- 2) Las tortas se describen por tamaño/porciones en size_label (texto
--    libre), no por peso: weight_grams pasa a ser NULL-able. Las filas
--    existentes conservan su peso; no se modifica ningún dato.
--
-- Sin cambios en variantes existentes, precios, stock, order_items, RLS,
-- grants ni RPCs.

alter table public.products
  drop constraint products_category_check;

alter table public.products
  add constraint products_category_check
  check (category in (
    'granola', 'torta', 'personalizado',
    -- legado de placeholders (retirar cuando ya no existan productos que los usen)
    'clasica', 'andina', 'chocolate', 'especial'
  ));

alter table public.product_variants
  alter column weight_grams drop not null;

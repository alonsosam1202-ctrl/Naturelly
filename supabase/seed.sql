-- seed.sql — Datos SOLO para desarrollo. NO ejecutar en producción tal cual.
--
-- ⚠️ TODO: confirmar con Nelly — todos los nombres, precios, stock e
-- ingredientes de este seed son placeholders provisionales (los nombres
-- salen de la lista "a validar" de DATABASE_SCHEMA.md).
--
-- Usuario admin: crear el usuario (correo de Nelly) desde el dashboard de
-- Supabase Auth y luego promoverlo:
--   update public.profiles set role = 'admin' where id = '<uuid-del-usuario>';

-- ── Productos (nombres provisionales a validar con Nelly) ────────────────
insert into public.products (id, slug, name, tagline, description, story, ingredients, benefits, category, badge, sort_order) values
(
  'a0000000-0000-4000-8000-000000000001',
  'clasica-de-miel',
  'Clásica de Miel', -- TODO: confirmar con Nelly
  'La receta de siempre, dorada y crocante',
  'Avena tostada en tandas pequeñas y endulzada solo con miel de abeja.',
  'TODO: confirmar con Nelly la historia real de esta granola.',
  array['Avena', 'Miel de abeja'], -- TODO: confirmar receta con Nelly
  array['Endulzada solo con miel', 'Tostada a mano en tandas pequeñas'],
  'clasica', null, 1
),
(
  'a0000000-0000-4000-8000-000000000002',
  'andina-power',
  'Andina Power', -- TODO: confirmar con Nelly
  'Quinua, kiwicha y aguaymanto de la tierra',
  'Granola con superalimentos andinos comprados frescos, del origen.',
  'TODO: confirmar con Nelly la historia real de esta granola.',
  array['Avena', 'Quinua', 'Kiwicha', 'Aguaymanto', 'Miel de abeja'], -- TODO: confirmar receta
  array['Superalimentos andinos', 'Endulzada solo con miel'],
  'andina', 'mas_vendido', 2
),
(
  'a0000000-0000-4000-8000-000000000003',
  'cacao-cafe',
  'Cacao & Café', -- TODO: confirmar con Nelly
  'Intensa, chocolatosa y nada empalagosa',
  'Granola con cacao peruano, tostada a mano.',
  'TODO: confirmar con Nelly la historia real de esta granola.',
  array['Avena', 'Cacao', 'Café', 'Miel de abeja'], -- TODO: confirmar receta
  array['Cacao peruano', 'Endulzada solo con miel'],
  'chocolate', 'nuevo', 3
);

-- ── Variantes (precios y stock placeholder — TODO: confirmar con Nelly) ──
insert into public.product_variants (id, product_id, size_label, weight_grams, price, compare_at_price, stock, sku) values
('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', '250 g', 250, 20.00, null, 10, 'NAT-CLA-250'),
('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000001', '500 g', 500, 36.00, null, 10, 'NAT-CLA-500'),
('b0000000-0000-4000-8000-000000000021', 'a0000000-0000-4000-8000-000000000002', '250 g', 250, 24.00, null, 10, 'NAT-AND-250'),
('b0000000-0000-4000-8000-000000000022', 'a0000000-0000-4000-8000-000000000002', '500 g', 500, 42.00, null, 10, 'NAT-AND-500'),
('b0000000-0000-4000-8000-000000000031', 'a0000000-0000-4000-8000-000000000003', '250 g', 250, 24.00, null, 10, 'NAT-CAF-250'),
('b0000000-0000-4000-8000-000000000032', 'a0000000-0000-4000-8000-000000000003', '500 g', 500, 42.00, null, 10, 'NAT-CAF-500');

-- ── Bundle (nombre y precio placeholder — TODO: confirmar con Nelly) ─────
insert into public.bundles (id, slug, name, description, price) values
(
  'c0000000-0000-4000-8000-000000000100',
  'pack-trio-naturelly',
  'Pack Trío Naturelly',
  'Nuestras tres granolas de 250 g para probarlas todas.',
  62.00
);

insert into public.bundle_items (bundle_id, variant_id, quantity) values
('c0000000-0000-4000-8000-000000000100', 'b0000000-0000-4000-8000-000000000011', 1),
('c0000000-0000-4000-8000-000000000100', 'b0000000-0000-4000-8000-000000000021', 1),
('c0000000-0000-4000-8000-000000000100', 'b0000000-0000-4000-8000-000000000031', 1);

-- ── FAQs ─────────────────────────────────────────────────────────────────
insert into public.faqs (question, answer, position) values
('¿Cómo hago mi pedido?', 'Arma tu carrito en la tienda, completa tus datos y tu pedido queda registrado con un código único. Al final te llevamos a WhatsApp para confirmarlo con Nelly.', 1),
('¿Dónde hacen delivery?', 'Por ahora entregamos en Arequipa. Los distritos disponibles y el costo se confirman por WhatsApp al coordinar tu pedido.', 2), -- TODO: confirmar distritos con Nelly
('¿Cómo pago?', 'El pago se coordina por WhatsApp al confirmar tu pedido. Muy pronto podrás pagar directamente desde la web.', 3),
('¿La granola tiene azúcar añadida?', 'No. Usamos miel de abeja como único endulzante, sobre avena y superalimentos andinos tostados a mano.', 4),
('¿Hacen envíos fuera de Arequipa?', 'Todavía no, pero está en nuestros planes. Si eres de otra ciudad, escríbenos y te avisamos apenas lleguemos allá.', 5);

-- ── Ajustes del sitio ────────────────────────────────────────────────────
insert into public.site_settings (key, value) values
('whatsapp_number', '"51XXXXXXXXX"'), -- TODO: confirmar con Nelly
('delivery_fee_default', '0.00'),
('delivery_districts', '["Cercado", "Hunter", "José Luis Bustamante y Rivero"]'); -- TODO: confirmar con Nelly

-- 003_orders.sql — orders + order_items + RPC create_order según DATABASE_SCHEMA.md

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  user_id uuid references public.profiles (id),
  customer_name text not null,
  customer_phone text not null,
  delivery_method text not null check (delivery_method in ('delivery', 'recojo')),
  delivery_address text,
  delivery_district text,
  notes text,
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado')),
  payment_method text
    check (payment_method in ('efectivo', 'yape', 'plin', 'culqi', 'mercadopago')),
  payment_status text not null default 'no_aplica'
    check (payment_status in ('no_aplica', 'pendiente', 'pagado', 'reembolsado')),
  payment_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Snapshot inmutable: si mañana cambia el precio, el pedido histórico no cambia
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id),
  bundle_id uuid references public.bundles (id),
  item_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  subtotal numeric(10,2) not null,
  -- Exactamente uno de los dos: variante o bundle
  check ((variant_id is not null) <> (bundle_id is not null))
);

create index order_items_order_id_idx on public.order_items (order_id);

-- Función RPC transaccional: valida stock, recalcula precios desde la BD,
-- inserta orders + order_items, descuenta stock y devuelve el resumen.
-- Se invoca SOLO desde /api/pedidos con service role.
create or replace function public.create_order(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  qty int;
  v record;
  b record;
  bi record;
  new_order_id uuid;
  new_code text;
  order_subtotal numeric(10,2) := 0;
  order_delivery_fee numeric(10,2) := 0; -- MVP: 0, se coordina por WhatsApp
  line_subtotal numeric(10,2);
  line_name text;
  items_out jsonb := '[]'::jsonb;
  method text := payload ->> 'delivery_method';
begin
  if payload -> 'items' is null or jsonb_array_length(payload -> 'items') = 0 then
    raise exception 'El pedido no tiene productos';
  end if;

  if method not in ('delivery', 'recojo') then
    raise exception 'Método de entrega inválido';
  end if;

  if method = 'delivery' and coalesce(trim(payload ->> 'delivery_address'), '') = '' then
    raise exception 'La dirección es obligatoria para delivery';
  end if;

  -- Código legible único NAT-XXXX (sin caracteres ambiguos: I, L, O, 0, 1)
  loop
    select 'NAT-' || string_agg(
             substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (floor(random() * 31) + 1)::int, 1),
             ''
           )
      into new_code
      from generate_series(1, 4);
    exit when not exists (select 1 from public.orders o where o.code = new_code);
  end loop;

  insert into public.orders (
    code, user_id, customer_name, customer_phone, delivery_method,
    delivery_address, delivery_district, notes,
    subtotal, delivery_fee, total, status, payment_status
  )
  values (
    new_code,
    nullif(payload ->> 'user_id', '')::uuid,
    payload ->> 'customer_name',
    payload ->> 'customer_phone',
    method,
    nullif(payload ->> 'delivery_address', ''),
    nullif(payload ->> 'delivery_district', ''),
    nullif(payload ->> 'notes', ''),
    0, order_delivery_fee, 0, 'pendiente', 'no_aplica'
  )
  returning id into new_order_id;

  for item in select * from jsonb_array_elements(payload -> 'items') loop
    qty := coalesce((item ->> 'quantity')::int, 0);
    if qty < 1 or qty > 50 then
      raise exception 'Cantidad inválida';
    end if;

    if item ->> 'variant_id' is not null then
      select pv.id, pv.price, pv.stock, pv.size_label, p.name as product_name
        into v
        from public.product_variants pv
        join public.products p on p.id = pv.product_id
       where pv.id = (item ->> 'variant_id')::uuid
         and pv.is_active
         and p.is_active
         for update of pv;

      if not found then
        raise exception 'Producto no disponible';
      end if;
      if v.stock < qty then
        raise exception 'Stock insuficiente para %', v.product_name;
      end if;

      line_name := v.product_name || ' · ' || v.size_label;
      line_subtotal := v.price * qty;

      insert into public.order_items (order_id, variant_id, item_name, unit_price, quantity, subtotal)
      values (new_order_id, v.id, line_name, v.price, qty, line_subtotal);

      update public.product_variants set stock = stock - qty where id = v.id;

    elsif item ->> 'bundle_id' is not null then
      select bu.id, bu.price, bu.name
        into b
        from public.bundles bu
       where bu.id = (item ->> 'bundle_id')::uuid
         and bu.is_active
         for update;

      if not found then
        raise exception 'Pack no disponible';
      end if;

      -- Validar y descontar stock de cada variante del pack
      for bi in
        select pv.id as variant_id, pv.stock, bit.quantity as per_bundle, p.name as product_name
          from public.bundle_items bit
          join public.product_variants pv on pv.id = bit.variant_id
          join public.products p on p.id = pv.product_id
         where bit.bundle_id = b.id
         for update of pv
      loop
        if bi.stock < bi.per_bundle * qty then
          raise exception 'Stock insuficiente para % (dentro del pack)', bi.product_name;
        end if;
        update public.product_variants
           set stock = stock - (bi.per_bundle * qty)
         where id = bi.variant_id;
      end loop;

      line_name := b.name;
      line_subtotal := b.price * qty;

      insert into public.order_items (order_id, bundle_id, item_name, unit_price, quantity, subtotal)
      values (new_order_id, b.id, line_name, b.price, qty, line_subtotal);

    else
      raise exception 'Ítem inválido';
    end if;

    order_subtotal := order_subtotal + line_subtotal;
    items_out := items_out || jsonb_build_object(
      'name', line_name,
      'quantity', qty,
      'unit_price', line_subtotal / qty,
      'subtotal', line_subtotal
    );
  end loop;

  update public.orders
     set subtotal = order_subtotal,
         total = order_subtotal + order_delivery_fee
   where id = new_order_id;

  return jsonb_build_object(
    'code', new_code,
    'subtotal', order_subtotal,
    'delivery_fee', order_delivery_fee,
    'total', order_subtotal + order_delivery_fee,
    'items', items_out
  );
end;
$$;

-- Solo el service role puede crear pedidos (RLS: "nadie directo")
revoke execute on function public.create_order(jsonb) from public;
revoke execute on function public.create_order(jsonb) from anon, authenticated;

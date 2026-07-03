-- 004_rls.sql — Políticas RLS completas + función is_admin() según DATABASE_SCHEMA.md
-- RLS activado en TODAS las tablas. Nunca desactivarlo ni crear políticas
-- permisivas "temporales".

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.bundles enable row level security;
alter table public.bundle_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ── profiles ─────────────────────────────────────────────────────────────
-- SELECT: dueño o admin · INSERT: solo trigger del sistema · UPDATE: dueño
-- (sin tocar role, ver trigger) o admin · DELETE: solo admin
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "profiles_delete_admin" on public.profiles
  for delete using (public.is_admin());

-- Un cliente no puede auto-promoverse a admin
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'No puedes cambiar tu rol';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- ── catálogo ─────────────────────────────────────────────────────────────
-- SELECT: público solo lo activo (admin ve todo) · escritura: solo admin
create policy "products_select_public" on public.products
  for select using (is_active or public.is_admin());
create policy "products_insert_admin" on public.products
  for insert with check (public.is_admin());
create policy "products_update_admin" on public.products
  for update using (public.is_admin());
create policy "products_delete_admin" on public.products
  for delete using (public.is_admin());

create policy "variants_select_public" on public.product_variants
  for select using (
    (is_active and exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active
    )) or public.is_admin()
  );
create policy "variants_insert_admin" on public.product_variants
  for insert with check (public.is_admin());
create policy "variants_update_admin" on public.product_variants
  for update using (public.is_admin());
create policy "variants_delete_admin" on public.product_variants
  for delete using (public.is_admin());

create policy "images_select_public" on public.product_images
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active
    ) or public.is_admin()
  );
create policy "images_insert_admin" on public.product_images
  for insert with check (public.is_admin());
create policy "images_update_admin" on public.product_images
  for update using (public.is_admin());
create policy "images_delete_admin" on public.product_images
  for delete using (public.is_admin());

create policy "bundles_select_public" on public.bundles
  for select using (is_active or public.is_admin());
create policy "bundles_insert_admin" on public.bundles
  for insert with check (public.is_admin());
create policy "bundles_update_admin" on public.bundles
  for update using (public.is_admin());
create policy "bundles_delete_admin" on public.bundles
  for delete using (public.is_admin());

create policy "bundle_items_select_public" on public.bundle_items
  for select using (
    exists (
      select 1 from public.bundles b
      where b.id = bundle_id and b.is_active
    ) or public.is_admin()
  );
create policy "bundle_items_insert_admin" on public.bundle_items
  for insert with check (public.is_admin());
create policy "bundle_items_update_admin" on public.bundle_items
  for update using (public.is_admin());
create policy "bundle_items_delete_admin" on public.bundle_items
  for delete using (public.is_admin());

-- ── orders ───────────────────────────────────────────────────────────────
-- SELECT: dueño o admin · INSERT: nadie directo (solo RPC con service role)
-- UPDATE: admin (cambio de estado) · DELETE: nadie (se cancela, no se borra)
create policy "orders_select_own_or_admin" on public.orders
  for select using (
    (user_id is not null and user_id = auth.uid()) or public.is_admin()
  );

create policy "orders_update_admin" on public.orders
  for update using (public.is_admin());

-- ── order_items ──────────────────────────────────────────────────────────
-- SELECT: vía su order (dueño o admin) · INSERT: solo RPC · resto: nadie
create policy "order_items_select_via_order" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and ((o.user_id is not null and o.user_id = auth.uid()) or public.is_admin())
    )
  );

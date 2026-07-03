-- 20260703100400_content.sql — Contenido según DATABASE_SCHEMA.md
-- faqs, contact_messages, site_settings; recipes queda creada para Fase 2

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text, -- markdown
  cover_url text,
  related_product_id uuid references public.products (id),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  position int not null default 0,
  is_active boolean not null default true
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null
);

-- RLS
alter table public.recipes enable row level security;
alter table public.faqs enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "recipes_select_public" on public.recipes
  for select using (is_published or public.is_admin());
create policy "recipes_insert_admin" on public.recipes
  for insert with check (public.is_admin());
create policy "recipes_update_admin" on public.recipes
  for update using (public.is_admin());
create policy "recipes_delete_admin" on public.recipes
  for delete using (public.is_admin());

create policy "faqs_select_public" on public.faqs
  for select using (is_active or public.is_admin());
create policy "faqs_insert_admin" on public.faqs
  for insert with check (public.is_admin());
create policy "faqs_update_admin" on public.faqs
  for update using (public.is_admin());
create policy "faqs_delete_admin" on public.faqs
  for delete using (public.is_admin());

-- Cualquiera puede escribirnos; solo el admin lee y gestiona
create policy "contact_messages_insert_public" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_select_admin" on public.contact_messages
  for select using (public.is_admin());
create policy "contact_messages_update_admin" on public.contact_messages
  for update using (public.is_admin());
create policy "contact_messages_delete_admin" on public.contact_messages
  for delete using (public.is_admin());

create policy "site_settings_select_public" on public.site_settings
  for select using (true);
create policy "site_settings_insert_admin" on public.site_settings
  for insert with check (public.is_admin());
create policy "site_settings_update_admin" on public.site_settings
  for update using (public.is_admin());
create policy "site_settings_delete_admin" on public.site_settings
  for delete using (public.is_admin());

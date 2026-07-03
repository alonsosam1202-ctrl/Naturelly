-- 001_catalog.sql — Tablas de catálogo según DATABASE_SCHEMA.md
-- products, product_variants, product_images, bundles, bundle_items

-- Trigger genérico para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  story text,
  ingredients text[] not null default '{}',
  benefits text[] not null default '{}',
  category text not null check (category in ('clasica', 'andina', 'chocolate', 'especial')),
  badge text check (badge in ('nuevo', 'mas_vendido', 'edicion_limitada')),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- El precio vive en la variante, no en el producto
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size_label text not null,
  weight_grams int not null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  stock int not null default 0 check (stock >= 0),
  sku text unique not null,
  is_active boolean not null default true
);

create index product_variants_product_id_idx on public.product_variants (product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text not null default '',
  position int not null default 0
);

create index product_images_product_id_idx on public.product_images (product_id);

-- El precio del bundle es fijo (definido por Nelly): ahí está el descuento
create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bundle_items (
  id uuid primary key default gen_random_uuid(),
  bundle_id uuid not null references public.bundles (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id),
  quantity int not null default 1 check (quantity > 0)
);

create index bundle_items_bundle_id_idx on public.bundle_items (bundle_id);

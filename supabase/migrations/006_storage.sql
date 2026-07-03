-- 006_storage.sql — Buckets de Storage con políticas según DATABASE_SCHEMA.md
-- product-images y recipe-images: lectura pública, escritura solo admin

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

create policy "storage_public_read"
  on storage.objects for select
  using (bucket_id in ('product-images', 'recipe-images'));

create policy "storage_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id in ('product-images', 'recipe-images') and public.is_admin()
  );

create policy "storage_admin_update"
  on storage.objects for update
  using (
    bucket_id in ('product-images', 'recipe-images') and public.is_admin()
  );

create policy "storage_admin_delete"
  on storage.objects for delete
  using (
    bucket_id in ('product-images', 'recipe-images') and public.is_admin()
  );

-- Bucket site-assets: archivos estáticos del sitio que no son fotos de
-- producto (ej. el video del hero de /tienda). Mismo patrón de acceso que
-- product-images (DATABASE_SCHEMA.md, sección Storage): lectura pública,
-- escritura/actualización/borrado solo admin (is_admin()).
-- Así los assets pesados viven fuera del repo y se cambian sin deploy.

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

create policy "site_assets_public_read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "site_assets_admin_insert"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' and public.is_admin());

create policy "site_assets_admin_update"
  on storage.objects for update
  using (bucket_id = 'site-assets' and public.is_admin());

create policy "site_assets_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'site-assets' and public.is_admin());

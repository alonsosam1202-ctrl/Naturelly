-- 20260703110000_grants.sql — Privilegios de tabla/función según DATABASE_SCHEMA.md
--
-- Los proyectos de Supabase no otorgan privilegios implícitos sobre tablas
-- creadas por migraciones: RLS decide las filas, pero cada rol de la API
-- necesita GRANTs para alcanzar la tabla. Esta migración implementa la
-- matriz de mínimo privilegio (ver "Privilegios (GRANTs) + RLS").

-- ── Esquema ───────────────────────────────────────────────────────────────
grant usage on schema public to anon, authenticated, service_role;

-- ── service_role: acceso total (salta RLS, pero requiere GRANTs) ─────────
grant all on all tables in schema public to service_role;

-- Tablas futuras creadas por migraciones (rol postgres)
alter default privileges for role postgres in schema public
  grant all on tables to service_role;

-- ── anon + authenticated: catálogo y contenido público (RLS filtra) ──────
grant select on
  public.products,
  public.product_variants,
  public.product_images,
  public.bundles,
  public.bundle_items,
  public.recipes,
  public.faqs,
  public.site_settings
to anon, authenticated;

-- Contacto: cualquiera puede escribirnos
grant insert on public.contact_messages to anon, authenticated;

-- ── authenticated: su perfil y sus pedidos (RLS limita al dueño) ─────────
grant select, update on public.profiles to authenticated;
grant select on public.orders, public.order_items to authenticated;

-- ── admin: usuario authenticated gateado por la política is_admin() ──────
-- El GRANT solo abre la puerta; sin política que lo permita, un cliente
-- logueado normal NO puede escribir (RLS rechaza la fila).
grant insert, update, delete on
  public.products,
  public.product_variants,
  public.product_images,
  public.bundles,
  public.bundle_items,
  public.recipes,
  public.faqs,
  public.site_settings
to authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant update on public.orders to authenticated;        -- cambio de estado (RLS: solo admin)
grant delete on public.profiles to authenticated;      -- RLS: solo admin

-- ── Funciones (auditoría de mínimo privilegio) ────────────────────────────

-- create_order: SOLO service_role. El REVOKE de la migración de orders
-- también se lo quitó a service_role; se restituye explícitamente.
revoke execute on function public.create_order(jsonb) from public;
revoke execute on function public.create_order(jsonb) from anon, authenticated;
grant execute on function public.create_order(jsonb) to service_role;

-- is_admin: la evalúan las políticas RLS en el contexto del rol que
-- consulta, así que anon y authenticated NECESITAN execute (revocarla
-- rompería hasta el SELECT público del catálogo).
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- Funciones de trigger: solo las dispara el sistema (el chequeo de ACL
-- ocurre al crear el trigger, no al dispararse), ningún rol de API debe
-- poder invocarlas directamente.
revoke execute on function public.set_updated_at() from public;
revoke execute on function public.set_updated_at() from anon, authenticated;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.protect_profile_role() from public;
revoke execute on function public.protect_profile_role() from anon, authenticated;

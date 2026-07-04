-- 20260703130000_customer_accounts.sql — Módulo de cuentas de clientes
-- según DATABASE_SCHEMA.md (profiles.updated_at, FK de pedidos que
-- sobrevive a la eliminación de la cuenta, índice del historial).
--
-- ROLLBACK documentado (sin pérdida de datos):
--   drop trigger if exists profiles_set_updated_at on public.profiles;
--   alter table public.profiles drop column if exists updated_at;
--   alter table public.orders drop constraint if exists orders_user_id_fkey;
--   alter table public.orders add constraint orders_user_id_fkey
--     foreign key (user_id) references public.profiles (id);
--   drop index if exists public.orders_user_id_created_at_idx;
--   create index if not exists orders_user_id_idx on public.orders (user_id);

-- ── profiles.updated_at ───────────────────────────────────────────────────
-- Reutiliza public.set_updated_at() (definida en 20260703100000_catalog.sql
-- y ya operando en producción sobre orders): asigna new.updated_at = now()
-- para cualquier tabla con esa columna.
alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ── orders.user_id: ON DELETE SET NULL ────────────────────────────────────
-- Si una cuenta se elimina, sus pedidos históricos sobreviven como pedidos
-- de invitado (user_id = null). Todos los valores actuales son null o
-- válidos, así que la nueva FK valida sin reescritura de datos.
alter table public.orders drop constraint if exists orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete set null;

-- ── Índice del historial del cliente ─────────────────────────────────────
-- Cubre el listado de /cuenta/pedidos (filtro por user_id + orden por
-- fecha) y, por prefijo izquierdo, también las búsquedas por user_id solas
-- (política RLS de orders).
create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

-- El índice simple queda 100% cubierto por el compuesto (prefijo izquierdo
-- en igualdad user_id = auth.uid()): se elimina para no mantener dos
-- índices redundantes en cada INSERT/UPDATE de pedidos. Nombre verificado
-- en la migración aplicada 20260703100200_orders.sql.
drop index if exists public.orders_user_id_idx;

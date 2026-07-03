-- 20260703120000_order_status.sql — RPC set_order_status + bootstrap de rol admin
-- según DATABASE_SCHEMA.md (sección "Funciones y triggers").

-- ── set_order_status: cambio de estado transaccional para el panel admin ──
-- Transiciones válidas: pendiente→confirmado→en_preparacion→en_camino→entregado;
-- cancelado desde cualquier estado previo a entregado. entregado y cancelado
-- son finales. Cancelar repone stock (variantes y bundles) exactamente una
-- vez; repetir la llamada es un no-op (idempotente).
create or replace function public.set_order_status(p_order_id uuid, p_new_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order record;
  v_item record;
  v_bi record;
  v_restocked boolean := false;
  v_allowed text[];
begin
  -- Autorización dentro de la función (defensa en profundidad): las
  -- sesiones de usuario requieren rol admin; anon ni siquiera tiene EXECUTE.
  if auth.role() = 'authenticated' and not public.is_admin() then
    raise exception 'No autorizado';
  end if;

  if p_new_status not in ('pendiente','confirmado','en_preparacion','en_camino','entregado','cancelado') then
    raise exception 'Estado inválido';
  end if;

  -- Bloquea la fila del pedido durante toda la operación
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    raise exception 'Pedido no encontrado';
  end if;

  -- Idempotencia: mismo estado => no-op (cancelar dos veces no repone doble)
  if v_order.status = p_new_status then
    return jsonb_build_object(
      'code', v_order.code,
      'old_status', v_order.status,
      'new_status', p_new_status,
      'changed', false,
      'restocked', false
    );
  end if;

  v_allowed := case v_order.status
    when 'pendiente' then array['confirmado', 'cancelado']
    when 'confirmado' then array['en_preparacion', 'cancelado']
    when 'en_preparacion' then array['en_camino', 'cancelado']
    when 'en_camino' then array['entregado', 'cancelado']
    else array[]::text[] -- entregado y cancelado son estados finales
  end;

  if not (p_new_status = any (v_allowed)) then
    raise exception 'Transición no permitida: % → %', v_order.status, p_new_status;
  end if;

  if p_new_status = 'cancelado' then
    -- Reposición exactamente una vez: la fila está bloqueada y el estado
    -- anterior ya se validó distinto de cancelado.
    for v_item in
      select variant_id, bundle_id, quantity
        from public.order_items
       where order_id = p_order_id
    loop
      if v_item.variant_id is not null then
        update public.product_variants
           set stock = stock + v_item.quantity
         where id = v_item.variant_id;
      elsif v_item.bundle_id is not null then
        -- Nota: usa la composición ACTUAL del bundle (ver DATABASE_SCHEMA.md)
        for v_bi in
          select variant_id, quantity
            from public.bundle_items
           where bundle_id = v_item.bundle_id
        loop
          update public.product_variants
             set stock = stock + (v_bi.quantity * v_item.quantity)
           where id = v_bi.variant_id;
        end loop;
      end if;
    end loop;
    v_restocked := true;
  end if;

  update public.orders set status = p_new_status where id = p_order_id;

  return jsonb_build_object(
    'code', v_order.code,
    'old_status', v_order.status,
    'new_status', p_new_status,
    'changed', true,
    'restocked', v_restocked
  );
end;
$$;

revoke execute on function public.set_order_status(uuid, text) from public;
revoke execute on function public.set_order_status(uuid, text) from anon;
grant execute on function public.set_order_status(uuid, text) to authenticated, service_role;

-- ── Bootstrap del rol admin ───────────────────────────────────────────────
-- El trigger anti-escalada bloqueaba también a postgres (dashboard SQL) y a
-- service_role, haciendo imposible promover al PRIMER admin. Se restringe la
-- protección a sesiones de usuario: un cliente logueado no-admin sigue sin
-- poder cambiar roles; el servidor (secret key) y el dashboard sí pueden.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.role() = 'authenticated'
     and not public.is_admin() then
    raise exception 'No puedes cambiar tu rol';
  end if;
  return new;
end;
$$;

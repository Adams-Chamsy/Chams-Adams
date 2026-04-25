-- =============================================================
-- 006 — Customer account, care pictos, returns/loyalty self-read
-- =============================================================

-- ---------- Care pictos sur produits ----------

alter table public.products
  add column if not exists care_pictos text[] default '{}';

-- ---------- Policies idempotentes via blocs DO ----------

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'order_items'
      and policyname = 'admin write order items'
  ) then
    create policy "admin write order items"
      on public.order_items for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'return_requests'
      and policyname = 'users read own returns'
  ) then
    create policy "users read own returns"
      on public.return_requests for select
      using (email = (select email from auth.users where id = auth.uid()));
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'loyalty_points'
      and policyname = 'users read own loyalty'
  ) then
    create policy "users read own loyalty"
      on public.loyalty_points for select
      using (email = (select email from auth.users where id = auth.uid()));
  end if;
end$$;

-- ---------- Index pour /compte (lookups par email) ----------

create index if not exists return_requests_email_idx
  on public.return_requests(email);

create index if not exists loyalty_points_email_idx
  on public.loyalty_points(email, created_at desc);

create index if not exists orders_email_idx
  on public.orders(email, created_at desc);

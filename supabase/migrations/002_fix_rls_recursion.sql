-- =============================================================
-- Fix RLS récursive sur admin_users
-- =============================================================
-- Le policy "admins write by admin" introduisait une récursion
-- (select sur admin_users dans une policy sur admin_users).
-- On drop cette policy (admin_users est géré via service_role
-- uniquement) et on passe is_admin() en SECURITY DEFINER pour
-- qu'elle bypasse la RLS quand elle est appelée depuis d'autres
-- policies (faq, events, products…).
-- =============================================================

drop policy if exists "admins write by admin" on public.admin_users;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable as $$
  select exists (
    select 1 from public.admin_users
    where id = uid and role in ('admin', 'editor')
  );
$$;

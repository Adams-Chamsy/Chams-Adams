-- =============================================================
-- Storage — bucket public `media` + policies admin
-- =============================================================

-- Création du bucket (idempotent)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = excluded.public;

-- Policies storage.objects
drop policy if exists "media public read" on storage.objects;
drop policy if exists "media admin insert" on storage.objects;
drop policy if exists "media admin update" on storage.objects;
drop policy if exists "media admin delete" on storage.objects;

create policy "media public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media admin insert"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin(auth.uid()));

create policy "media admin update"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin(auth.uid()))
  with check (bucket_id = 'media' and public.is_admin(auth.uid()));

create policy "media admin delete"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin(auth.uid()));

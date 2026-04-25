-- =============================================================
-- 007 — Luxe UX upgrades : silhouette, gabarit, carnet, advisor, takeovers, récit
-- =============================================================

-- ---------- Produits : silhouette + récit (vidéo / audio) ----------

alter table public.products
  add column if not exists related_silhouette_slugs text[] default '{}',
  add column if not exists story_video_url text,
  add column if not exists ambient_audio_url text;

-- ---------- Profil de mesures ("Mon Gabarit") ----------

create table if not exists public.customer_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  -- Mesures en cm (tolère des décimales)
  poitrine_cm numeric(5,1),
  taille_cm numeric(5,1),
  hanches_cm numeric(5,1),
  longueur_bras_cm numeric(5,1),
  longueur_jambe_cm numeric(5,1),
  hauteur_epaule_cm numeric(5,1),
  hauteur_totale_cm numeric(5,1),
  taille_preferee text, -- ex: 'M', 'L'
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);
create trigger trg_customer_measurements_touch
  before update on public.customer_measurements
  for each row execute function public.touch_updated_at();

alter table public.customer_measurements enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'customer_measurements'
      and policyname = 'users manage own measurements'
  ) then
    create policy "users manage own measurements"
      on public.customer_measurements for all
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;
end$$;

-- ---------- Conseiller VIP (advisor sur vip_members) ----------

alter table public.vip_members
  add column if not exists advisor_name text,
  add column if not exists advisor_role text,
  add column if not exists advisor_photo_url text,
  add column if not exists advisor_email text,
  add column if not exists advisor_whatsapp text,
  add column if not exists advisor_cal_link text;

-- ---------- Carnet de Cérémonie (wishlist partagée par event) ----------

create table if not exists public.event_carnets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  slug text not null unique,
  event_name text not null,
  event_type text check (event_type in (
    'mariage', 'tabaski', 'magal', 'maouloud', 'bapteme',
    'ceremonie', 'autre'
  )) default 'ceremonie',
  event_date date,
  honoree_name text,
  message text,
  cover_image_url text,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_event_carnets_touch
  before update on public.event_carnets
  for each row execute function public.touch_updated_at();

create index if not exists event_carnets_user_idx on public.event_carnets(user_id);
create index if not exists event_carnets_slug_idx on public.event_carnets(slug);

create table if not exists public.event_carnet_items (
  id uuid primary key default gen_random_uuid(),
  carnet_id uuid not null references public.event_carnets(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  product_slug text not null,
  added_at timestamptz default now(),
  reserved_by_email text, -- qui s'engage à offrir
  reserved_at timestamptz,
  unique(carnet_id, product_slug)
);

alter table public.event_carnets enable row level security;
alter table public.event_carnet_items enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_carnets'
      and policyname = 'users manage own carnets'
  ) then
    create policy "users manage own carnets"
      on public.event_carnets for all
      using (user_id = auth.uid())
      with check (user_id = auth.uid());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_carnets'
      and policyname = 'public read public carnets'
  ) then
    create policy "public read public carnets"
      on public.event_carnets for select
      using (is_public = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_carnet_items'
      and policyname = 'public read items of public carnets'
  ) then
    create policy "public read items of public carnets"
      on public.event_carnet_items for select
      using (
        exists (
          select 1 from public.event_carnets c
          where c.id = carnet_id and (c.is_public = true or c.user_id = auth.uid())
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_carnet_items'
      and policyname = 'owner manages items'
  ) then
    create policy "owner manages items"
      on public.event_carnet_items for all
      using (
        exists (
          select 1 from public.event_carnets c
          where c.id = carnet_id and c.user_id = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.event_carnets c
          where c.id = carnet_id and c.user_id = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_carnet_items'
      and policyname = 'public reserves items'
  ) then
    create policy "public reserves items"
      on public.event_carnet_items for update
      using (
        exists (
          select 1 from public.event_carnets c
          where c.id = carnet_id and c.is_public = true
        )
      )
      with check (true);
  end if;
end$$;

-- ---------- Take-overs saisonniers (Tabaski, Magal, etc.) ----------

create table if not exists public.seasonal_takeovers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  event_type text not null, -- 'tabaski', 'magal', 'maouloud', 'mariage-saison'
  event_date date not null,
  hero_eyebrow text,
  hero_subtitle text,
  hero_image_url text,
  description text,
  -- Liste de slugs de produits curés pour la saison
  curated_product_slugs text[] default '{}',
  delivery_deadline date, -- avant quoi on garantit la livraison
  cta_label text default 'Découvrir la sélection',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_seasonal_takeovers_touch
  before update on public.seasonal_takeovers
  for each row execute function public.touch_updated_at();

alter table public.seasonal_takeovers enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'seasonal_takeovers'
      and policyname = 'public read published takeovers'
  ) then
    create policy "public read published takeovers"
      on public.seasonal_takeovers for select
      using (published = true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'seasonal_takeovers'
      and policyname = 'admin write takeovers'
  ) then
    create policy "admin write takeovers"
      on public.seasonal_takeovers for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;
end$$;

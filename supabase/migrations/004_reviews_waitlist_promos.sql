-- =============================================================
-- Reviews, Waitlist, Promo codes
-- =============================================================

-- ---------- Reviews produits ----------

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  customer_name text not null,
  customer_email text,
  rating int not null check (rating between 1 and 5),
  title text,
  body text not null,
  verified_buyer boolean default false,
  approved boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_reviews_touch before update on public.product_reviews
for each row execute function public.touch_updated_at();
create index if not exists reviews_product_idx on public.product_reviews(product_id, approved);

alter table public.product_reviews enable row level security;

-- Public read : uniquement approuvées
create policy "public read approved reviews"
  on public.product_reviews for select using (approved = true);

-- Public insert : n'importe qui peut déposer (avec approved=false par défaut)
create policy "public submit review"
  on public.product_reviews for insert
  with check (approved = false);

-- Admin tout
create policy "admin write reviews"
  on public.product_reviews for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------- Waitlist (notify-me quand stock ou pre-order) ----------

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  product_slug text not null,
  email text not null,
  variant_id uuid references public.product_variants(id) on delete set null,
  size text,
  notified_at timestamptz,
  created_at timestamptz default now(),
  unique(product_id, email, variant_id, size)
);
create index if not exists waitlist_product_idx on public.waitlist_entries(product_id, notified_at);

alter table public.waitlist_entries enable row level security;

-- Public insert (signup)
create policy "public insert waitlist"
  on public.waitlist_entries for insert
  with check (true);

-- Admin tout (list, notify)
create policy "admin read waitlist"
  on public.waitlist_entries for select
  using (public.is_admin(auth.uid()));
create policy "admin update waitlist"
  on public.waitlist_entries for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));
create policy "admin delete waitlist"
  on public.waitlist_entries for delete
  using (public.is_admin(auth.uid()));

-- ---------- Codes promo ----------

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  label text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value int not null check (discount_value > 0),
  -- percent : 10 = 10% ; fixed : valeur en cents
  min_amount_cents int default 0,
  max_uses int,
  uses_count int default 0,
  starts_at timestamptz default now(),
  ends_at timestamptz,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_promos_touch before update on public.promo_codes
for each row execute function public.touch_updated_at();
create index if not exists promos_code_idx on public.promo_codes(code);

alter table public.promo_codes enable row level security;

-- Lecture publique (pour validation checkout)
create policy "public read active promos"
  on public.promo_codes for select
  using (active = true and (ends_at is null or ends_at > now()));

-- Admin tout
create policy "admin write promos"
  on public.promo_codes for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

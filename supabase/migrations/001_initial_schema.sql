-- =============================================================
-- Chams Adams — schéma initial Supabase
-- À exécuter une fois dans le SQL editor : https://supabase.com/dashboard
-- =============================================================
-- Tables éditoriales :  authors, collections, products, variants,
--                       articles, events, press_entries, faq_items
-- Tables transactionnelles : orders, order_items, wishlists, newsletter_subscribers
-- Roles : admin_users (FK auth.users, role enum)
-- RLS : lecture publique sur contenu publié, écriture pour admin_users.
-- =============================================================

-- ---------- Helpers ----------

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- Roles admin ----------

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor', 'viewer')),
  email text,
  created_at timestamptz default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.admin_users
    where id = uid and role in ('admin', 'editor')
  );
$$;

-- ---------- Auteurs ----------

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  portrait_url text,
  bio text,
  role_title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_authors_touch before update on public.authors
for each row execute function public.touch_updated_at();

-- ---------- Collections ----------

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  long_description text,
  hero_image_url text,
  hero_image_alt text,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_collections_touch before update on public.collections
for each row execute function public.touch_updated_at();

-- ---------- Produits ----------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  subtitle text,
  description text not null,
  long_description text,
  price_amount int not null check (price_amount >= 0),
  price_currency text default 'EUR',
  category_slug text not null,
  materials text[] default '{}',
  details jsonb default '{}',
  tags text[] default '{}',
  is_signature boolean default false,
  is_new boolean default false,
  related_product_slugs text[] default '{}',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_products_touch before update on public.products
for each row execute function public.touch_updated_at();
create index if not exists products_category_idx on public.products(category_slug);
create index if not exists products_published_idx on public.products(published);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  color text,
  color_name text,
  sizes text[] default '{}',
  stock int,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists variants_product_idx on public.product_variants(product_id);

create table if not exists public.product_variant_images (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid references public.product_variants(id) on delete cascade,
  url text not null,
  alt text,
  type text check (type in ('flat', 'worn', 'detail', 'video')),
  sort_order int default 0,
  is_primary boolean default false
);

-- ---------- Articles ----------

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  excerpt text,
  cover_image_url text,
  cover_image_alt text,
  author_id uuid references public.authors(id),
  body_json jsonb default '{}',
  reading_time int default 5,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_articles_touch before update on public.articles
for each row execute function public.touch_updated_at();
create index if not exists articles_published_idx on public.articles(published, published_at desc);

-- ---------- Événements ----------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('defile', 'showroom', 'ceremonie', 'presse', 'collection')),
  start_date date not null,
  end_date date,
  location text,
  city text,
  country text,
  description text,
  cta jsonb,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_events_touch before update on public.events
for each row execute function public.touch_updated_at();
create index if not exists events_date_idx on public.events(start_date);

-- ---------- Revue de presse ----------

create table if not exists public.press_entries (
  id uuid primary key default gen_random_uuid(),
  publication text not null,
  logo_text text,
  published_at date not null,
  title text not null,
  excerpt text,
  article_url text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_press_touch before update on public.press_entries
for each row execute function public.touch_updated_at();
create index if not exists press_date_idx on public.press_entries(published_at desc);

-- ---------- FAQ ----------

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in (
    'livraison', 'sur-mesure', 'entretien', 'paiement', 'retours', 'atelier'
  )),
  question text not null,
  answer text not null,
  sort_order int default 0,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_faq_touch before update on public.faq_items
for each row execute function public.touch_updated_at();
create index if not exists faq_category_idx on public.faq_items(category, sort_order);

-- ---------- Transactionnel ----------

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  email text not null,
  status text default 'pending' check (status in (
    'pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  subtotal_cents int not null,
  shipping_cents int default 0,
  total_cents int not null,
  currency text default 'EUR',
  shipping_address jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_orders_touch before update on public.orders
for each row execute function public.touch_updated_at();
create index if not exists orders_user_idx on public.orders(user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  variant_color_name text,
  size text,
  quantity int not null check (quantity > 0),
  unit_price_cents int not null,
  line_total_cents int not null
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.admin_users enable row level security;
alter table public.authors enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_variant_images enable row level security;
alter table public.articles enable row level security;
alter table public.events enable row level security;
alter table public.press_entries enable row level security;
alter table public.faq_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlists enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- ----- Public read (contenu publié) -----

create policy "public read authors"
  on public.authors for select using (true);

create policy "public read collections"
  on public.collections for select using (true);

create policy "public read published products"
  on public.products for select using (published = true);

create policy "public read variants of published products"
  on public.product_variants for select using (
    exists (select 1 from public.products p where p.id = product_id and p.published = true)
  );

create policy "public read variant images"
  on public.product_variant_images for select using (
    exists (
      select 1 from public.product_variants v
      join public.products p on p.id = v.product_id
      where v.id = variant_id and p.published = true
    )
  );

create policy "public read published articles"
  on public.articles for select using (published = true);

create policy "public read published events"
  on public.events for select using (published = true);

create policy "public read press"
  on public.press_entries for select using (true);

create policy "public read faq"
  on public.faq_items for select using (published = true);

-- ----- Admin write (tous les contenus) -----

create policy "admin write authors" on public.authors for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write collections" on public.collections for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write products" on public.products for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write variants" on public.product_variants for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write variant images" on public.product_variant_images for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write articles" on public.articles for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write events" on public.events for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write press" on public.press_entries for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
create policy "admin write faq" on public.faq_items for all
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ----- admin_users : lecture par soi-même + écriture admin uniquement -----

create policy "admins read self" on public.admin_users for select using (id = auth.uid());
create policy "admins write by admin" on public.admin_users for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'admin'));

-- ----- Transactionnel : users voient leurs propres données -----

create policy "users read own orders" on public.orders for select
  using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "users insert own orders" on public.orders for insert
  with check (user_id = auth.uid() or user_id is null);
create policy "admin update orders" on public.orders for update
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

create policy "users read order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id
    and (o.user_id = auth.uid() or public.is_admin(auth.uid())))
);

create policy "users manage wishlist" on public.wishlists for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "public insert newsletter" on public.newsletter_subscribers for insert
  with check (true);
create policy "admin read newsletter" on public.newsletter_subscribers for select
  using (public.is_admin(auth.uid()));

-- ---- FIN ----

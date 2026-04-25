-- =============================================================
-- Returns, Gift cards, VIP tier, Loyalty points
-- =============================================================

-- ---------- Demandes de retour ----------

create table if not exists public.return_requests (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  email text not null,
  reason text not null check (reason in (
    'taille',
    'qualite',
    'pas-conforme',
    'changement-avis',
    'defaut',
    'autre'
  )),
  details text,
  status text not null default 'pending' check (status in (
    'pending', 'approved', 'received', 'refunded', 'rejected'
  )),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_returns_touch before update on public.return_requests
for each row execute function public.touch_updated_at();

alter table public.return_requests enable row level security;

create policy "public insert returns"
  on public.return_requests for insert with check (true);

create policy "admin read returns"
  on public.return_requests for select using (public.is_admin(auth.uid()));

create policy "admin update returns"
  on public.return_requests for update
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "admin delete returns"
  on public.return_requests for delete using (public.is_admin(auth.uid()));

-- ---------- Cartes cadeaux ----------

create table if not exists public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  initial_amount_cents int not null check (initial_amount_cents > 0),
  remaining_cents int not null,
  currency text default 'EUR',
  recipient_name text,
  recipient_email text,
  sender_name text,
  message text,
  expires_at date,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_giftcards_touch before update on public.gift_cards
for each row execute function public.touch_updated_at();
create index if not exists giftcards_code_idx on public.gift_cards(code);

alter table public.gift_cards enable row level security;

create policy "admin write gift cards" on public.gift_cards for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- Lecture limitée : seul un possesseur du code peut "vérifier" sa carte
-- (via une fonction RPC future) — pour l'admin seul ici.

-- ---------- Cercle VIP ----------

create table if not exists public.vip_members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  tier text not null default 'silver' check (tier in ('silver', 'gold', 'platinum')),
  joined_at timestamptz default now(),
  invited_by text,
  notes text,
  active boolean default true,
  updated_at timestamptz default now()
);
create trigger trg_vip_touch before update on public.vip_members
for each row execute function public.touch_updated_at();

alter table public.vip_members enable row level security;

create policy "admin write vip" on public.vip_members for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ---------- Points fidélité ----------

create table if not exists public.loyalty_points (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  points int not null,
  reason text,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists loyalty_email_idx on public.loyalty_points(email);

alter table public.loyalty_points enable row level security;

create policy "admin all loyalty" on public.loyalty_points for all
  using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

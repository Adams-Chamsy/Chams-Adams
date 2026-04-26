-- =============================================================
-- 008 — Pièce documentée à vie : certificat, registre, monogramme
-- =============================================================

-- ---------- order_items : monogramme à la commande ----------

alter table public.order_items
  add column if not exists monogram text;

-- ---------- Pièces (= certificats) ----------

create table if not exists public.pieces (
  id uuid primary key default gen_random_uuid(),
  -- Numéro lisible : CA-2026-0001
  piece_number text unique not null,
  order_item_id uuid references public.order_items(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  variant_color_name text,
  size text,
  monogram text,
  -- Données du certificat (remplies par l'admin après confection)
  artisan_name text,
  artisan_role text,
  artisan_signature_url text,
  fabric_lot text,
  fabric_origin text,
  embroidery_hours int,
  completed_at date,
  -- Propriétaire courant (peut changer via transmission)
  owner_email text not null,
  owner_user_id uuid references auth.users(id) on delete set null,
  owner_name text,
  -- Métadonnées
  certificate_published boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create trigger trg_pieces_touch
  before update on public.pieces
  for each row execute function public.touch_updated_at();

create index if not exists pieces_owner_idx
  on public.pieces(owner_email, owner_user_id);
create index if not exists pieces_number_idx on public.pieces(piece_number);

alter table public.pieces enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'pieces'
      and policyname = 'owner reads own pieces'
  ) then
    create policy "owner reads own pieces"
      on public.pieces for select
      using (
        owner_user_id = auth.uid()
        or owner_email = (select email from auth.users where id = auth.uid())
        or public.is_admin(auth.uid())
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'pieces'
      and policyname = 'admin writes pieces'
  ) then
    create policy "admin writes pieces"
      on public.pieces for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;
end$$;

-- ---------- Événements de pièce (registre) ----------

create table if not exists public.piece_events (
  id uuid primary key default gen_random_uuid(),
  piece_id uuid not null references public.pieces(id) on delete cascade,
  event_type text not null check (event_type in (
    'creation',
    'retouche',
    'entretien',
    'transmission',
    'note'
  )),
  occurred_at date not null default current_date,
  note text,
  -- Champs spécifiques à la transmission
  transferred_from_email text,
  transferred_to_email text,
  created_at timestamptz default now()
);

create index if not exists piece_events_piece_idx
  on public.piece_events(piece_id, occurred_at desc);

alter table public.piece_events enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'piece_events'
      and policyname = 'owner reads own events'
  ) then
    create policy "owner reads own events"
      on public.piece_events for select
      using (
        exists (
          select 1 from public.pieces p
          where p.id = piece_id
            and (
              p.owner_user_id = auth.uid()
              or p.owner_email = (select email from auth.users where id = auth.uid())
              or public.is_admin(auth.uid())
            )
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'piece_events'
      and policyname = 'admin writes events'
  ) then
    create policy "admin writes events"
      on public.piece_events for all
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;
end$$;

-- ---------- Séquence pour piece_number ----------

create sequence if not exists public.piece_number_seq start 1;

-- Helper côté SQL pour générer les numéros (mode CA-YYYY-NNNN, 4 chiffres)
create or replace function public.next_piece_number()
returns text language plpgsql as $$
declare
  next_n int;
  year int := extract(year from now())::int;
begin
  next_n := nextval('public.piece_number_seq');
  return 'CA-' || year || '-' || lpad(next_n::text, 4, '0');
end;
$$;

-- ─────────────────────────────────────────────
-- ADMIN UPDATE/DELETE POLICIES
-- Run this in Supabase SQL editor to allow admin approve/reject
-- ─────────────────────────────────────────────

-- Hostels: admin can update (approve) and delete (reject)
create policy "Admins can update hostels"
  on public.hostels for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete hostels"
  on public.hostels for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Gyms: admin can update and delete
create policy "Admins can update gyms"
  on public.gyms for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

create policy "Admins can delete gyms"
  on public.gyms for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────────
-- MESSAGING TABLE
-- ─────────────────────────────────────────────

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;

create policy "Users can view their messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

create policy "Receiver can mark as read"
  on public.messages for update
  using (auth.uid() = receiver_id);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS TABLE
-- ─────────────────────────────────────────────

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- REVIEWS TABLE (if not exists)
-- ─────────────────────────────────────────────

create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id text not null,
  listing_type text not null check (listing_type in ('hostel', 'gym', 'sports', 'event')),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  photo_url text,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"
  on public.reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- FULL-TEXT SEARCH INDEXES
-- ─────────────────────────────────────────────

-- Enable trigram extension for fuzzy search
create extension if not exists pg_trgm;

-- GIN indexes for fast text search
create index if not exists idx_hostels_name_trgm on public.hostels using gin (name gin_trgm_ops);
create index if not exists idx_hostels_address_trgm on public.hostels using gin (address gin_trgm_ops);
create index if not exists idx_gyms_name_trgm on public.gyms using gin (name gin_trgm_ops);
create index if not exists idx_sports_clubs_name_trgm on public.sports_clubs using gin (name gin_trgm_ops);
create index if not exists idx_events_title_trgm on public.events using gin (title gin_trgm_ops);

-- Unique constraint on name for upsert in seed script
create unique index if not exists idx_hostels_name_unique on public.hostels (name);
create unique index if not exists idx_gyms_name_unique on public.gyms (name);
create unique index if not exists idx_sports_clubs_name_unique on public.sports_clubs (name);
create unique index if not exists idx_events_title_unique on public.events (title);

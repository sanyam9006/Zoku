-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  city text default 'Bangalore',
  college text,
  company text,
  hometown text,
  bio text,
  role text default 'user', -- user / owner / admin
  interests text[] default '{}',
  user_type text default 'student', -- student / professional / remote
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- HOSTELS
-- ─────────────────────────────────────────────
create table public.hostels (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id),
  name text not null,
  description text,
  city text not null,
  address text not null,
  lat float,
  lng float,
  price_min integer not null,
  price_max integer,
  gender text check (gender in ('boys', 'girls', 'mixed')) default 'mixed',
  amenities text[] default '{}',
  photos text[] default '{}',
  verified boolean default false,
  rating float default 0,
  reviews_count integer default 0,
  phone text,
  whatsapp text,
  distance float,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- GYMS
-- ─────────────────────────────────────────────
create table public.gyms (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id),
  name text not null,
  description text,
  city text not null,
  address text not null,
  lat float,
  lng float,
  price_min integer not null,
  gym_type text check (gym_type in ('gym', 'yoga', 'crossfit', 'swimming', 'mixed')) default 'gym',
  timing text,
  photos text[] default '{}',
  rating float default 0,
  phone text,
  distance float,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- SPORTS CLUBS
-- ─────────────────────────────────────────────
create table public.sports_clubs (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  city text not null,
  address text not null,
  lat float,
  lng float,
  sport text not null, -- football / cricket / badminton / basketball / chess / running / tennis
  skill_level text check (skill_level in ('all', 'beginner', 'intermediate', 'advanced')) default 'all',
  schedule text,
  members_count integer default 0,
  contact_name text,
  phone text,
  whatsapp text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────────
create table public.events (
  id uuid default gen_random_uuid() primary key,
  organizer_id uuid references public.profiles(id),
  title text not null,
  description text,
  city text not null,
  venue text not null,
  address text,
  lat float,
  lng float,
  event_date date not null,
  event_time text,
  category text not null, -- tech / music / sports / culture / networking / comedy / food
  price integer default 0,
  is_free boolean default true,
  photo text,
  rsvp_count integer default 0,
  max_capacity integer,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- RSVPS
-- ─────────────────────────────────────────────
create table public.rsvps (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  event_id uuid references public.events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);

-- ─────────────────────────────────────────────
-- CONNECTIONS (friend requests)
-- ─────────────────────────────────────────────
create table public.connections (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references public.profiles(id) on delete cascade,
  receiver_id uuid references public.profiles(id) on delete cascade,
  status text check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamptz default now(),
  unique(sender_id, receiver_id)
);

-- ─────────────────────────────────────────────
-- CLUB MEMBERSHIPS
-- ─────────────────────────────────────────────
create table public.club_memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  club_id uuid references public.sports_clubs(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, club_id)
);

-- ─────────────────────────────────────────────
-- GYM ENQUIRIES
-- ─────────────────────────────────────────────
create table public.gym_enquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  gym_id uuid references public.gyms(id),
  message text,
  phone text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- HOSTEL ENQUIRIES
-- ─────────────────────────────────────────────
create table public.hostel_enquiries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  hostel_id uuid references public.hostels(id),
  message text,
  move_in_date date,
  phone text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- SAVED / BOOKMARKED LISTINGS
-- ─────────────────────────────────────────────
create table public.saved_listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  listing_id text not null,
  listing_type text check (listing_type in ('hostel', 'gym', 'sports', 'event')) not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id, listing_type)
);

-- ─────────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────────
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  listing_id text not null,
  listing_type text not null,
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique(user_id, listing_id, listing_type)
);

-- ─────────────────────────────────────────────
-- COMMUNITY POSTS
-- ─────────────────────────────────────────────
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  city text,
  tags text[] default '{}',
  likes_count integer default 0,
  comments_count integer default 0,
  created_at timestamptz default now()
);

create table public.post_likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, post_id)
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.hostels enable row level security;
alter table public.gyms enable row level security;
alter table public.sports_clubs enable row level security;
alter table public.events enable row level security;
alter table public.rsvps enable row level security;
alter table public.connections enable row level security;
alter table public.club_memberships enable row level security;
alter table public.gym_enquiries enable row level security;
alter table public.hostel_enquiries enable row level security;
alter table public.saved_listings enable row level security;
alter table public.reviews enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;

-- POLICIES
-- Profiles: anyone can read, only owner can edit
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Hostels/Gyms/Sports/Events: anyone can read
create policy "Anyone can view hostels" on public.hostels for select using (true);
create policy "Anyone can view gyms" on public.gyms for select using (true);
create policy "Anyone can view sports clubs" on public.sports_clubs for select using (true);
create policy "Anyone can view events" on public.events for select using (true);

-- Owners can insert their listings
create policy "Owners can insert hostels" on public.hostels for insert with check (auth.uid() = owner_id);
create policy "Owners can insert gyms" on public.gyms for insert with check (auth.uid() = owner_id);
create policy "Owners can insert events" on public.events for insert with check (auth.uid() = organizer_id);

-- RSVPs
create policy "Users can view their own RSVPs" on public.rsvps for select using (auth.uid() = user_id);
create policy "Users can insert their own RSVPs" on public.rsvps for insert with check (auth.uid() = user_id);
create policy "Users can delete their own RSVPs" on public.rsvps for delete using (auth.uid() = user_id);

-- Connections
create policy "Users can view their connections" on public.connections for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users can send connections" on public.connections for insert with check (auth.uid() = sender_id);
create policy "Users can update connection status" on public.connections for update using (auth.uid() = receiver_id);

-- Club memberships
create policy "Anyone can view memberships" on public.club_memberships for select using (true);
create policy "Users can join clubs" on public.club_memberships for insert with check (auth.uid() = user_id);
create policy "Users can leave clubs" on public.club_memberships for delete using (auth.uid() = user_id);

-- Saved listings
create policy "Users can view saved listings" on public.saved_listings for select using (auth.uid() = user_id);
create policy "Users can save listings" on public.saved_listings for insert with check (auth.uid() = user_id);
create policy "Users can unsave listings" on public.saved_listings for delete using (auth.uid() = user_id);

-- Reviews
create policy "Anyone can view reviews" on public.reviews for select using (true);
create policy "Users can write reviews" on public.reviews for insert with check (auth.uid() = user_id);

-- Posts
create policy "Anyone can view posts" on public.posts for select using (true);
create policy "Users can create posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on public.posts for delete using (auth.uid() = user_id);

-- Post likes
create policy "Anyone can view likes" on public.post_likes for select using (true);
create policy "Users can like posts" on public.post_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike posts" on public.post_likes for delete using (auth.uid() = user_id);

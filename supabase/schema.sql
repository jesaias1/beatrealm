-- ==========================================================================
-- BeatRealm Phase 9 — Supabase Schema (canonical, includes Phase 8 + 9)
-- Apply this in your Supabase SQL Editor to set up the database.
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Profiles
-- --------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  display_name text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can read profiles.
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

-- Users can update their own profile.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role can insert profiles (for trigger).
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- Username unique index.
create unique index if not exists idx_profiles_username
  on public.profiles(username)
  where username is not null;

-- Auto-create profile row on user signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- --------------------------------------------------------------------------
-- 2. Realms
-- --------------------------------------------------------------------------
create table if not exists public.realms (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references auth.users(id) on delete cascade,
  slug                text unique not null,
  title               text not null,
  producer_name       text not null,
  producer_slug       text not null,
  genre               text not null,
  mood                text not null,
  bpm                 integer,
  visual_style        text not null,
  description         text,
  audio_url           text not null,
  audio_path          text not null,
  audio_original_name text,
  audio_mime_type     text,
  audio_size          bigint,
  cover_url           text,
  cover_path          text,
  cover_original_name text,
  cover_mime_type     text,
  cover_size          bigint,
  cover_placeholder_id text,
  is_public           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.realms enable row level security;

-- Public can read public Realms.
create policy "Public Realms are viewable by everyone"
  on public.realms for select
  using (is_public = true);

-- Authenticated users can insert Realms owned by themselves.
create policy "Authenticated users can create their own Realms"
  on public.realms for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Owners can update their own Realms.
create policy "Owners can update their own Realms"
  on public.realms for update
  to authenticated
  using (auth.uid() = owner_id);

-- Owners can delete their own Realms.
create policy "Owners can delete their own Realms"
  on public.realms for delete
  to authenticated
  using (auth.uid() = owner_id);

-- Indexes.
create index if not exists idx_realms_slug on public.realms(slug);
create index if not exists idx_realms_owner_id on public.realms(owner_id);
create index if not exists idx_realms_producer_slug on public.realms(producer_slug);

-- --------------------------------------------------------------------------
-- 3. Fight Results
-- --------------------------------------------------------------------------
create table if not exists public.fight_results (
  id              uuid primary key default gen_random_uuid(),
  realm_id        uuid not null references public.realms(id) on delete cascade,
  user_id         uuid references auth.users(id) on delete set null,
  player_name     text,
  difficulty      text not null,
  outcome         text not null,
  rank            text not null,
  score           integer not null,
  accuracy        numeric not null,
  max_combo       integer not null,
  perfects        integer not null default 0,
  greats          integer not null default 0,
  goods           integer not null default 0,
  misses          integer not null default 0,
  total_prompts   integer not null,
  duration_seconds numeric,
  created_at      timestamptz not null default now()
);

alter table public.fight_results enable row level security;

-- Public can read fight results (for leaderboard).
create policy "Fight results are viewable by everyone"
  on public.fight_results for select
  using (true);

-- Authenticated users can insert their own fight results.
create policy "Authenticated users can insert their own fight results"
  on public.fight_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Indexes.
create index if not exists idx_fight_results_realm_id on public.fight_results(realm_id);
create index if not exists idx_fight_results_score on public.fight_results(score desc);
create index if not exists idx_fight_results_created_at on public.fight_results(created_at desc);
create index if not exists idx_fight_results_user_id on public.fight_results(user_id);

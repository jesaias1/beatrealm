-- ==========================================================================
-- BeatRealm Phase 9 — Schema Migration
-- Apply AFTER the Phase 8 schema (schema.sql).
-- ==========================================================================

-- --------------------------------------------------------------------------
-- 1. Profiles: Add INSERT policy for trigger-created rows
-- --------------------------------------------------------------------------
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- Ensure username unique index exists
create unique index if not exists idx_profiles_username
  on public.profiles(username)
  where username is not null;

-- --------------------------------------------------------------------------
-- 2. Fight Results: Add user_id index for "my scores" queries
-- --------------------------------------------------------------------------
create index if not exists idx_fight_results_user_id
  on public.fight_results(user_id);

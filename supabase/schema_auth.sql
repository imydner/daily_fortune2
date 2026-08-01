-- Run this AFTER supabase/schema.sql, in the Supabase dashboard:
-- Project → SQL Editor → New query → paste → Run.
--
-- Adds login support: fortune draws made while logged in get linked to the
-- user's account (so history follows them across devices), while anonymous
-- draws keep working exactly as before via client_id.

alter table public.fortune_draws
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

create index if not exists fortune_draws_user_id_idx
  on public.fortune_draws (user_id, created_at desc);

-- Logged-in users can only insert/read rows tied to their own account.
-- (Anonymous policies from schema.sql, scoped to the `anon` role, are
-- untouched — anonymous visitors keep working via client_id as before.)
create policy "authenticated users can insert own rows"
  on public.fortune_draws
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "authenticated users can read own rows"
  on public.fortune_draws
  for select
  to authenticated
  using (auth.uid() = user_id);

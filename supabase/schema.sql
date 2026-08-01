-- Run this in the Supabase dashboard: Project → SQL Editor → New query → Run.

create table if not exists public.fortune_draws (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_id text not null,
  fortune text not null,
  lucky_item text not null,
  lucky_color text not null,
  lotto_numbers int[] not null,
  week_label text not null
);

create index if not exists fortune_draws_client_id_idx
  on public.fortune_draws (client_id, created_at desc);

alter table public.fortune_draws enable row level security;

-- No login system yet, so we identify a browser by a random client_id stored
-- in localStorage. Anyone holding the publishable key can insert/select
-- (this is a learning project, not a production auth setup) — the app only
-- ever queries rows matching its own client_id, but be aware the table isn't
-- truly private per visitor at the database level.
create policy "anon can insert fortune draws"
  on public.fortune_draws
  for insert
  to anon
  with check (true);

create policy "anon can read fortune draws"
  on public.fortune_draws
  for select
  to anon
  using (true);

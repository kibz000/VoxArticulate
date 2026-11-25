create table if not exists public.communication_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null check (
    mode in ('Speech Practice', 'Conversation Simulator', 'Articulation Coach')
  ),
  transcript text not null default '',
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  word_count integer not null default 0 check (word_count >= 0),
  filler_word_count integer not null default 0 check (filler_word_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists communication_sessions_user_created_idx
  on public.communication_sessions (user_id, created_at desc);

alter table public.communication_sessions enable row level security;

drop policy if exists "Learners can view their own communication sessions"
  on public.communication_sessions;
create policy "Learners can view their own communication sessions"
  on public.communication_sessions for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Learners can create their own communication sessions"
  on public.communication_sessions;
create policy "Learners can create their own communication sessions"
  on public.communication_sessions for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.communication_sessions to authenticated;

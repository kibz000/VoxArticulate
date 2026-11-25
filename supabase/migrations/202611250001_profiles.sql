create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  country text not null default '',
  preferred_language text not null default 'English',
  interests text not null default '',
  goals text not null default '',
  bio text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Learners can view their own profile" on public.profiles;
create policy "Learners can view their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Learners can create their own profile" on public.profiles;
create policy "Learners can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Learners can update their own profile" on public.profiles;
create policy "Learners can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant select, insert, update on public.profiles to authenticated;

create or replace function public.handle_voxarticulate_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_voxarticulate_profile on auth.users;
create trigger on_auth_user_created_voxarticulate_profile
  after insert on auth.users
  for each row execute procedure public.handle_voxarticulate_new_user();

create or replace function public.set_voxarticulate_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_voxarticulate_profile_updated_at on public.profiles;
create trigger set_voxarticulate_profile_updated_at
  before update on public.profiles
  for each row execute procedure public.set_voxarticulate_profile_updated_at();

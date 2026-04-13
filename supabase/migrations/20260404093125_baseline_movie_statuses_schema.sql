-- Baseline migration for the movie_statuses feature.
-- Recreates the enum, table, indexes, and RLS policy
-- based on the current remote Supabase schema.

create extension if not exists pgcrypto with schema extensions;

create type public.watch_status_enum as enum (
  'planning',
  'watching',
  'paused',
  'dropped',
  'completed'
);

create table public.movie_statuses (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  tmdb_movie_id text not null,
  is_favorite boolean not null default false,
  watch_status public.watch_status_enum,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text,
  poster_path text,
  release_date text,
  constraint movie_statuses_pkey primary key (id),
  constraint movie_statuses_user_id_tmdb_movie_id_key unique (user_id, tmdb_movie_id),
  constraint movie_statuses_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete cascade
);

create index movie_statuses_user_fav_idx
  on public.movie_statuses (user_id, is_favorite);

create index movie_statuses_user_status_idx
  on public.movie_statuses (user_id, watch_status);

alter table public.movie_statuses enable row level security;

create policy "Restrict users to their own data only"
on public.movie_statuses
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
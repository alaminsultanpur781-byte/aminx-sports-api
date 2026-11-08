-- Run this script in the Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sport text not null default 'cricket',
  tournament text,
  team_a text not null,
  team_b text not null,
  team_a_score text,
  team_b_score text,
  start_time timestamptz,
  status text not null default 'upcoming' check (status in ('upcoming','live','completed','cancelled')),
  venue text,
  stream_url text,
  thumbnail text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'sports',
  logo text,
  stream_url text not null,
  description text,
  status text not null default 'inactive' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  image text,
  content text,
  category text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sport text not null default 'cricket',
  logo text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team text,
  sport text not null default 'cricket',
  photo text,
  role text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists matches_status_idx on public.matches(status);
create index if not exists matches_start_time_idx on public.matches(start_time);
create index if not exists channels_status_idx on public.channels(status);
create index if not exists news_status_created_idx on public.news(status, created_at desc);

-- The backend uses the Supabase service-role key on the server.
-- Never put that key in a browser or Android application.

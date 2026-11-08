CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  sport text NOT NULL DEFAULT 'cricket',
  tournament text,
  team_a text NOT NULL,
  team_b text NOT NULL,
  team_a_score text,
  team_b_score text,
  start_time timestamptz,
  status text NOT NULL DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  venue text,
  stream_url text,
  thumbnail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'sports',
  logo text,
  stream_url text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'inactive'
    CHECK (status IN ('active', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  image text,
  content text,
  category text,
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL DEFAULT 'cricket',
  logo text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  team text,
  sport text NOT NULL DEFAULT 'cricket',
  photo text,
  role text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS matches_status_idx
  ON public.matches(status);

CREATE INDEX IF NOT EXISTS matches_start_time_idx
  ON public.matches(start_time);

CREATE INDEX IF NOT EXISTS channels_status_idx
  ON public.channels(status);

CREATE INDEX IF NOT EXISTS news_status_created_idx
  ON public.news(status, created_at DESC);

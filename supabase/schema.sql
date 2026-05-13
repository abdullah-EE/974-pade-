-- 974 Padel backend foundation.
-- Run this in a Supabase project when backend work begins.

create extension if not exists "pgcrypto";

create type public.player_level as enum ('Beginner', 'Intermediate', 'Advanced');
create type public.match_status as enum ('Pending', 'Verified', 'Disputed');
create type public.challenge_status as enum ('Incoming', 'Sent', 'Accepted', 'Declined');
create type public.slot_status as enum ('available', 'few-left', 'full');
create type public.subscription_tier as enum ('Free', 'Premium', 'Pro');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  username text not null unique,
  level public.player_level not null default 'Intermediate',
  favorite_area text not null default 'Lusail',
  rating integer not null default 1800,
  wins integer not null default 0,
  losses integer not null default 0,
  streak integer not null default 0,
  weekly_points integer not null default 0,
  tokens integer not null default 0,
  subscription_tier public.subscription_tier not null default 'Free',
  profile_theme text not null default 'Classic',
  badge_frame text not null default 'None',
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.courts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  indoor boolean not null default true,
  image_url text,
  description text not null,
  amenities text[] not null default '{}',
  price_range text,
  booking_url text,
  external_booking_label text,
  rating numeric(2,1) not null default 4.5,
  ranked_match_supported boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.court_slots (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id) on delete cascade,
  starts_at timestamptz not null,
  label text not null,
  status public.slot_status not null default 'available',
  created_at timestamptz not null default now()
);

create table public.friendships (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, friend_id),
  constraint no_self_friend check (profile_id <> friend_id)
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  to_profile_id uuid not null references public.profiles(id) on delete cascade,
  court_id uuid not null references public.courts(id) on delete cascade,
  starts_at timestamptz not null,
  level public.player_level not null,
  status public.challenge_status not null default 'Sent',
  note text,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id),
  team_a uuid[] not null,
  team_b uuid[] not null,
  winner text not null check (winner in ('A', 'B')),
  score text not null,
  starts_at timestamptz not null,
  status public.match_status not null default 'Pending',
  proof_url text,
  gps_verified boolean not null default false,
  opponent_confirmed boolean not null default false,
  admin_review_required boolean not null default false,
  rating_change integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.open_games (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id) on delete cascade,
  host_profile_id uuid not null references public.profiles(id) on delete cascade,
  starts_at timestamptz not null,
  level public.player_level not null,
  capacity integer not null default 4,
  is_private boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.open_game_players (
  open_game_id uuid not null references public.open_games(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (open_game_id, profile_id)
);

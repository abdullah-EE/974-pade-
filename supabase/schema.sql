-- 974 Padel backend phase 1 foundation.
-- The Expo app still uses local state until these tables are wired through a Supabase client.

create extension if not exists "pgcrypto";

create type public.player_level as enum ('Beginner', 'Intermediate', 'Advanced');
create type public.subscription_tier as enum ('free', 'premium');
create type public.friendship_status as enum ('pending', 'accepted', 'blocked');
create type public.challenge_status as enum ('open', 'sent', 'incoming', 'accepted', 'declined', 'completed');
create type public.challenge_privacy as enum ('public', 'friends_only', 'private_invite');
create type public.challenge_type as enum ('singles', 'doubles', 'open_game');
create type public.match_verification_status as enum ('pending_opponent', 'confirmed', 'disputed');
create type public.slot_status as enum ('available', 'few_left', 'almost_full', 'full');
create type public.video_tag as enum ('match', 'training', 'tip', 'highlight');
create type public.credit_reason as enum ('verified_match', 'win_streak', 'profile_complete', 'challenge_joined', 'clip_uploaded', 'cosmetic_spend');
create type public.cosmetic_type as enum ('profile_frame', 'avatar_border', 'player_card_theme', 'badge_display', 'court_background', 'victory_animation');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  name text not null,
  username text not null unique,
  avatar_url text,
  level public.player_level not null default 'Intermediate',
  favorite_area text not null default 'Lusail',
  favorite_court_id uuid,
  rating integer not null default 1800,
  weekly_points integer not null default 0,
  verified_matches integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  streak integer not null default 0,
  subscription_tier public.subscription_tier not null default 'free',
  credits integer not null default 0,
  active_theme text not null default 'classic',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  indoor boolean not null default true,
  hero_image_url text,
  card_image_url text,
  booking_url text,
  instagram_url text,
  maps_url text,
  description text not null,
  amenities text[] not null default '{}',
  popularity_score integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_favorite_court_fk foreign key (favorite_court_id) references public.courts(id) on delete set null;

create table public.court_slots (
  id uuid primary key default gen_random_uuid(),
  court_id uuid not null references public.courts(id) on delete cascade,
  starts_at timestamptz,
  label text not null,
  status public.slot_status not null default 'available',
  price_label text,
  created_at timestamptz not null default now()
);

create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status public.friendship_status not null default 'accepted',
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  constraint no_self_friend check (requester_id <> addressee_id)
);

create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  opponent_ids uuid[] not null default '{}',
  court_id uuid references public.courts(id) on delete set null,
  time_label text not null,
  level public.player_level not null,
  privacy public.challenge_privacy not null default 'public',
  type public.challenge_type not null default 'doubles',
  status public.challenge_status not null default 'sent',
  note text,
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  court_id uuid references public.courts(id) on delete set null,
  team_a uuid[] not null,
  team_b uuid[] not null,
  winner text not null check (winner in ('A', 'B')),
  score text not null,
  proof_url text,
  verification_status public.match_verification_status not null default 'pending_opponent',
  rating_delta integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.match_confirmations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  confirmed boolean not null,
  note text,
  created_at timestamptz not null default now(),
  unique (match_id, profile_id)
);

create table public.open_games (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.challenges(id) on delete cascade,
  court_id uuid references public.courts(id) on delete set null,
  host_id uuid not null references public.profiles(id) on delete cascade,
  time_label text not null,
  level public.player_level not null,
  capacity integer not null default 4,
  privacy public.challenge_privacy not null default 'public',
  created_at timestamptz not null default now()
);

create table public.open_game_players (
  open_game_id uuid not null references public.open_games(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (open_game_id, profile_id)
);

create table public.coaches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  avatar_url text,
  hero_image_url text,
  specialty text not null,
  level public.player_level not null,
  area text not null,
  court_id uuid references public.courts(id) on delete set null,
  rating numeric(2,1) not null default 4.8,
  price_label text not null,
  bio text not null,
  specialties text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.coach_slots (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  label text not null,
  status public.slot_status not null default 'available'
);

create table public.coach_session_requests (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coaches(id) on delete cascade,
  requester_id uuid not null references public.profiles(id) on delete cascade,
  slot_label text not null,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

create table public.video_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  thumbnail_url text,
  video_url text,
  duration text,
  tag public.video_tag not null,
  views integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.video_likes (
  video_id uuid not null references public.video_posts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (video_id, profile_id)
);

create table public.wallets (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  reason public.credit_reason not null,
  created_at timestamptz not null default now()
);

create table public.cosmetic_items (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  type public.cosmetic_type not null,
  price integer not null default 0,
  premium_only boolean not null default false
);

create table public.user_cosmetics (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  cosmetic_id uuid not null references public.cosmetic_items(id) on delete cascade,
  active boolean not null default false,
  acquired_at timestamptz not null default now(),
  primary key (profile_id, cosmetic_id)
);

create table public.entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  feature_key text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (profile_id, feature_key)
);

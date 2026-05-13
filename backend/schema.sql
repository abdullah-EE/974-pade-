create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  username text unique not null,
  avatar_url text,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  favorite_area text,
  favorite_court_id text,
  rating integer not null default 1800,
  weekly_points integer not null default 0,
  verified_matches integer not null default 0,
  subscription_tier text not null default 'free',
  account_role text not null default 'player' check (account_role in ('player', 'coach', 'both')),
  email text unique,
  password_hash text,
  created_at timestamptz not null default now()
);

create table friendships (
  user_id uuid references profiles(id) on delete cascade,
  friend_id uuid references profiles(id) on delete cascade,
  status text not null default 'accepted',
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id)
);

create table courts (
  id text primary key,
  name text not null,
  area text not null,
  indoor boolean not null default false,
  hero_image_url text,
  card_image_url text,
  booking_url text,
  instagram_url text,
  maps_url text,
  description text,
  popularity_score integer not null default 0
);

create table court_slots (
  id text primary key,
  court_id text references courts(id) on delete cascade,
  label text not null,
  status text not null check (status in ('available', 'few-left', 'full')),
  starts_at timestamptz,
  price_qatar_riyal integer
);

create table challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id) on delete cascade,
  court_id text references courts(id),
  starts_at timestamptz,
  level text not null,
  privacy text not null check (privacy in ('Public', 'Friends only', 'Private invite')),
  type text not null default 'doubles',
  status text not null default 'Sent',
  note text,
  created_at timestamptz not null default now()
);

create table challenge_opponents (
  challenge_id uuid references challenges(id) on delete cascade,
  player_id uuid references profiles(id) on delete cascade,
  primary key (challenge_id, player_id)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  court_id text references courts(id),
  team_a uuid[] not null,
  team_b uuid[] not null,
  winner text,
  score text,
  proof_image_url text,
  status text not null default 'Pending',
  rating_change integer not null default 0,
  starts_at timestamptz,
  created_at timestamptz not null default now()
);

create table wallets (
  user_id uuid primary key references profiles(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table cosmetics (
  id text primary key,
  name text not null,
  type text not null,
  price integer not null default 0,
  premium_only boolean not null default false,
  description text
);

create table user_cosmetics (
  user_id uuid references profiles(id) on delete cascade,
  cosmetic_id text references cosmetics(id) on delete cascade,
  equipped boolean not null default false,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, cosmetic_id)
);

create table coach_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  specialty text not null,
  price_label text not null,
  bio text,
  court_id text references courts(id),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table video_posts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  tag text not null,
  duration text,
  views integer not null default 0,
  created_at timestamptz not null default now()
);

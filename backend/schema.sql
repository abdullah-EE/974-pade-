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

-- Backend-ready expansion for the full 974 Padel business model.
alter table profiles add column if not exists user_id uuid;
alter table profiles add column if not exists role text default 'player' check (role in ('player', 'coach', 'club_owner', 'admin'));
alter table profiles add column if not exists area text;
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists language text default 'en';

create table if not exists player_stats (
  profile_id uuid primary key references profiles(id) on delete cascade,
  rating integer not null default 1800,
  weekly_points integer not null default 0,
  verified_match_count integer not null default 0,
  streak integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  win_rate numeric generated always as (case when wins + losses = 0 then 0 else wins::numeric / (wins + losses) end) stored,
  updated_at timestamptz not null default now()
);

create table if not exists challenge_invites (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete cascade,
  invited_profile_id uuid references profiles(id) on delete cascade,
  status text not null default 'sent' check (status in ('sent', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (challenge_id, invited_profile_id)
);

create table if not exists match_players (
  match_id uuid references matches(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  team text not null check (team in ('A', 'B')),
  primary key (match_id, profile_id)
);

create table if not exists match_confirmations (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  status text not null check (status in ('confirmed', 'disputed')),
  note text,
  created_at timestamptz not null default now(),
  unique (match_id, profile_id)
);

create table if not exists proof_uploads (
  id uuid primary key default gen_random_uuid(),
  match_id uuid references matches(id) on delete cascade,
  uploader_id uuid references profiles(id) on delete cascade,
  storage_path text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  file_size_bytes integer check (file_size_bytes <= 6291456),
  created_at timestamptz not null default now()
);

create table if not exists rankings (
  profile_id uuid primary key references profiles(id) on delete cascade,
  rank integer,
  rating integer not null default 1800,
  scope text not null default 'overall',
  updated_at timestamptz not null default now()
);

create table if not exists ranking_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  match_id uuid references matches(id) on delete set null,
  old_rating integer,
  new_rating integer,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists badges (
  id text primary key,
  name text not null,
  description text,
  icon text
);

create table if not exists user_badges (
  profile_id uuid references profiles(id) on delete cascade,
  badge_id text references badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (profile_id, badge_id)
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  status text not null default 'preview' check (status in ('preview', 'active', 'cancelled', 'expired')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists entitlements (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  feature text not null,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_id, feature)
);

create table if not exists coaches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  specialty text not null,
  area text,
  court_id text references courts(id),
  rate_label text,
  bio text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists coach_slots (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references coaches(id) on delete cascade,
  starts_at timestamptz,
  label text not null,
  status text not null default 'available' check (status in ('available', 'requested', 'booked'))
);

create table if not exists coach_requests (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references coaches(id) on delete cascade,
  requester_id uuid references profiles(id) on delete cascade,
  slot_id uuid references coach_slots(id) on delete set null,
  status text not null default 'requested' check (status in ('requested', 'accepted', 'declined', 'completed')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  thumbnail_url text,
  video_url text,
  type text not null check (type in ('Match', 'Training', 'Tip', 'Highlight')),
  duration text,
  visibility text not null default 'public' check (visibility in ('public', 'friends_only', 'private')),
  created_at timestamptz not null default now()
);

create table if not exists video_likes (
  video_id uuid references videos(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  reaction text not null default 'like' check (reaction in ('like', 'save')),
  created_at timestamptz not null default now(),
  primary key (video_id, profile_id, reaction)
);

create table if not exists clubs (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references profiles(id) on delete set null,
  name text not null,
  area text,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'club_pro')),
  analytics_enabled boolean not null default false,
  featured_profile boolean not null default false,
  event_tools_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table courts add column if not exists club_id uuid references clubs(id) on delete set null;

create table if not exists club_members (
  club_id uuid references clubs(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'manager', 'coach', 'member')),
  joined_at timestamptz not null default now(),
  primary key (club_id, profile_id)
);

create table if not exists club_events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete cascade,
  title text not null,
  event_type text not null default 'open_game',
  starts_at timestamptz,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references clubs(id) on delete set null,
  title text not null,
  format text not null default 'league',
  entry_fee integer default 0,
  status text not null default 'draft' check (status in ('draft', 'open', 'running', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists tournament_entries (
  tournament_id uuid references tournaments(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  status text not null default 'entered',
  created_at timestamptz not null default now(),
  primary key (tournament_id, profile_id)
);

create table if not exists corporate_leagues (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid references profiles(id) on delete set null,
  name text not null,
  organization_name text,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create table if not exists partner_offers (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  category text not null,
  offer_title text not null,
  validity text,
  redemption_method text,
  is_premium_only boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists offer_redemptions (
  offer_id uuid references partner_offers(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  primary key (offer_id, profile_id)
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  type text not null,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete cascade,
  target_type text not null,
  target_id text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now()
);

-- Storage buckets to create in Supabase:
-- avatars, match_proofs, video_thumbnails, videos, cosmetic_assets
-- avatars/cosmetic_assets may be public; match_proofs/videos should use signed URLs.

alter table profiles enable row level security;
alter table player_stats enable row level security;
alter table friendships enable row level security;
alter table courts enable row level security;
alter table court_slots enable row level security;
alter table challenges enable row level security;
alter table challenge_invites enable row level security;
alter table matches enable row level security;
alter table match_players enable row level security;
alter table match_confirmations enable row level security;
alter table proof_uploads enable row level security;
alter table rankings enable row level security;
alter table ranking_events enable row level security;
alter table wallets enable row level security;
alter table credit_transactions enable row level security;
alter table cosmetics enable row level security;
alter table user_cosmetics enable row level security;
alter table subscriptions enable row level security;
alter table entitlements enable row level security;
alter table coaches enable row level security;
alter table coach_slots enable row level security;
alter table coach_requests enable row level security;
alter table videos enable row level security;
alter table video_likes enable row level security;
alter table clubs enable row level security;
alter table club_members enable row level security;
alter table club_events enable row level security;
alter table tournaments enable row level security;
alter table tournament_entries enable row level security;
alter table corporate_leagues enable row level security;
alter table partner_offers enable row level security;
alter table offer_redemptions enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;

create policy "public profile read" on profiles for select using (true);
create policy "own profile update" on profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own profile insert" on profiles for insert with check (auth.uid() = user_id);
create policy "public courts read" on courts for select using (true);
create policy "public slots read" on court_slots for select using (true);
create policy "public rankings read" on rankings for select using (true);
create policy "public cosmetics read" on cosmetics for select using (true);
create policy "public offers read" on partner_offers for select using (true);
create policy "own wallet read" on wallets for select using (auth.uid() in (select user_id from profiles where profiles.id = wallets.user_id));
create policy "own transactions read" on credit_transactions for select using (auth.uid() in (select user_id from profiles where profiles.id = credit_transactions.user_id));
create policy "own cosmetics read" on user_cosmetics for select using (auth.uid() in (select user_id from profiles where profiles.id = user_cosmetics.user_id));
create policy "own cosmetics insert" on user_cosmetics for insert with check (auth.uid() in (select user_id from profiles where profiles.id = user_cosmetics.user_id));
create policy "friendship relevant read" on friendships for select using (true);
create policy "friendship requester insert" on friendships for insert with check (auth.uid() in (select user_id from profiles where profiles.id = requester_id));
create policy "challenge relevant read" on challenges for select using (privacy = 'Public' or auth.uid() in (select user_id from profiles where profiles.id = creator_id));
create policy "challenge creator insert" on challenges for insert with check (auth.uid() in (select user_id from profiles where profiles.id = creator_id));
create policy "invite relevant read" on challenge_invites for select using (auth.uid() in (select user_id from profiles where profiles.id = invited_profile_id));
create policy "match participant read" on matches for select using (id in (select match_id from match_players where auth.uid() in (select user_id from profiles where profiles.id = match_players.profile_id)));
create policy "match participant confirmation" on match_confirmations for insert with check (auth.uid() in (select user_id from profiles where profiles.id = profile_id));
create policy "proof participant read" on proof_uploads for select using (match_id in (select match_id from match_players where auth.uid() in (select user_id from profiles where profiles.id = match_players.profile_id)));
create policy "coach public read" on coaches for select using (true);
create policy "coach owner write" on coaches for insert with check (auth.uid() in (select user_id from profiles where profiles.id = profile_id));
create policy "video public read" on videos for select using (visibility = 'public');
create policy "video creator insert" on videos for insert with check (auth.uid() in (select user_id from profiles where profiles.id = creator_id));
create policy "own notifications read" on notifications for select using (auth.uid() in (select user_id from profiles where profiles.id = profile_id));
create policy "authenticated reports insert" on reports for insert with check (auth.uid() is not null);

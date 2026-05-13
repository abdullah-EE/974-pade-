-- 974 Padel Supabase schema, RLS, and core ranking RPC.
-- Safe to run in a fresh Supabase SQL editor. Re-running is mostly idempotent:
-- tables/columns use if-not-exists and policies are dropped/recreated.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  username text not null unique,
  avatar_url text,
  role text not null default 'player' check (role in ('player', 'coach', 'both', 'club_owner', 'admin')),
  account_role text not null default 'player' check (account_role in ('player', 'coach', 'both')),
  level text not null default 'Intermediate' check (level in ('Beginner', 'Intermediate', 'Advanced')),
  area text,
  favorite_area text,
  favorite_court_id text,
  bio text,
  language text not null default 'en',
  rating integer not null default 1800,
  weekly_points integer not null default 0,
  verified_matches integer not null default 0,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'premium')),
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles(id) on delete cascade,
  addressee_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
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

create table if not exists courts (
  id text primary key,
  club_id uuid references clubs(id) on delete set null,
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

create table if not exists court_slots (
  id text primary key,
  court_id text references courts(id) on delete cascade,
  label text not null,
  status text not null check (status in ('available', 'few-left', 'full')),
  starts_at timestamptz,
  price_qatar_riyal integer
);

create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references profiles(id) on delete cascade,
  court_id text references courts(id),
  starts_at timestamptz,
  level text not null check (level in ('Beginner', 'Intermediate', 'Advanced')),
  privacy text not null default 'public' check (privacy in ('public', 'friends_only', 'private_invite')),
  type text not null default 'doubles' check (type in ('singles', 'doubles', 'open_game')),
  status text not null default 'sent' check (status in ('open', 'sent', 'accepted', 'declined', 'completed', 'cancelled')),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists challenge_invites (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  invited_profile_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'sent' check (status in ('sent', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (challenge_id, invited_profile_id)
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  court_id text references courts(id),
  challenge_id uuid references challenges(id) on delete set null,
  winner text check (winner in ('A', 'B')),
  score text,
  proof_image_url text,
  gps_latitude double precision,
  gps_longitude double precision,
  gps_accuracy_m integer,
  status text not null default 'pending_opponent' check (status in ('pending_opponent', 'confirmed', 'disputed')),
  rating_change integer not null default 0,
  starts_at timestamptz,
  created_at timestamptz not null default now()
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

create table if not exists wallets (
  profile_id uuid primary key references profiles(id) on delete cascade,
  credits integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  reason text not null check (reason in ('verified_match', 'win_streak', 'profile_complete', 'challenge_joined', 'clip_uploaded', 'cosmetic_spend', 'tournament', 'referral')),
  created_at timestamptz not null default now()
);

create table if not exists cosmetics (
  id text primary key,
  name text not null,
  type text not null check (type in ('profile_frame', 'avatar_border', 'player_card_theme', 'badge_display', 'court_background', 'victory_animation')),
  price integer not null default 0,
  premium_only boolean not null default false,
  rarity text,
  asset_url text,
  description text
);

create table if not exists user_cosmetics (
  profile_id uuid references profiles(id) on delete cascade,
  cosmetic_id text references cosmetics(id) on delete cascade,
  equipped boolean not null default false,
  unlocked_at timestamptz not null default now(),
  primary key (profile_id, cosmetic_id)
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

create table if not exists badges (id text primary key, name text not null, description text, icon text);
create table if not exists user_badges (profile_id uuid references profiles(id) on delete cascade, badge_id text references badges(id) on delete cascade, earned_at timestamptz not null default now(), primary key (profile_id, badge_id));
create table if not exists club_members (club_id uuid references clubs(id) on delete cascade, profile_id uuid references profiles(id) on delete cascade, role text not null default 'member' check (role in ('owner', 'manager', 'coach', 'member')), joined_at timestamptz not null default now(), primary key (club_id, profile_id));
create table if not exists club_events (id uuid primary key default gen_random_uuid(), club_id uuid references clubs(id) on delete cascade, title text not null, event_type text not null default 'open_game', starts_at timestamptz, status text not null default 'draft', created_at timestamptz not null default now());
create table if not exists tournaments (id uuid primary key default gen_random_uuid(), club_id uuid references clubs(id) on delete set null, title text not null, format text not null default 'league', entry_fee integer default 0, status text not null default 'draft' check (status in ('draft', 'open', 'running', 'completed', 'cancelled')), created_at timestamptz not null default now());
create table if not exists tournament_entries (tournament_id uuid references tournaments(id) on delete cascade, profile_id uuid references profiles(id) on delete cascade, status text not null default 'entered', created_at timestamptz not null default now(), primary key (tournament_id, profile_id));
create table if not exists corporate_leagues (id uuid primary key default gen_random_uuid(), owner_profile_id uuid references profiles(id) on delete set null, name text not null, organization_name text, status text not null default 'draft', created_at timestamptz not null default now());
create table if not exists coaches (id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete cascade, specialty text not null, area text, court_id text references courts(id), rate_label text, bio text, verified boolean not null default false, created_at timestamptz not null default now());
create table if not exists coach_slots (id uuid primary key default gen_random_uuid(), coach_id uuid references coaches(id) on delete cascade, starts_at timestamptz, label text not null, status text not null default 'available' check (status in ('available', 'requested', 'booked')));
create table if not exists coach_requests (id uuid primary key default gen_random_uuid(), coach_id uuid references coaches(id) on delete cascade, requester_id uuid references profiles(id) on delete cascade, slot_id uuid references coach_slots(id) on delete set null, status text not null default 'requested' check (status in ('requested', 'accepted', 'declined', 'completed')), note text, created_at timestamptz not null default now());
create table if not exists videos (id uuid primary key default gen_random_uuid(), creator_id uuid references profiles(id) on delete cascade, title text not null, description text, thumbnail_url text, video_url text, type text not null check (type in ('Match', 'Training', 'Tip', 'Highlight')), duration text, visibility text not null default 'public' check (visibility in ('public', 'friends_only', 'private')), created_at timestamptz not null default now());
create table if not exists video_likes (video_id uuid references videos(id) on delete cascade, profile_id uuid references profiles(id) on delete cascade, reaction text not null default 'like' check (reaction in ('like', 'save')), created_at timestamptz not null default now(), primary key (video_id, profile_id, reaction));
create table if not exists partner_offers (id uuid primary key default gen_random_uuid(), partner_name text not null, category text not null, offer_title text not null, validity text, redemption_method text, is_premium_only boolean not null default false, created_at timestamptz not null default now());
create table if not exists offer_redemptions (offer_id uuid references partner_offers(id) on delete cascade, profile_id uuid references profiles(id) on delete cascade, redeemed_at timestamptz not null default now(), primary key (offer_id, profile_id));
create table if not exists notifications (id uuid primary key default gen_random_uuid(), profile_id uuid references profiles(id) on delete cascade, type text not null, body text not null, read boolean not null default false, created_at timestamptz not null default now());
create table if not exists reports (id uuid primary key default gen_random_uuid(), reporter_id uuid references profiles(id) on delete cascade, target_type text not null, target_id text not null, reason text not null, status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')), created_at timestamptz not null default now());

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
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table clubs enable row level security;
alter table club_members enable row level security;
alter table club_events enable row level security;
alter table tournaments enable row level security;
alter table tournament_entries enable row level security;
alter table corporate_leagues enable row level security;
alter table coaches enable row level security;
alter table coach_slots enable row level security;
alter table coach_requests enable row level security;
alter table videos enable row level security;
alter table video_likes enable row level security;
alter table partner_offers enable row level security;
alter table offer_redemptions enable row level security;
alter table notifications enable row level security;
alter table reports enable row level security;

drop policy if exists "public profile read" on profiles;
drop policy if exists "own profile insert" on profiles;
drop policy if exists "own profile update" on profiles;
drop policy if exists "public player stats read" on player_stats;
drop policy if exists "public courts read" on courts;
drop policy if exists "public slots read" on court_slots;
drop policy if exists "friendship relevant read" on friendships;
drop policy if exists "friendship requester insert" on friendships;
drop policy if exists "friendship participant update" on friendships;
drop policy if exists "friendship participant delete" on friendships;
drop policy if exists "challenge relevant read" on challenges;
drop policy if exists "challenge creator insert" on challenges;
drop policy if exists "challenge participant update" on challenges;
drop policy if exists "invite relevant read" on challenge_invites;
drop policy if exists "invite relevant update" on challenge_invites;
drop policy if exists "match participant read" on matches;
drop policy if exists "match participant insert" on matches;
drop policy if exists "match players participant read" on match_players;
drop policy if exists "match players participant insert" on match_players;
drop policy if exists "match participant confirmation" on match_confirmations;
drop policy if exists "proof participant read" on proof_uploads;
drop policy if exists "proof participant insert" on proof_uploads;
drop policy if exists "public rankings read" on rankings;
drop policy if exists "own wallet read" on wallets;
drop policy if exists "own transactions read" on credit_transactions;
drop policy if exists "public cosmetics read" on cosmetics;
drop policy if exists "own cosmetics read" on user_cosmetics;
drop policy if exists "own cosmetics insert" on user_cosmetics;
drop policy if exists "coach public read" on coaches;
drop policy if exists "coach owner write" on coaches;
drop policy if exists "video public read" on videos;
drop policy if exists "video creator insert" on videos;
drop policy if exists "public clubs read" on clubs;
drop policy if exists "public tournaments read" on tournaments;
drop policy if exists "public offers read" on partner_offers;
drop policy if exists "own notifications read" on notifications;
drop policy if exists "authenticated reports insert" on reports;

create policy "public profile read" on profiles for select using (true);
create policy "own profile insert" on profiles for insert with check (auth.uid() = user_id);
create policy "own profile update" on profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "public player stats read" on player_stats for select using (true);
create policy "public courts read" on courts for select using (true);
create policy "public slots read" on court_slots for select using (true);
create policy "friendship relevant read" on friendships for select using (auth.uid() in (select user_id from profiles where id in (requester_id, addressee_id)));
create policy "friendship requester insert" on friendships for insert with check (auth.uid() in (select user_id from profiles where id = requester_id));
create policy "friendship participant update" on friendships for update using (auth.uid() in (select user_id from profiles where id in (requester_id, addressee_id)));
create policy "friendship participant delete" on friendships for delete using (auth.uid() in (select user_id from profiles where id in (requester_id, addressee_id)));
create policy "challenge relevant read" on challenges for select using (privacy = 'public' or auth.uid() in (select user_id from profiles where id = creator_id) or id in (select challenge_id from challenge_invites where auth.uid() in (select user_id from profiles where id = invited_profile_id)));
create policy "challenge creator insert" on challenges for insert with check (auth.uid() in (select user_id from profiles where id = creator_id));
create policy "challenge participant update" on challenges for update using (auth.uid() in (select user_id from profiles where id = creator_id) or id in (select challenge_id from challenge_invites where auth.uid() in (select user_id from profiles where id = invited_profile_id)));
create policy "invite relevant read" on challenge_invites for select using (auth.uid() in (select user_id from profiles where id = invited_profile_id) or challenge_id in (select id from challenges where auth.uid() in (select user_id from profiles where id = creator_id)));
create policy "invite relevant update" on challenge_invites for update using (auth.uid() in (select user_id from profiles where id = invited_profile_id));
create policy "match participant read" on matches for select using (id in (select match_id from match_players where auth.uid() in (select user_id from profiles where id = profile_id)));
create policy "match participant insert" on matches for insert with check (auth.uid() is not null);
create policy "match players participant read" on match_players for select using (auth.uid() in (select user_id from profiles where id = profile_id) or match_id in (select match_id from match_players where auth.uid() in (select user_id from profiles where id = profile_id)));
create policy "match players participant insert" on match_players for insert with check (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "match participant confirmation" on match_confirmations for insert with check (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "proof participant read" on proof_uploads for select using (match_id in (select match_id from match_players where auth.uid() in (select user_id from profiles where id = profile_id)));
create policy "proof participant insert" on proof_uploads for insert with check (auth.uid() in (select user_id from profiles where id = uploader_id));
create policy "public rankings read" on rankings for select using (true);
create policy "own wallet read" on wallets for select using (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "own transactions read" on credit_transactions for select using (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "public cosmetics read" on cosmetics for select using (true);
create policy "own cosmetics read" on user_cosmetics for select using (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "own cosmetics insert" on user_cosmetics for insert with check (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "coach public read" on coaches for select using (true);
create policy "coach owner write" on coaches for insert with check (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "video public read" on videos for select using (visibility = 'public');
create policy "video creator insert" on videos for insert with check (auth.uid() in (select user_id from profiles where id = creator_id));
create policy "public clubs read" on clubs for select using (true);
create policy "public tournaments read" on tournaments for select using (true);
create policy "public offers read" on partner_offers for select using (true);
create policy "own notifications read" on notifications for select using (auth.uid() in (select user_id from profiles where id = profile_id));
create policy "authenticated reports insert" on reports for insert with check (auth.uid() is not null);

create or replace function public.confirm_match_and_apply_ranking(p_match_id uuid, p_profile_id uuid, p_confirmation text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  participant_count integer;
  confirmed_count integer;
  disputed_count integer;
  player_record record;
  old_rating integer;
  new_rating integer;
  delta integer := 12;
begin
  if p_confirmation not in ('confirmed', 'disputed') then
    raise exception 'Invalid confirmation';
  end if;

  if not exists (select 1 from match_players where match_id = p_match_id and profile_id = p_profile_id) then
    raise exception 'Not a match participant';
  end if;

  insert into match_confirmations (match_id, profile_id, status)
  values (p_match_id, p_profile_id, p_confirmation)
  on conflict (match_id, profile_id) do update set status = excluded.status, created_at = now();

  select count(*) into disputed_count from match_confirmations where match_id = p_match_id and status = 'disputed';
  if disputed_count > 0 then
    update matches set status = 'disputed' where id = p_match_id;
    return jsonb_build_object('status', 'disputed');
  end if;

  select count(*) into participant_count from match_players where match_id = p_match_id;
  select count(*) into confirmed_count from match_confirmations where match_id = p_match_id and status = 'confirmed';
  if participant_count = 0 or confirmed_count < participant_count then
    update matches set status = 'pending_opponent' where id = p_match_id;
    return jsonb_build_object('status', 'pending_opponent');
  end if;

  update matches set status = 'confirmed', rating_change = delta where id = p_match_id;

  for player_record in select profile_id, team from match_players where match_id = p_match_id loop
    select coalesce(rating, 1800) into old_rating from player_stats where profile_id = player_record.profile_id;
    old_rating := coalesce(old_rating, 1800);
    new_rating := old_rating + delta;
    insert into player_stats (profile_id, rating, weekly_points, verified_match_count, streak, wins)
    values (player_record.profile_id, new_rating, 90, 1, 1, 1)
    on conflict (profile_id) do update set
      rating = new_rating,
      weekly_points = player_stats.weekly_points + 90,
      verified_match_count = player_stats.verified_match_count + 1,
      streak = player_stats.streak + 1,
      wins = player_stats.wins + 1,
      updated_at = now();
    insert into rankings (profile_id, rating, updated_at) values (player_record.profile_id, new_rating, now())
    on conflict (profile_id) do update set rating = excluded.rating, updated_at = now();
    insert into ranking_events (profile_id, match_id, old_rating, new_rating, delta, reason)
    values (player_record.profile_id, p_match_id, old_rating, new_rating, delta, 'confirmed_match');
    insert into wallets (profile_id, credits) values (player_record.profile_id, 120)
    on conflict (profile_id) do update set credits = wallets.credits + 120, updated_at = now();
    insert into credit_transactions (profile_id, amount, reason) values (player_record.profile_id, 120, 'verified_match');
  end loop;

  return jsonb_build_object('status', 'confirmed', 'rating_delta', delta, 'credits', 120);
end;
$$;

insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('cosmetic_assets', 'cosmetic_assets', true),
  ('match_proofs', 'match_proofs', false),
  ('video_thumbnails', 'video_thumbnails', true),
  ('videos', 'videos', false)
on conflict (id) do nothing;

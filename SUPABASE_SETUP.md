# 974 Padel Supabase Setup

This app is safe by default: without Supabase env vars it runs in local mock mode. With public Supabase env vars it uses Supabase Auth, PostgREST, RLS, and the core ranking RPC.

## 1. Create Project

1. Create a Supabase project.
2. In Authentication settings, add your local Expo/web URLs and Vercel URL as allowed redirect/site URLs.
3. For the MVP, either disable email confirmation or expect profile creation to complete after the first successful login.

## 2. Run Schema

1. Open Supabase SQL Editor.
2. Paste and run `backend/schema.sql`.
3. Confirm these exist: `profiles`, `player_stats`, `friendships`, `challenges`, `challenge_invites`, `matches`, `match_players`, `match_confirmations`, `wallets`, `credit_transactions`, `rankings`, `ranking_events`.
4. Confirm the RPC exists: `confirm_match_and_apply_ranking`.

The schema enables RLS and only uses the client-safe public anon key from the app. Never put a service-role key in Expo, Vercel public env vars, GitHub, logs, or screenshots.

## 3. Storage Buckets

`backend/schema.sql` creates bucket rows for:

- `avatars` public
- `cosmetic_assets` public
- `video_thumbnails` public
- `match_proofs` private
- `videos` private

For launch, add Storage policies in Supabase Dashboard:

- avatars: authenticated users can upload to their own folder; public read.
- cosmetic_assets: public read; admin-only write.
- match_proofs: participants can upload/read signed URLs only; not publicly listable.
- videos: private upload/read through signed URLs unless clips are explicitly public.

Current frontend proof photos still work locally. The next backend step is uploading proof files to `match_proofs` and saving `proof_uploads.storage_path`.

## 4. Local Env

Create `.env.local`:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
```

Do not add `SUPABASE_SERVICE_ROLE_KEY` to any frontend env file.

## 5. Vercel Env

Add the same public values in Vercel Project Settings:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Vercel must still build if these are missing; the app falls back to mock mode.

## 6. Manual Flow Test

1. Start the app.
2. Create an account with email/password.
3. Confirm a row appears in `auth.users`.
4. Confirm a row appears in `profiles`.
5. Search players in Rankings.
6. Add a friend; confirm `friendships` row.
7. Create a challenge; confirm `challenges` and `challenge_invites`.
8. Submit a match with proof and GPS; confirm `matches` and `match_players`.
9. Confirm the match from participants; confirm `matches.status = confirmed`, `player_stats`, `rankings`, `ranking_events`, `wallets`, and `credit_transactions`.

## 7. Rate Limiting Plan

Frontend protections already debounce search, throttle friend/challenge/match actions, and prevent duplicate local submits. That is not enough for public launch.

Before launch, add Supabase Edge Functions or a server API for:

- auth/signup attempt throttling
- player search rate limits
- friend request cooldowns
- challenge creation cooldowns
- match submission cooldowns
- proof upload file-size/type enforcement
- coach request/report submission limits

The server layer should reject excessive requests even if a modified client bypasses local cooldowns.

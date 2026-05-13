# 974 Padel Backend and Release Plan

## Backend Start

The app currently uses local state through `src/state/AppState.tsx`.

Backend-ready files now exist:
- `supabase/schema.sql`
- `.env.example`
- `src/services/backend/types.ts`
- `src/services/backend/localBackend.ts`
- `src/services/backend/index.ts`

When Supabase is connected:
1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Add values to `.env`:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
4. Install `@supabase/supabase-js`.
5. Replace the export in `src/services/backend/index.ts` with a Supabase implementation.

## Ranking Model

Use hybrid ranking:
- Elo-style rating for competitive strength.
- Weekly points for activity.
- Verified match count and streak for credibility.

Normal verified games require:
- opponent confirmation
- proof photo
- GPS check

Admin review is reserved for:
- pro games
- tournament matches
- disputes
- unusually large rating-impact matches

## Monetization Space

Already modeled:
- `subscriptionTier`: Free, Premium, Pro
- `tokens`
- cosmetics: profile theme and badge frame
- ad slots hidden for Premium/Pro

Initial paid currency should affect:
- profile cosmetics
- convenience
- visibility
- premium analytics

It should not buy ranking advantage.

## Downloadable Builds

EAS config exists in `eas.json`.

Preview Android APK:
```sh
npm run build:android:preview
```

Preview iOS internal build:
```sh
npm run build:ios:preview
```

Production builds:
```sh
npm run build:all:production
```

Before building for real users:
- login to EAS
- configure project ID
- verify app icons/splash
- test Expo Go build on device
- create privacy policy and support URL
- add store screenshots

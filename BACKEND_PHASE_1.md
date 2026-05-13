# 974 Padel Backend Phase 1

The next build step is real accounts and social/ranking data, not payments.

## Business Logic To Prioritize

- Player network first: accounts, profiles, friends, private invites, open games.
- Verified ranking loop: submit proof, opponent confirms, then rating and credits update.
- Venue support second: courts, availability slots, external booking links.
- Content and coaching as retention loops: coach requests and video posts stay inside the five-tab app.
- Monetization later: keep 974 Credits, cosmetics, premium entitlements, and ad flags in the model, but do not charge users yet.

## Backend Contract

- `supabase/schema.sql` defines profiles, friendships, challenges, open games, matches, confirmations, courts, slots, coaches, videos, wallets, credit transactions, cosmetics, and entitlements.
- `src/services/backend/*` gives the app a Promise-shaped local backend client that can be replaced by Supabase calls without rewriting screen code.
- Ranking math is isolated in `src/services/backend/rankingEngine.ts`.

## Recommended Next Implementation Order

1. Add Supabase client and environment config.
2. Wire local signup to `profiles`.
3. Wire friends and player search.
4. Wire challenge creation, accept, decline, and open games.
5. Wire match proof upload and opponent confirmation.
6. Apply rating/credits only after confirmed match status.
7. Add court/coach/video tables to the UI after the core ranking loop is stable.

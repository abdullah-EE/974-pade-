# 974 Padel Backend Start

This folder is the backend starting point for the next phase. The app still runs frontend-only today, but the data model and service boundary are now ready to connect to a real API without rewriting screens.

## First Backend Slice

Build these API areas first:

- Accounts: local profile becomes a real user.
- Players and friends: search, add/remove friend, privacy lists.
- Courts and availability: replace mock court slots with provider/admin data.
- Challenges: create, accept, decline, join, privacy.
- Matches: submit proof, opponent confirmation, dispute, verified result.
- Wallet/cosmetics: credits ledger, purchases, equipped cosmetics.

## Suggested Tables

Use `schema.sql` as the first PostgreSQL/Supabase-ready draft. It keeps IDs and relationships aligned with the current frontend mock data.

## API Shape

The React Native app should talk to service functions, not directly to Supabase/client code inside screens. Keep this shape:

- `accountService`
- `playerService`
- `friendService`
- `courtService`
- `challengeService`
- `matchService`
- `walletService`
- `cosmeticService`

Each service should eventually call HTTP/Supabase and return the same frontend types already used in `src/types`.

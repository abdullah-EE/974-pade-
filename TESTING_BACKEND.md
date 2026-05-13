# 974 Padel Backend Testing Checklist

Run these checks with Supabase env vars configured, then remove env vars and confirm mock mode still works.

## Security

- No service-role key appears in frontend files, Vercel public variables, logs, or GitHub.
- `.env.local` is ignored.
- `.env.example` contains placeholders only.
- App boots without Supabase env vars.

## Auth/Profile

- User A signs up with email/password.
- User A profile is created with unique username.
- User A can update own profile.
- User A cannot update User B profile through SQL/API.
- Public profile/ranking/court reads work.

## Player Search

- Search by name.
- Search by username.
- Search by level.
- Search by area/favorite area.
- Search is debounced in the frontend.

## Friends

- User A sends friend request.
- Duplicate friend request is rejected or ignored.
- User B can accept/decline own request.
- User C cannot update User A/User B friendship.
- User A can remove friend.

## Challenges

- User A creates `public`, `friends_only`, and `private_invite` challenges.
- Invited player can accept/decline only own invite/challenge.
- Created challenges appear immediately in UI.
- Duplicate rapid challenge taps are throttled locally and should be rate-limited server-side before launch.

## Matches/Ranking/Credits

- User A submits a match with teams and score.
- Duplicate rapid submissions are prevented locally.
- Pending match does not update rating/stats/credits.
- Disputed match does not update rating/stats/credits.
- Confirmed match updates `matches.status`, `player_stats`, `rankings`, `ranking_events`, `wallets`, and `credit_transactions`.
- Credits are awarded only for confirmed match activity and never buy rank.

## Proof/GPS

- Proof photo validates image type/size on client.
- GPS permission accepted captures latitude/longitude/accuracy.
- GPS permission denied shows a clean fallback message.
- Private proof uploads are not publicly listable once storage upload is wired.

## Private Data

- Wallets readable only by owner.
- Credit transactions readable only by owner.
- Private invites readable only by relevant users.
- Notifications readable only by owner.
- Reports insertable by authenticated users.

## Vercel/Expo

- `npm run typecheck` passes.
- `npm run vercel-build` passes.
- `npx expo export --platform android` passes.
- Web works with and without Supabase env vars.
- Expo Go works with and without Supabase env vars.

# Backend-Ready Frontend Architecture

Use this skill when turning 974 Padel screens from static mockups into local-state MVP flows that can later connect to real APIs.

## Architecture Rules
- UI should not own raw mock data. Screens consume hooks, services, or centralized app state.
- Use IDs and relationships between users, players, courts, challenges, matches, friendships, and slots.
- Keep mock data split by domain so backend resources can replace files one at a time.
- Service functions should return Promises where it mirrors future backend calls.
- Keep account, friends, challenges, open games, court availability, and match submissions centralized.

## Domain Files
Maintain clear domain types:
- `types/User.ts`
- `types/Player.ts`
- `types/Court.ts`
- `types/Challenge.ts`
- `types/Match.ts`
- `types/BookingSlot.ts`
- `types/Friendship.ts`
- `types/Entitlement.ts`
- `types/Wallet.ts`
- `types/Coach.ts`
- `types/VideoPost.ts`

Maintain local mock/service files:
- `data/mockPlayers.ts`
- `data/mockCourts.ts`
- `data/mockChallenges.ts`
- `data/mockMatches.ts`
- `data/mockAvailability.ts`
- `data/mockCoaches.ts`
- `data/mockVideos.ts`
- `data/mockUsers.ts`
- `services/playerService.ts`
- `services/courtService.ts`
- `services/challengeService.ts`
- `services/matchService.ts`
- `services/accountService.ts`
- `services/walletService.ts`
- `services/cosmeticService.ts`
- `services/entitlementService.ts`
- `services/coachService.ts`
- `services/videoService.ts`
- `hooks/useAccount.ts`
- `hooks/usePlayers.ts`
- `hooks/useChallenges.ts`
- `hooks/useFriends.ts`
- `hooks/useCourts.ts`
- `hooks/useMatches.ts`
- `hooks/useCoaches.ts`
- `hooks/useVideos.ts`

## Backend Later
Future backend work should be able to replace services without rewriting screens.

Prepare data shape for:
- subscription tier
- ad visibility flags
- premium locks
- wallet/credits
- cosmetics and themes
- coach profiles
- video posts

Do not build backend, Supabase, payments, coaching, video, or monetization screens during the local MVP phase.

## Rejection Test
Reject work if mock data is hardcoded inside screens, buttons only change visuals without state, account/friend/challenge state is scattered, or a backend integration would require rewriting the UI.

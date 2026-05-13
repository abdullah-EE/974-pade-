# Expo React Native Quality for 974 Padel

Use this skill when changing the Expo app, navigation, images, local state, or mobile interactions.

## Expo Go Boundaries
- Keep the app compatible with Expo Go and the installed SDK.
- Do not add native modules unless Expo supports them directly.
- Prefer Expo packages already installed in the project.
- Do not add backend, Supabase, real auth, payments, or booking APIs unless the user explicitly asks for that phase.

## Navigation Rules
- Keep exactly five tabs: Play, Rankings, Submit, Challenges, Profile.
- Use Expo Router route files clearly. Avoid duplicate hidden product tabs unless they are detail routes.
- Tab icons must come from vector icons and must not use default triangles.

## Local MVP State
- Product actions should update local React state: join games, create challenges, add friends, submit matches, confirm/dispute results.
- Every primary button must do something visible: navigate, open a sheet/modal, update state, open an external link, or show a clear future-phase placeholder.
- Use human time labels in UI. Avoid raw ISO date strings.

## Image Quality
- Use `expo-image` through `ImageWithFallback`.
- Main venue cards should use real padel/court images where available.
- Remote images need a premium fallback that is padel-like and venue-specific, not generic maroon blocks.
- Avoid repeated main-card images and wrong sports.

## Verification
Before claiming done, run:
- `npm run typecheck`
- `npx expo export --platform android`

If export or Metro fails, fix the actual red-screen/runtime cause before polishing visuals.

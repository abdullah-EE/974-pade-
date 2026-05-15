# AGENTS.md

These instructions apply to the entire 974 Padel repository.

## Mandatory before UI/product edits
Before editing UI, UX, screens, components, theme, images, navigation, or interactions, read and follow:

1. `DESIGN.md`
2. `.agents/skills/impeccable/SKILL.md`
3. `.agents/skills/emil-design-eng/SKILL.md`

Use the old `.codex/skills/*` files only as legacy references if explicitly requested. The active design guidance is now the two `.agents/skills` files above.

## Product direction
974 Padel is a premium Qatar-focused padel platform centered on tournaments, rankings, player connection, and friendly play.

Current product logic:
- Verified tournaments and approved club events are the only source of official ranking points.
- Friendly challenges are for networking, arranging games, and profile stats only.
- Courts are discovery/external-booking helpers only. Do not claim live court availability unless a club integration exists.

## Current navigation
Exactly 5 tabs:
1. Home
2. Tournaments
3. Rankings
4. Play
5. Profile

Play should contain two distinct sections: Challenge and Submit.

## Non-negotiable UI rules
- Keep the premium Qatar maroon / pearl / charcoal sports-tech identity.
- Make dark screens lighter on the eyes with pearl/off-white surfaces, calmer contrast, soft depth, and better spacing.
- No random blue/purple gradients, irrelevant gold overload, or full-black generic dashboard style.
- Use relevant padel/court/club imagery only.
- No football, basketball, volleyball, kids sports, or irrelevant stock images.
- No fake names like Player 1 Al Doha.
- No raw date strings in UI. Use human wording like Tonight, 8:30 PM.
- No dead primary buttons. Every primary button must navigate, open a modal/bottom sheet, or update local state.
- Do not create a main Courts tab. Put court cards/links inside Play or tournament context.

## Engineering rules
- Expo SDK 54 compatible.
- Frontend only unless explicitly requested otherwise.
- Do not add Supabase/auth/payment/real booking APIs unless explicitly requested.
- Keep code organized in `src/components`, `src/screens`, `src/data`, `src/theme`, `src/types`, `src/utils` where possible.
- Make focused edits. Do not act as a broad autonomous agent unless the user explicitly asks.

## QA checklist before claiming done
Confirm:
- App starts without red screen errors.
- Exactly 5 tabs appear.
- `/` remains the public landing/waitlist page.
- `/demo` without key shows private access.
- `/demo?key=974early` shows the latest interactive app in the mobile frame.
- Tournament/ranking copy says only verified tournaments or approved club events affect official ranking.
- Friendly challenge/result copy says profile stats only.
- Search, filters, segmented controls, bottom sheets, and local state interactions still work.
- Images are relevant and not broken.
- UI does not look like generic stacked AI cards.

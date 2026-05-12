# AGENTS.md

These instructions apply to the entire 974 Padel repository.

## Mandatory before UI/product edits
Before editing UI, UX, screens, components, theme, images, navigation, or interactions, read and follow:

1. `DESIGN.md`
2. `.codex/skills/design-skill-stack/SKILL.md`
3. `.codex/skills/974-padel-premium-ui/SKILL.md`

If any file is missing, recreate it before continuing.

## Product direction
974 Padel is a premium Qatar-focused padel court discovery, open-game, challenge, and verified ranking app.

Primary loop:
Find court -> view availability-style slots -> book externally -> create/open ranked match -> play -> submit result -> verify -> rank changes -> challenge/rematch.

## Non-negotiable UI rules
- Exactly 5 tabs: Play, Rankings, Submit, Challenges, Profile.
- No extra Matches tab.
- No triangle/default icons.
- Use Qatar maroon/pearl/white/charcoal visual identity.
- No gold, random blue, purple gradients, or full-black dashboard style.
- Use relevant padel/court/club imagery only.
- No football, basketball, volleyball, kids sports, or irrelevant stock images.
- No fake names like Player 1 Al Doha.
- No raw date strings in UI. Use human wording like Tonight, 8:30 PM.
- No dead primary buttons. Every primary button must navigate, open a modal/bottom sheet, or update local state.

## Engineering rules
- Expo SDK 54 compatible.
- Frontend only unless explicitly requested otherwise.
- Do not add Supabase, auth, payment, or real booking APIs unless explicitly requested.
- Keep code organized in `src/components`, `src/screens`, `src/data`, `src/theme`, `src/types`, `src/utils` where possible.
- Do not put everything in one file.

## QA checklist before claiming done
Confirm:
- App starts without red screen errors.
- Play screen headline is not clipped.
- Exactly 5 tabs appear.
- Search and filters work locally.
- Court cards open detail or action sheets.
- Booking buttons open placeholder external-booking sheets.
- Submit flow advances through steps and creates pending state.
- Challenge join/accept/decline changes local state.
- Rankings filters work and player rows open details.
- Images are relevant and not broken.
- UI does not look like generic stacked AI cards.

# Visual QA: No Placeholders

Use this skill before claiming any 974 Padel frontend work is complete.

## Non-Negotiable Rejection Rules
- No hero image can render as a plain maroon, black, gray, or generic placeholder block.
- No main court card can use a repeated or plain placeholder visual.
- No two main court cards should look identical.
- No wrong sport imagery: tennis-only courts, football, basketball, kids sports, random teams, or irrelevant stock people.
- No crowded screen should show every section fully open at once.
- No primary button can be silent.

## Layout QA
- Use collapsible sections for secondary content.
- Use horizontal rails for browseable cards.
- Put details in bottom sheets or detail pages instead of stacking every field on the main screen.
- Keep the first viewport focused on the product loop: player status, challenge/open game, courts, coaching, video.

## Interaction QA
- Buttons scale and change shadow/elevation on press.
- Cards compress or lift on press.
- Chips show clear selected/unselected states.
- Disabled/full slots are visibly disabled and cannot be selected.
- Bottom sheets and modals slide/fade in.
- Success states visibly confirm local state changes.

## Backend-Ready QA
- Mock data lives in `src/data`, not inside screen components.
- Screens read through state/hooks/services.
- IDs connect users, players, courts, challenges, matches, coaches, videos, wallet, and cosmetics.
- Future backend work should replace services, not rewrite screens.

## Final Manual Checklist
Check Play, Rankings, Submit, Challenges, Profile, Court Detail, Player Detail, coaching sheets, video sheets, account creation, booking sheets, and customization sheets for:
- visual credibility
- no broken images
- no dead actions
- exactly five tabs
- no backend/payment/Supabase behavior

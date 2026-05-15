---
name: emil-design-eng
description: Use for production-quality UI polish, component feel, button feedback, tasteful motion, microinteractions, depth, transitions, and animation restraint. Based on Emil Kowalski design engineering principles. Not for broad redesigns or backend-only tasks.
license: Reference: https://github.com/emilkowalski/skill/tree/main/skills/emil-design-eng
---

# Emil Design Engineering Skill for 974 Padel

Use this skill when the UI technically works but feels flat, cheap, static, or fake.

## Core philosophy
- Taste is not decoration. It is precise decisions that make the app feel real.
- Unseen details compound: spacing, press states, motion timing, shadows, alignment, and copy all matter.
- Beauty is leverage, but only if it improves trust and usability.

## Animation rules
- Animate only when it helps feedback, state change, spatial clarity, or premium feel.
- Avoid animation for high-frequency actions.
- Keep UI animations under 300ms.
- Use ease-out for entering/feedback interactions.
- Avoid bounce, elastic, slow ease-in, and excessive glow.
- Prefer transform and opacity. Do not animate layout properties.

## Component polish rules
- Buttons should feel pressable with subtle active feedback.
- Cards should have believable depth, not heavy fake shadows.
- Surfaces should feel layered: background, section, card, control.
- Use off-white/pearl surfaces to reduce darkness while keeping maroon identity.
- Motion should be subtle and consistent across the app.

## 974 Padel application
Use this for:
- Home hero polish.
- Tournament card depth.
- Ranking rows and movement indicators.
- Play segmented switch: Challenge / Submit.
- Profile stats and activity cards.
- Bottom sheets and button press feedback.

## Review format
When critiquing UI, use:

| Before | After | Why |
| --- | --- | --- |
| Issue observed | Specific fix | Reason |

## Rejection tests
Reject output if:
- It adds random flashy motion.
- It makes the app slower or heavier.
- It uses fake glass everywhere.
- It turns premium maroon into neon or generic black.
- It changes product logic while polishing visuals.
- It breaks existing local interactions.

## Output style for Codex
Apply this skill to one screen or component at a time. Make focused changes only. Keep layout and functionality stable unless the user explicitly requests otherwise.
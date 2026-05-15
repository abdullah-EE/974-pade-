---
name: impeccable
description: Use for frontend UI/UX critique, polish, layout, visual hierarchy, color, spacing, typography, motion, mobile responsiveness, accessibility, and anti-AI-slop cleanup. Use for 974 Padel app screens, landing pages, demo routes, components, cards, buttons, navigation, and product flows. Not for backend-only tasks.
license: Apache 2.0 reference: https://github.com/pbakaus/impeccable
---

# Impeccable UI Skill for 974 Padel

Use this skill before UI/design edits.

## Purpose
Make 974 Padel feel like a premium Qatar padel product, not a generic AI-generated app.

## Core rules
- Design serves the product. Do not redesign for decoration.
- Keep the app usable, clear, and demo-ready.
- Remove generic AI tells: repeated rounded cards, random icons, purple/blue gradients, dead buttons, crowded sections, fake-looking content.
- Use hierarchy: one clear primary action per section.
- Use fewer, better surfaces instead of stacking cards everywhere.
- Use realistic Qatar padel content and court imagery only.
- Every visible primary button must navigate, open a sheet/modal, or update state.

## 974 Padel visual direction
- Premium Qatar sports-tech feel.
- Dark maroon identity with pearl/off-white surfaces.
- Lighter on the eyes without becoming plain white.
- Use calm contrast, soft depth, restrained shadows, and clear spacing.
- Avoid full-black dashboards, random gold overload, neon glow, generic SaaS styling, or fake 3D effects.

## Screen review checklist
Before editing a screen, ask:
1. What is this screen’s job?
2. What should the user do next?
3. What can be removed?
4. What looks fake, generic, or crowded?
5. Which button/action must work locally?

## Useful commands/prompts
Use these as focused instructions, one screen at a time:
- impeccable critique Home
- impeccable polish Home
- impeccable layout Play
- impeccable typeset Rankings
- impeccable quieter Profile
- impeccable animate buttons

## Anti-patterns to reject
- Nested cards inside cards.
- Generic placeholder people.
- Raw dates instead of human times.
- Irrelevant sport images.
- Dead primary buttons.
- Copy that claims live court availability.
- Rankings affected by friendly matches.
- Full redesigns when only polish was requested.

## Output style for Codex
When applying this skill, make the smallest safe design change. Preserve current functionality and visible structure unless the user explicitly asks to change it.
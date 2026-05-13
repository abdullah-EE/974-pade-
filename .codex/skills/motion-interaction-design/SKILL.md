# Motion Interaction Design for 974 Padel

Use this skill when designing button, card, sheet, modal, chip, ranking, challenge, or success-state motion.

## Motion Personality
974 Padel should feel athletic, premium, and tactile. Motion should communicate weight and confidence.

Use:
- slight press compression on buttons and cards
- soft card lift or shadow change on press
- selected chips that visibly pop forward
- bottom sheets that slide/fade in smoothly
- success states that pop once, then settle
- ranking movement that feels alive but restrained

Avoid:
- playful bouncing loops
- excessive springiness
- random animated decoration
- heavy motion that makes the app feel childish
- motion that hides slow or broken interactions

## Interaction Requirements
- Primary CTAs need pressed depth.
- Venue cards need tactile press feedback.
- Filter chips need selected/unselected feedback.
- Challenge and friend actions need immediate local-state confirmation.
- Full availability slots must visibly disable and refuse selection.

## Implementation Notes
- Prefer `Animated`/Reanimated/Moti only where the project already supports it.
- Keep animation durations short: most press and modal interactions should resolve under 250ms.
- Respect mobile performance: do not animate large lists unnecessarily.

## QA
Interact through the main loop:
Find court -> select slot -> book externally -> start ranked -> add/challenge player -> submit proof -> pending verification.
If a tap does nothing, fix it or remove the button.

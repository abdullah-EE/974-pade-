# Mobile Premium UI

Use this skill for premium mobile UI rebuilds in this repo.

## Non-Negotiables
- Start from the product loop, not a decoration pass.
- Use real imagery or credible product-owned visuals as the first-class layout anchor.
- Do not ship repeated placeholder cards.
- Do not ship crowded all-open screens; secondary modules must be collapsible.
- Do not rely on remote image URLs for critical venue cards unless they are verified and have a premium fallback.
- Make touch targets physical: press scale, shadow shift, active state, clear feedback.

## Layout Patterns
- Discovery screens need one large media-led hero, then horizontal venue/action rows.
- Use collapsible sections plus horizontal rails to keep screens breathable.
- Social sports screens need athlete status, rivals, friends, recent activity, and clear next action.
- Booking screens should prioritize time, availability, price, venue context, and external handoff clarity.
- Profile screens should feel like athlete status pages, not settings pages.

## Rejection Test
Reject if the screen still works without images, feels like generic cards, has silent buttons, or does not make the next action obvious within 3 seconds.

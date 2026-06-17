## Direction

Building the **Warm paper & stamp** direction — it's the only one that honors DESIGN.md (paper/ink/carbon + wire/stamp/mint palette, Space Grotesk + IBM Plex Sans/Mono, no purple gradients, stamp metaphor as the signature). The dark cinematic version uses Inter + blue→mint gradients which are explicitly banned in DESIGN.md.

## What ships

A single-page TanStack route at `/` with:

1. **Scroll-condensing pill navbar** — Fluence/Alytics style. Starts wider with subtle border; on scroll past ~40px it shrinks padding, tightens max-width, and lifts shadow. Smooth `cubic-bezier(0.16, 1, 0.3, 1)` transition.
2. **Hero** — "Ship things. Dispatch the rest." with stamp-orange accent on the second line. Live-wire badge, two CTAs (Star on GitHub, See it in action), meta row (MIT, LangGraph+Claude).
3. **Animated wire-feed mock** (right side of hero) — teletype card with timestamped entries; LI/X/RD platform stamps punch in sequentially (scale 1→0.92→1.08→1, ~220ms, staggered). Rotated "VERIFIED" stamp overlay.
4. **Problem strip** — 4 numbered cards in a hairline grid on subtle ink tint.
5. **Features bento** — 6 cards in 3-col grid with two `col-span-2` cards (Project Memory with mock data block; Narrative Arcs on inverted ink card). Other 4 single-col: Voice, Critic, Multi-platform routing, Ambient capture.
6. **Wire + Desk preview** — framed window, left pane = wire feed list, right pane = desk with platform tabs (LinkedIn active), draft text, stamp-colored critic callout, Approve & Dispatch button.
7. **Open-source story + CTA** — blockquote, project chips (fltrd / Miryn / Stash / ChaiPaani / Dispatch highlighted), `docker compose up -d` copy block, MIT/self-hostable/LangGraph chips.
8. **Footer** — logo, GitHub/Docs/Changelog links, MIT badge, "no cookies · no trackers".

All sections get scroll-reveal (opacity + 8px translate, respects `prefers-reduced-motion`).

## Technical

- Tokens in `src/styles.css` via `@theme`: `--color-paper/ink/carbon/wire/stamp/mint`, font families.
- Fonts: load Space Grotesk + IBM Plex Sans + IBM Plex Mono via `<link>` in `src/routes/__root.tsx` head (per Tailwind v4 rules — no `@import` URL).
- New file: `src/routes/index.tsx` replacing the placeholder. Split into small section components under `src/components/landing/` (Navbar, Hero, WireFeedMock, ProblemGrid, FeaturesBento, WireDeskPreview, StorySection, CTA, Footer).
- Scroll-condensing nav: `useEffect` listener on `scroll`, toggle `condensed` boolean → class swap. No external lib.
- Stamp punch animation: CSS keyframes + staggered `animation-delay`. IntersectionObserver re-triggers when hero scrolls back into view.
- SEO: route `head()` with title, meta description, og/twitter tags, single H1, semantic sections.
- No backend, no Lovable Cloud — pure marketing page.

## Out of scope

GitHub auth, real posting flow, dashboard, signup. This is the landing page only.

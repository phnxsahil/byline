---
name: impeccable
description: Guidelines and rules for the Impeccable Design Language, featuring a Noir & Ember Gold aesthetic, cinematic pacing, editorial typography, and motion rules.
---
# Impeccable Design Language & Rules

Adhere to the **Impeccable Design Language** guidelines to ensure premium, high-fidelity UI/UX that avoids standard "AI-generated slop" patterns.

## Design Registers

Use a **Brand Register** approach:

- **Core Focus**: Emotional storytelling, cinematic atmosphere, visual pacing, and premium editorial typography.
- **Aesthetic**: Noir & Ember Gold. An A24 mountain documentary meets an Arc'teryx catalog.
- **Goal**: Inspire users to disconnect and book life-changing adventures.

---

## Typography Guidelines

1. **Font Pairings**:
   - **Headings**: `Fraunces` (a beautiful, expressive serif font with high soft properties). Use it for large Display copy.
   - **Body**: `Inter` (a clean, legible sans-serif). Use it for reading blocks.
   - **Metadata / Labels**: `JetBrains Mono` (a high-precision monospaced font). Use it for coordinates, data strips, and labels.
2. **Fluid Scaling**:
   - Use `clamp()` for displaying title fonts (e.g. `text-display-xl` fluidly scales from `3.25rem` on mobile to `7.5rem` on wide desktop screens).
3. **Pacing**: Use large letter-spacing and generous line heights (`leading-[0.96]` or `leading-relaxed`) to prevent crowded visual blocks.

---

## Color & Contrast

1. **No Pure Black**: The primary background is a rich charcoal-bronze `#050505`.
2. **Tinted Neutrals**: All neutral surfaces and cards use warm tints (e.g. `bg-surface` `#14110D` or `bg-surface-warm` `#1F1814`).
3. **No Gray on Color**: Muted text on colored/dark elements uses lighter shades of the base color (`#8A8175` or `F2EAD8` opacity) rather than flat grays.
4. **Highlights**: The primary accent is Ember Gold (`#D69155`) with a softer hover glow (`#F2B271`).

---

## Motion & Transitions

1. **Deceleration Curves**: Always use smooth deceleration curves:
   - `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-premium ease-out).
   - Easing duration should be relatively slow (e.g., `1200ms` to `2000ms`) for a documentary pacing.
2. **GPU Optimization**: Animate only `transform` (scale, translate) and `opacity` properties. Never animate layout-triggering properties like `width`, `height`, or `padding`.
3. **Auto-Playing Reels**: Ensure vertical reels loop and transition automatically using clean intervals, with options to mute and pause for user control.

---

## Spatial Design & Responsive Layouts

1. **Fluid Whitespace**: Use generous vertical paddings (`py-24 md:py-32`) to separate narrative chapters.
2. **No Card Overload**: Present sections as full-bleed visual grids, stacked chapters, or parallax blocks instead of generic boxes.
3. **Mobile-First Tap Targets**:
   - Ensure interactive links/buttons have a minimum touch target size of `44px` height and width.
   - Stack grids vertically on viewports `< 768px` and provide native horizontal swipe containers (`snap-x-mandatory` with hidden scrollbars) for dense media cards.

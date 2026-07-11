# Byline Design System

This document outlines the core design tokens, typography, layout structures, and animation philosophies used across the Byline web application. It acts as the single source of truth for the project's visual identity.

## 1. Core Tokens (Colors)

We rely on a minimal, dark, and highly structured color palette to simulate a terminal/IDE environment while maintaining editorial polish.

```css
:root {
  --bg: #0D1117;               /* Main Application Background (GitHub Dark) */
  --bg2: #161B22;              /* Card Surface / Secondary Background */
  --bg3: #21262D;              /* Elevated Surface / Hover States */
  
  --border: #30363D;           /* Default Border (Subtle) */
  --border2: #3D444D;          /* Hover Border / Stronger Demarcation */
  
  --text-primary: #E6EDF3;     /* Primary High-Contrast Text */
  --text-secondary: #8B949E;   /* Secondary Muted Text */
  --dim: #484F58;              /* Tertiary / Placeholder Text */
  
  --accent: #F0A500;           /* Amber Orange - THE ONLY TRUE ACCENT COLOR */
  --by-green: #3FB950;         /* Success / Live Indicator */
  --by-red: #F85149;           /* Error / Danger */
  --by-blue: #58A6FF;          /* Info / Code Keywords */
}
```

## 2. Typography

We use three primary font families to distinguish between editorial content, UI elements, and technical data.

- **Headers & Display:** `Space Grotesk, system-ui, sans-serif`
  - Used for `h1`, `h2`, and major section titles. Gives the brand a slightly technical but geometric and modern edge.
- **Body & UI:** `Inter, system-ui, sans-serif`
  - Used for standard paragraphs, descriptions, and UI elements.
- **Monospace (Terminal, Code, Badges):** `var(--byline-font-mono)` (resolves to `JetBrains Mono` or `IBM Plex Mono`)
  - Used for code blocks, terminal outputs, small metadata eyebrows (`/00`), and timestamps.

## 3. Layout Patterns

Byline utilizes an underlying architectural grid system.

- **The Grid (`.ta-grid`)**: A 4-column CSS grid that dictates the layout of major sections.
  ```css
  .ta-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    max-width: 1400px;
  }
  ```
- **The Columns (`.ta-col`)**: Items within the grid are bounded by borders. 
- **The Crosshairs (`.ta-cross`)**: Small `+` markers placed at the intersections of grid lines to reinforce the technical, blueprint-like aesthetic.
- **Dither Pattern (`.dither-pattern`)**: A noise overlay applied globally or to specific sections (like the Footer) to add grit and texture, removing the "flatness" of pure dark mode.

## 4. Animation Philosophy

Animations must be purposeful, subtle, and technical. We avoid bouncy, elastic, or overly dramatic transitions.

- **Terminal Typewriter:** Used in the Hero section to simulate live text generation.
- **Shutter Reveals (`.dispatch-reveal`)**: Elements slide up smoothly (20px) and fade in when they enter the viewport (`IntersectionObserver`).
- **Bento Staggers (`.dispatch-bento-card`)**: Lists or grids (like Features) animate in sequence using a staggered `transition-delay` based on their `data-index`.
- **Ambient Pulses (`amberPulse`)**: Used sparingly on primary CTAs or live indicators to draw the eye without disrupting the layout.
- **Stamp Rotations**: The Byline logo stamp rotates slowly (10s linear) in the background to add dynamic depth.

## 5. UI Elements

- **Eyebrow Badges**: Format: `/01 SECTION NAME`. Uses monospace font, with the slash/number in `var(--accent)`.
- **Pixel Buttons**: Buttons with crisp corners (no border-radius) or very subtle rounding. Primary actions use the `amberPulse`, while secondary actions use subtle border-color transitions.
- **Code Blocks**: Always housed within a pane featuring a Mac-like or minimalist terminal header (with filename).

## 6. Dashboard Architecture (The Desk)
*Upcoming Hybrid Approach for The Desk:*
- **Agent Mode (The Feed):** LangGraph visualization feed showing real-time agent execution.
- **Full Control Mode (The Editor):** Split-pane layout (Markdown editor left, live preview right) giving founders manual override capabilities before publishing via Composio.

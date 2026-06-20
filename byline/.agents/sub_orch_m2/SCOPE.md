# Scope: R2 Command Palette (Milestone 2)

## Architecture
- Refactor/rewrite `src/app/components/dispatch/CommandPalette.tsx`.
- Modal overlay centered, max-width 560px, background `var(--by-bg-2)`, border `var(--by-border)`.
- Use `'IBM Plex Mono', monospace` for all keyboard hints.
- Fuzzy matching navigation destinations (Overview, Desk, Signal, Activity, Settings, Docs).
- fuzzy matching into Docs sections by indexing document headings. Selecting a doc heading should navigate to the Docs tab and scroll to that specific element.
- **Fallback Row**: If typed text does not match any navigation destinations, render a fallback result row: `Dispatch: '{query}'`.
- Selecting the Fallback Row calls `runPipeline(query)` in `DashboardLayout.tsx` (using the same pipeline run trigger) and closes the palette.
- Pressing Escape closes the command palette.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 2.1 | Refactor UI & Fonts | Update fonts, colors, border styles to match tokens and IBM Plex Mono hints. | None | PLANNED |
| 2.2 | Fuzzy Search Navigation | Integrate destination matching and doc section indexing for fuzzy searches. | M2.1 | PLANNED |
| 2.3 | Fallback Pipeline Trigger | Add freeform fallback row and connect to runPipeline(query). | M2.2 | PLANNED |
| 2.4 | Dismissal Handling | Handle Escape key and backdrop clicks. | M2.1 | PLANNED |

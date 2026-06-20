# Plan: R2 Command Palette (Milestone 2)

## Goal
Implement Milestone 2: R2 Command Palette in `src/app/components/dispatch/CommandPalette.tsx`.

## Sub-Milestones & Verification Plan
1. **Refactor UI & Fonts**: Update styling of the modal, center it, max-width 560px, colors (`var(--by-bg-2)`, `var(--by-border)`), and font-family for hints to `'IBM Plex Mono', monospace`.
2. **Fuzzy Search Navigation & Documentation**:
   - Update fuzzy matching to work for navigation destinations: Overview, Desk, Signal, Activity, Settings, Docs.
   - Index the documentation headings (specifically "Getting Started" or dynamically from `DocsTab.tsx` if possible, otherwise hardcoded based on DocsTab's static headings). Selecting a doc heading should navigate to the Docs tab and scroll to that specific element.
3. **Fallback Row**:
   - If typed text does not match any navigation/doc destinations, render a fallback row: `Dispatch: '{query}'`.
   - Selecting this row calls `runPipeline(query)` in `DashboardLayout.tsx` and closes the palette.
4. **Dismissal Handling**:
   - Close the palette when Escape is pressed.
   - Close the palette when backdrop/overlay is clicked.

## Execution Strategy (Iteration Loop)
1. **Explore**: Spawn `teamwork_preview_explorer` to study `CommandPalette.tsx`, `DashboardLayout.tsx`, and `DocsTab.tsx` and detail the exact refactoring strategy.
2. **Implement**: Spawn `teamwork_preview_worker` to apply the changes, ensuring we do not violate any integrity checks.
3. **Review**: Spawn `teamwork_preview_reviewer` to review changes.
4. **Challenge**: Spawn `teamwork_preview_challenger` to verify edge cases (e.g. keyboard navigation, Escape handling, fallback triggers).
5. **Audit**: Spawn `teamwork_preview_auditor` to run integrity checks.
6. **Gate**: Evaluate results and finalize.

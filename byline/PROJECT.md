# Project: Byline Dashboard Rebuild

## Architecture
- **Framework**: Next.js 14 App Router layout (`src/app/components/dispatch/dashboard`)
- **Layout Structure**: 
  - Left Sidebar Navigation (232px, `var(--by-bg-2)`, right border)
  - TopBar (simplified: logo, project switcher, `⌘K` shortcut button, avatar)
  - Right Agent Rail (collapsible: 56px collapsed / 280px expanded / fullscreen, animated)
  - Center Content Pane (renders active tab component: Overview, Desk, Signal, Activity, Settings, Docs)
- **State Management**:
  - `activeTab` (`overview` | `desk` | `signal` | `activity` | `settings` | `docs`) managed in `DashboardLayout.tsx`
  - `railState` (`collapsed` | `expanded` | `fullscreen`) managed in `DashboardLayout.tsx`
  - `agentSteps` (list of `AgentStep` trace objects representing the current active run)
  - `selectedRun` (past run details for decision trace view) in `ActivityTab.tsx`
- **Design Tokens**: Standardized in `src/styles/byline-tokens.css` with `var(--by-*)` colors and fonts in `src/styles/fonts.css`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | R1 Navigation & Sidebar | Left sidebar (232px) replacing top tab buttons; TopBar simplification (⌘K button). | None | DONE |
| 2 | R2 Command Palette | Update CommandPalette.tsx (fuzzy match nav/docs headings, dispatch fallback, IBM Plex Mono). | M1 | IN_PROGRESS (00652099-68cd-4a67-b71a-2ba2d261470e) |
| 3 | R3 Agent Rail | Build collapsible right AgentRail (56px/280px/fullscreen) replacing ChatPanel.tsx. | M1 | PLANNED |
| 4 | R4 & R7 Simulation & Trace | Emit AgentStep traces in DashboardLayout.tsx; implement Decision Trace detail view and blocked filter in ActivityTab.tsx. | M3 | PLANNED |
| 5 | R5 Settings Restructure | 5 section sub-nav in SettingsTab.tsx (Connect, Voice, Pipeline, API, Danger Zone), per-platform overrides, reset confirmation. | M1 | PLANNED |
| 6 | R6 Docs Tab | Create DocsTab.tsx (sticky sub-nav, inline SVG pipeline diagram, playbook cards, API table). | M1, M2 | PLANNED |
| 7 | Integration & Audit | E2E integration test verification and Forensic Audit checking. | M1, M2, M3, M4, M5, M6 | PLANNED |

## Interface Contracts
### AgentStep Data Shape
```ts
export interface AgentStep {
  agentId: "strategist" | "linkedin" | "x" | "reddit" | "critic";
  startedAt: number;
  finishedAt?: number;
  status: "pending" | "running" | "done" | "blocked" | "error";
  input: { context: string[]; instructions: string };
  output?: { draft?: string; reasoning?: string; score?: number };
  decisions: { label: string; detail: string }[];
}
```

## Code Layout
- `src/app/components/dispatch/dashboard/DashboardLayout.tsx` — Central layout & state
- `src/app/components/dispatch/dashboard/TopBar.tsx` — Global header
- `src/app/components/dispatch/dashboard/AgentRail.tsx` — Left border collapsible agent panel (replaces ChatPanel.tsx)
- `src/app/components/dispatch/dashboard/ActivityTab.tsx` — Observability tab (Decision Trace view)
- `src/app/components/dispatch/dashboard/SettingsTab.tsx` — Configuration settings grouped by section
- `src/app/components/dispatch/dashboard/DocsTab.tsx` — User-facing documentation
- `src/app/components/dispatch/CommandPalette.tsx` — Global modal overlay search

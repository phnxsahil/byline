## 2026-06-19T22:45:51Z
Role: Lead Frontend Implementer
Working Directory: D:\Projects\dispatch\byline\.agents\worker_m2_6\
Objective: Implement Milestones 2 through 6 of the Byline Dashboard Rebuild and resolve existing test failures.

========================================================================
MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT
hardcode test results, create dummy/facade implementations, or
circumvent the intended task. A Forensic Auditor will independently
verify your work. Integrity violations WILL be detected and your
work WILL be rejected.
========================================================================

DESIGN SYSTEM ANCHOR:
Use var(--by-*) everywhere from src/styles/byline-tokens.css, never hardcode hex values in component files.
--by-bg:      #0F0F0D   page background
--by-bg-2:    #1A1A18   sidebar, cards, panels
--by-bg-3:    #21262D   inputs, hovered rows, code blocks
--by-border:  rgba(245,244,240,0.1)
--by-text:    #F5F4F0   primary text
--by-text-2:  rgba(245,244,240,0.6)   muted labels
--by-text-3:  rgba(245,244,240,0.35)  timestamps, placeholders
--by-accent:  #E85E2C   buttons, active states — THE signature color
--by-green:   #3FB950   success/done
--by-amber:   #F59E0B   warnings/flags
--by-red:     #F87171   errors/blocked

Fonts: Inter (body), IBM Plex Mono (code, timestamps, logs, anything terminal-feeling), Space Grotesk (logo/wordmark only).
Aesthetic: warm-dark "mountain journal / field log" feel. Sharp small corner-radii (4-6px). Monospace timestamps. No gradients, glassmorphism, or blur.

========================================================================
TASKS:

Phase 1: Fix Existing Test Layout & Strict Mode Mismatch
- In `src/app/App.tsx`, change the page root wrapper from `div` to `main` (preserving styles/attributes).
- In `src/app/components/dispatch/dashboard/DashboardLayout.tsx`, change the top-level outer wrapper `div` to `section` (line 177) and the inner flex wrapper `div` (line 194) to `article` (or separate tag wrapper), so that Playwright's selectors (`div { has: overviewBtn }` and `div { hasText: 'byline_' }`) correctly resolve to the sidebar and topbar instead of the outermost page container.
- In `src/app/components/dispatch/dashboard/StatusBar.tsx`, change the `<button>⌘K</button>` at line 49 to a `<span>⌘K</span>` to resolve the strict mode locator violation.
- In `src/app/components/dispatch/dashboard/SignalTab.tsx` at line 137, change "SIGNAL FEED" header to "SIGNALS FEED" (or "SIGNALS") to resolve the missing "Signals" text failure in navigation switching tests.

Phase 2: Milestone 2 — Command Palette (`⌘K`)
- In `src/app/components/dispatch/CommandPalette.tsx`, replace `'DM Mono'` with `'IBM Plex Mono', monospace` for all keyboard hints, titles, etc.
- Support a freeform input fallback. If the query doesn't match any known navigation destination, show a single row: "Dispatch: '{query}'". When clicked or selected (Enter), it must call a new callback `onDispatch(query)` prop, which in `DashboardLayout.tsx` calls `runPipeline(query)`.
- Make sure all Doc headings (Documentation, Getting Started, etc.) are indexed in the palette's commands and nav to Docs with anchor/scroll target.

Phase 3: Milestone 3 — Agent Rail
- Rebuild `src/app/components/dispatch/dashboard/ChatPanel.tsx` as `AgentRail` (updating references in DashboardLayout). It must support a persistent sidebar width transition (200-250ms ease).
- It must take a state `railState` ("collapsed" | "expanded" | "fullscreen") and an `onRailStateChange` handler (controlled in DashboardLayout).
- Collapsed (56px): vertical strip of 5 status dots, 12px circles. Status colors: pending (outline only), running (amber pulsing, 1.2s loop), done (solid green), blocked (solid red), error (solid red with thin white outline). Hovering shows tooltip with agent's latest decision label in IBM Plex Mono. Clicking expands.
- Expanded (280px): header with agent name, status dot, collapse, and fullscreen buttons. Full chat messages. Below each agent message: collapsed `<details>` reasoning container showing decisions in IBM Plex Mono.
- Fullscreen: takes over main layout. Puts "Exit fullscreen" button top-right. Add hotkey `⌘+Shift+A` (or `Ctrl+Shift+A`) in DashboardLayout to toggle fullscreen.

Phase 4: Milestone 4 & 7 — Simulation & Trace
- In `DashboardLayout.tsx`, rewrite the simulation engine. Define `AgentStep` objects following the spec. Maintain list of `AgentStep` traces. Stagger simulation: Strategist runs first, then 3 Writers in parallel, then Critic. Make sure Critic fakes judgment (e.g. warning flags and blocked states for Reddit self-promo match).
- In `ActivityTab.tsx`, implement the Decision Trace detail view when clicking a past run. It should render the agent cards with inputs, decisions (with correct icons), and output drafts. Add a prominent "Blocked" filter pill in the Activity filters list.

Phase 5: Milestone 5 — Settings Restructure
- Restructure `SettingsTab.tsx` into a left sub-nav layout with 5 sections: Connect, Voice & Brand, Pipeline Behavior, API & Developer, Danger Zone.
- Connect: key fields, Composio link, platform status.
- Voice & Brand: voice profile, blocklist, platform tone dropdowns.
- Pipeline Behavior: skill toggles, floor slider, approval override table per platform (auto-post, review required, drafts only).
- API & Developer: keys table, webhooks, self-host stats.
- Danger Zone: red border. Export all data (JSON download) and Reset pipeline (requires confirmation modal).

Phase 6: Docs Tab
- Complete `DocsTab.tsx` with single-page scroll, sticky sub-nav, Quick Start code block (remove from LeftPanel), SVG flow chart (Strategist -> 3 parallel Writers -> Critic with static status indicator dots), playbooks, and API endpoints table.

Verify your changes compile and run `npm run build` to confirm. Report back detailed results and files modified.

# Original User Request

## Initial Request — 2026-06-19T21:51:00Z

Rebuild the Byline dashboard (`D:\Projects\dispatch\byline\src\app\components\dispatch\dashboard\`) with a clean, minimal, agentic look. Merge the best of the existing implementation with the v2 spec (`byline-v2-spec.md`) and frontend prompts (`byline-frontend-prompts.md`). The result should be a sidebar-nav dashboard with a persistent Agent Rail, Command Palette, and restructured Settings — all using the existing Byline design tokens.

Working directory: `D:\Projects\dispatch\byline`

Integrity mode: development

---

## Design System (DO NOT DEVIATE)

All CSS tokens are already defined in `src/styles/byline-tokens.css`. Use `var(--by-*)` everywhere. Never hardcode hex values in component files.

```
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
```

Fonts: Inter (body), IBM Plex Mono (code/timestamps/logs/terminal), Space Grotesk (logo/wordmark only). These are already loaded via `src/styles/fonts.css`.

Aesthetic: warm-dark "instrument panel / field log." NOT generic SaaS dark mode. Sharp corners (4–6px radius, never pill-shaped). Monospace timestamps. No gradients, no glassmorphism, no blur. `--by-accent` (orange) is the ONLY saturated color in the UI — use it sparingly.

---

## Requirements

### R1. Sidebar Navigation replacing the TopBar tab bar

Replace the current 5-tab centered TopBar navigation with a persistent left sidebar (232px wide, `var(--by-bg-2)` background, right border `var(--by-border)`). The sidebar contains nav items:

- Overview, Desk, Signal, Activity, Settings, Docs (new)

Each item: Tabler icon + label. Active state = 2px left border in `var(--by-accent)` + `var(--by-text)` color. Inactive = `var(--by-text-2)`. The TopBar is kept but simplified: logo only + project switcher dropdown + a visible `⌘K` pill button + avatar. No more centered tabs in the TopBar.

Mobile (`<900px`): sidebar collapses to hamburger-triggered overlay, preserving the existing mobile behavior.

### R2. Command Palette (`⌘K` / `Ctrl+K`)

A `CommandPalette.tsx` component (one already exists at `src/app/components/dispatch/CommandPalette.tsx` — reuse/rewrite it). Behavior:

- Centered modal, max-width 560px, `var(--by-bg-2)` background, `var(--by-border)` border, IBM Plex Mono for keyboard hints.
- Fuzzy-matches against nav destinations AND accepts freeform input.
- If typed text doesn't match a known destination, shows a single result row: `Dispatch: '{typed text}'` — selecting it calls the existing `runPipeline()` dispatch function (do NOT create a second dispatch path).
- The palette must be the primary dispatch entry point, not just a nav shortcut. This is the nerve center of the agentic feel.
- Indexable doc sections (e.g. typing "reddit" jumps to the Reddit playbook card in Docs tab).

### R3. Agent Rail — replacing the floating ChatPanel overlay

Build the Agent Rail as a right-side panel in three states, controlled by a single `railState: "collapsed" | "expanded" | "fullscreen"` value:

**Collapsed (56px):** Vertical strip with 5 status dots (Strategist, LinkedIn, X, Reddit, Critic). Each dot is 12px. Status → color: pending = `var(--by-text-3)` outline only, running = `var(--by-amber)` with a pulse animation (opacity 0.4–1.0, 1.2s loop), done = solid `var(--by-green)`, blocked = solid `var(--by-red)`, error = solid `var(--by-red)` with a thin white outline. Hovering a dot shows a tooltip with the agent's one-line decision summary.

**Expanded (280px):** Full chat thread (reuse existing `ChatPanel` message rendering). Header shows agent name + status dot + collapse and fullscreen buttons. Below each agent message: a collapsed-by-default "Reasoning" disclosure with the decisions array as a bulleted list in IBM Plex Mono.

**Fullscreen (`⌘+Shift+A`):** Rail takes over the main content area with an "Exit fullscreen" button top-right.

Transitions between states animate (200–250ms ease, not snap). This replaces the `ChatPanel` overlay role. Keep `RunLogPanel` separate.

### R4. Activity Tab — Decision Trace View

Add a Decision Trace detail view to `ActivityTab.tsx`, opened by clicking any past pipeline run. Layout: full-width panel (not a modal — push into content area with a "back to activity" affordance). Shows the run's AgentStep chain: Strategist → LinkedIn Writer → X Writer → Reddit Writer → Critic.

Each step as a card (`var(--by-bg-2)`):
- Header: agent name + status badge (same dot+color vocab as Agent Rail).
- "What it received" — collapsed by default, shows `AgentStep.input.context` as a bulleted list.
- "What it decided" — always visible, shows `AgentStep.decisions` as a list with icons: info icon for routine decisions, warning-triangle (`var(--by-amber)`) for altered-path decisions, blocked icon (`var(--by-red)`) for blocked steps.
- "Output" — the draft text if done, nothing if blocked.

Add a "Blocked" filter pill to the existing filters — this must be visually prominent, not buried.

The `AgentStep` type to use:
```ts
type AgentStep = {
  agentId: "strategist" | "linkedin" | "x" | "reddit" | "critic";
  startedAt: number;
  finishedAt?: number;
  status: "pending" | "running" | "done" | "blocked" | "error";
  input: { context: string[]; instructions: string };
  output?: { draft?: string; reasoning?: string; score?: number };
  decisions: { label: string; detail: string }[];
};
```

The simulation layer (`setInterval` in `DashboardLayout.tsx`) must emit `AgentStep` objects, not strings — so swapping in a real SSE stream later is a data-source change, not a UI rewrite.

### R5. Settings Tab — Restructure into 5 grouped sections

Restructure `SettingsTab.tsx` from its current flat list into 5 groups, each accessible via a sub-nav within the Settings view:

1. **Connect** — Provider keys (Anthropic/OpenAI), Composio + per-app connections (LinkedIn/X/GitHub/Reddit/Linear), platform outlet toggles with live connection status.
2. **Voice & Brand** — Voice profile (last trained, retrain button), phrase blocklist, per-platform tone overrides (new: dropdown per platform for Reddit/LinkedIn/X/Threads tone rules).
3. **Pipeline Behavior** — Agent skill toggles (moved here from LeftPanel), Critic Floor slider, Post Frequency, global approval mode, and a **new per-platform approval override table** (LinkedIn / X / Reddit / Threads rows, each with its own `auto-post | review required | drafts only` dropdown, defaulting to the global setting but independently overridable).
4. **API & Developer** — Byline API keys table, webhook config, self-host info (version, Docker status).
5. **Danger Zone** — "Export all data" button (triggers JSON download of project context + voice profile + past drafts), "Reset pipeline" button (confirmation modal required, `var(--by-red)` styling, thin red-tinted border around this section only).

### R6. Docs Tab (new)

Build `DocsTab.tsx` as a new sidebar nav item (6th item). Single-page scroll with a sticky in-page sub-nav:

1. **Quick start** — the existing 3-step self-host code block (move it here from LeftPanel and remove it from LeftPanel).
2. **How the pipeline works** — an inline SVG diagram (not an image): Strategist → 3 parallel Writers → Critic, with a short caption per node explaining what it optimizes for. Reuse the Agent Rail dot/color vocab for each node's visual state indicator (illustrative, not live).
3. **Platform playbooks** — 4 cards (LinkedIn / X / Reddit / Threads), each with 2–3 bullets on what Byline checks before drafting. Written from user perspective (what the system does for them).
4. **API reference** — table of available endpoints.

All heading text must be indexable so the Command Palette can fuzzy-match into specific doc sections.

### R7. AgentStep simulation must match real API shape

The `setInterval` simulation in `DashboardLayout.tsx` must be updated to emit properly typed `AgentStep` objects (see R4 type definition). The simulation should produce realistic-looking decision reasoning text for each agent so the Agent Rail's reasoning disclosure and Activity trace view have real content to display in demos. This ensures swapping to a real SSE stream is a data-source swap, not a UI rewrite.

---

## Acceptance Criteria

### Navigation
- [ ] Left sidebar renders at 232px with all 6 nav items (Overview, Desk, Signal, Activity, Settings, Docs), each with a Tabler icon
- [ ] Clicking a sidebar item switches the active content view
- [ ] Active item shows 2px left border in `var(--by-accent)` color
- [ ] TopBar no longer contains the centered 5-tab bar
- [ ] TopBar retains: logo, ⌘K pill button, avatar
- [ ] Mobile view (<900px): sidebar is hidden by default, hamburger triggers overlay

### Command Palette
- [ ] `⌘K` / `Ctrl+K` opens the palette from anywhere in the dashboard
- [ ] Typing a nav destination name fuzzy-matches and navigates on selection
- [ ] Typing a non-nav string shows `Dispatch: '{text}'` as a result
- [ ] Selecting the Dispatch result calls `runPipeline()` with the typed text
- [ ] Typing "reddit" (or similar doc section keyword) shows a result that jumps into Docs tab at that section
- [ ] Escape closes the palette

### Agent Rail
- [ ] Collapsed state renders at 56px with 5 status dots
- [ ] Each dot shows correct color per status (pending/running/done/blocked/error)
- [ ] Running status shows amber pulse animation
- [ ] Hovering a dot shows a tooltip with the agent's one-line decision
- [ ] Clicking a dot expands the rail to 280px showing that agent's thread
- [ ] Expanded state has collapse and fullscreen buttons
- [ ] `⌘+Shift+A` triggers fullscreen state
- [ ] Transitions between states animate at 200–250ms ease
- [ ] Fullscreen has an "Exit fullscreen" button that returns to expanded

### Activity Decision Trace
- [ ] Clicking a past run opens a Decision Trace detail view (not a modal)
- [ ] Detail view shows all agent steps as cards
- [ ] Each card shows decisions with correct icons (info/warning/blocked)
- [ ] "Blocked" filter pill is visible and prominent in the filter bar
- [ ] Back button returns to the activity list

### Settings
- [ ] Settings view has a sub-nav with 5 sections: Connect, Voice & Brand, Pipeline Behavior, API & Developer, Danger Zone
- [ ] Per-platform approval override table renders in Pipeline Behavior with 4 platform rows
- [ ] Danger Zone section has a thin red-tinted border
- [ ] Export all data button triggers a JSON download
- [ ] Reset pipeline button requires a confirmation modal before executing

### Docs Tab
- [ ] Docs is the 6th sidebar nav item
- [ ] In-page sub-nav has 4 sections (Quick Start, Pipeline, Playbooks, API)
- [ ] Pipeline diagram renders as inline SVG (not a `<img>` tag)
- [ ] Platform playbooks show 4 cards

### Simulation / Data Shape
- [ ] `runPipeline()` emits typed `AgentStep` objects, not plain strings
- [ ] Each simulated agent step has a `decisions` array with at least 1 item containing `label` and `detail`
- [ ] Agent Rail status dots update correctly as simulation progresses

## Follow-up — 2026-06-19T16:39:43Z

The user has requested that you deploy additional team members specifically to focus on QA and smoke testing the components as they are being built. Please scale up the team with a dedicated tester and ensure smoke tests are robust.

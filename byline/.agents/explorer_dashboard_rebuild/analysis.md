# Analysis: Byline Dashboard Rebuild

## Executive Summary
The Byline dashboard is currently a mock-up built as a 5-tab tabbed interface (`Overview`, `The Desk`, `Signal`, `Activity`, `Settings`) with a floating chat drawer, a logs drawer, and a configuration-heavy left panel (`LeftPanel`). The UI tokens and fonts are set up in `src/styles/byline-tokens.css` and `src/styles/fonts.css`, but many component styles use inline CSS or hardcoded hex colors that diverge from these tokens. The pipeline run is faked via a simple numeric `setInterval` loop in `DashboardLayout.tsx` updating indices `0` to `4` (mapping to 5 agents).

To migrate to the Byline v2 "Agent Command Center" (R1-R7), we must replace the tab bar and the left panel with a persistent **Sidebar Navigation** and an **Agent Rail** (on the right), implement a **Command Palette**, restructure **Settings** and the **Activity Tab** for deep agent observability, and write a new **Docs Tab**. The simulation loop must also be updated to emit structured `AgentStep` logs/traces.

---

## 1. Current Navigation & Routing Analysis

### How Navigation Works
- **Routing State**: Managed in `DashboardLayout.tsx` via the React state:
  ```tsx
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  ```
  `DashTab` is typed as `"overview" | "desk" | "signal" | "activity" | "settings"`.
- **Render Switching**: Handled inline via a switch-case block in `renderTab()`:
  ```tsx
  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab onPublish={handleQuickPublish} isMobile={isMobile} />;
      case "desk":     return <DeskTab isMobile={isMobile} />;
      case "signal":   return <SignalTab isMobile={isMobile} />;
      case "activity": return <ActivityTab isMobile={isMobile} />;
      case "settings": return <SettingsTab isMobile={isMobile} />;
    }
  };
  ```
- **Desktop Navigation**: Centered horizontal tab bar inside `<TopBar>`:
  - Iterates over `TABS` array and renders a flat list of `<button>`s with an active underline style `borderBottom: "2px solid #E85E2C"`.
- **Mobile Navigation**: When `isMobile` is true (window width < 900px), the `TopBar` displays the active tab label in the center and a hamburger menu icon on the left which sets `mobileMenuOpen` to `true`.
- **LeftPanel**: Functions strictly as a configuration sidebar (listing projects, active agents, platform toggles, voice strength/critic floor range inputs, and the Quick Start container), rather than standard navigation.

---

## 2. Current Simulation Loop Analysis

### How the Simulation Loop Works
- **Function**: Triggered by `runPipeline()` in `DashboardLayout.tsx` (or from `LeftPanel` via `onRun` / `ChatPanel` via `onRunMilestone`).
- **States Updated**:
  - `isRunning` (boolean): Sets to `true` to block double execution, then `false` when done.
  - `logOpen` (boolean): Toggled to `true` to automatically pop open the `RunLogPanel`.
  - `runningAgent` (number): An index from `0` to `4` (representing: 0 = Strategist, 1 = LinkedIn Writer, 2 = X Writer, 3 = Reddit Writer, 4 = Critic).
- **Simulation Code**:
  ```tsx
  let i = 0;
  const interval = setInterval(() => {
    i++;
    if (i >= 5) {
      clearInterval(interval);
      setIsRunning(false);
      setRunningAgent(0);
    } else {
      setRunningAgent(i);
    }
  }, 1800);
  ```
- **Data Types Used**: Simple integer index `runningAgent` (`0`-`4`) and boolean flags.
- **Rendering Components**:
  - `LeftPanel`: Uses `runningAgent` to calculate agent states (`"idle" | "done" | "running" | "pending"`) via a helper `getState(i)`. It animates status icons (spinners, checkmarks) based on this state.
  - `RunLogPanel`: Maps `runningAgent` to index keys in `AGENT_LOGS: Record<number, LogLine[]>` to stagger-reveal simulated log lines using a sub-`setTimeout` chain.
  - `ChatPanel`: Toggles message rendering. When `onRunMilestone` is triggered, it runs a hardcoded timeline-based message generator updating `messages` state with predefined text mockups (`RESPONSES.strategist`, etc.) and mock critic scores.
  - `StatusBar`: Displays `isRunning ? "running" : "idle"` status.

---

## 3. Styles & Design Tokens Analysis

### CSS Token Definitions
The tokens are defined in `src/styles/byline-tokens.css` inside `:root, [data-theme="dark"]`:
- `--by-bg`: `#0F0F0D` (page background)
- `--by-bg-2`: `#1A1A18` (sidebar, cards, panels)
- `--by-bg-3`: `#21262D` (inputs, hovered rows, code blocks)
- `--by-border`: `rgba(245,244,240,0.1)`
- `--by-text`: `#F5F4F0` (primary text)
- `--by-text-2`: `rgba(245,244,240,0.6)` (muted text)
- `--by-text-3`: `rgba(245,244,240,0.35)` (placeholder/timestamp)
- `--by-accent`: `#E85E2C` (orange accent)
- `--by-green`: `#3FB950` (success)
- `--by-amber`: `#F59E0B` (warning)
- `--by-red`: `#F87171` (error)

### Fonts
Configured in `src/styles/fonts.css`:
- `Space Grotesk` (logo/wordmark)
- `Inter` (body text, UI labels)
- `IBM Plex Mono` (code blocks, timestamps, terminal logs, decisions)

### Current Style Applications (Inconsistencies)
- **Hardcoded Colors**: Several components hardcode hex colors instead of referencing the CSS variables.
  - In `LeftPanel.tsx`: projects hover color uses `rgba(255,255,255,0.03)`, toggle switches use `#E85E2C` and `#fff` directly. Accent color `#E85E2C` is used explicitly in borders and inline styles.
  - In `TopBar.tsx`: macOS traffic light window dots use `#FF5F57`, `#FFBD2E`, `#28C840`, and active accent is `#E85E2C` (line 78).
  - In `OverviewTab.tsx`: KPI card strokes use `#E8593C`, `#4ADE80`, `#F59E0B`. Sparkline graphs and platform badges use hardcoded hex values.
  - In `DeskTab.tsx` and `SignalTab.tsx`: Pie/Area charts and status circles use hardcoded colors.
- **Font Divergence**: `CommandPalette.tsx` uses `'DM Mono', monospace` instead of `IBM Plex Mono` for hints and group titles.

---

## 4. Restructuring Plan

### R1. Sidebar Navigation Implementation
1. **Remove `LeftPanel.tsx`**: Retain its state hook configuration models, but move its layout and quick start parts.
2. **Create Left Sidebar (232px)**:
   - Fixed width `232px`, background `var(--by-bg-2)`, right border `0.5px solid var(--by-border)`.
   - Render 6 navigation items: `Overview`, `Desk` (labeled "The Desk" or "Desk"), `Signal`, `Activity`, `Settings`, `Docs`.
   - Active state styling: left border `2px solid var(--by-accent)`, text color `var(--by-text)`.
   - Inactive: `var(--by-text-2)`.
   - Mobile: collapsing sidebar to overlay using `mobileMenuOpen` state controlled by hamburger button.
3. **Simplify `TopBar`**:
   - Strip centered tabs.
   - Keep Logo, Project Switcher, Avatar.
   - Add a prominent, clickable keyboard shortcut pill: `⌘K` (styled in IBM Plex Mono).

### R2. Command Palette Re-engineering
1. **Update `CommandPalette.tsx`**:
   - Centered modal, max-width 560px, background `var(--by-bg-2)`, border `var(--by-border)`.
   - Replace `'DM Mono'` with `'IBM Plex Mono', monospace` for all keyboard hints and label groups.
   - Support fuzzy matching against nav destinations (Overview, Desk, Signal, Activity, Settings, Docs).
   - Support indexable headings inside the new `DocsTab.tsx` (e.g. typing "reddit" or "playbook" matches `Docs` sub-sections and routes there).
   - **Freeform Entry Fallback**: If the query doesn't match any destination, show a single row: `Dispatch: '{query}'`. Pressing enter or clicking this row calls `runPipeline(query)`, triggering the agent pipeline with the query text as raw milestone input.

### R3. Right-Side Agent Rail
1. **Rebuild `ChatPanel.tsx` as `AgentRail.tsx`**:
   - Persistent right-hand panel, animated transitions (200-250ms ease).
   - Guided by a single top-level `railState: "collapsed" | "expanded" | "fullscreen"`.
   - **Collapsed State (56px)**:
     - Vertical stack of 5 status indicators (Strategist, LinkedIn, X, Reddit, Critic).
     - Indicator size: 12px circular dots.
     - Color vocab: pending (`var(--by-text-3)` outline), running (`var(--by-amber)` pulse animation), done (`var(--by-green)` solid), blocked (`var(--by-red)` solid), error (`var(--by-red)` solid with white outline).
     - Hovering shows small tooltip in `IBM Plex Mono` showing the latest decision label (`AgentStep.decisions[-1].label`).
   - **Expanded State (280px)**:
     - Header: Agent name, status dot, collapse, and fullscreen trigger buttons.
     - Message rendering: list of messages. Under each agent's message card, render a collapsed-by-default `<details>` reasoning container showing the agent's `decisions` list in `IBM Plex Mono` with `var(--by-text-2)` text.
   - **Fullscreen State (Full screen width)**:
     - Rail takes over main layout. Puts an "Exit Fullscreen" button top right. Keyboard hotkey: `⌘+Shift+A` (or `Ctrl+Shift+A`).

### R4. Activity Tab: Decision Trace View
1. **State updates in `ActivityTab.tsx`**:
   - Track `selectedRun: AgentRun | null`.
   - Clicking any pipeline run in the list pushes the view into a full-width Decision Trace view (instead of opening a modal). Adds a prominent "← Back to Activity" button.
2. **Decision Trace Layout**:
   - Top-to-bottom chain of agent cards: Strategist → LinkedIn Writer → X Writer → Reddit Writer → Critic.
   - Card structure:
     - Header: Agent name + status badge (colored dot).
     - **Input context**: Collapsible section containing `AgentStep.input.context` as a bulleted list.
     - **Decisions trace**: Always visible list of `AgentStep.decisions`.
       - Icons: Info icon for routine, warning triangle (`var(--by-amber)`) for deviations, blocked/x icon (`var(--by-red)`) for blocked.
     - **Output**: Renders final output text/draft if done.
3. **Filter update**:
   - Add a prominent "Blocked" filter pill in the Activity list filter bar (matching other event type pills but highly visible) to isolate Critic-flagged runs.

### R5. Settings Tab Restructure
1. **Create Settings Sub-navigation**:
   - Add a left sub-nav layout inside `SettingsTab.tsx` dividing settings into 5 sections:
     - **Connect**: API keys, Composio app links, platform toggles, and live connection status.
     - **Voice & Brand**: Voice profile card, blocklist settings, and platform-specific tone overrides (new tone overrides dropdown per platform).
     - **Pipeline Behavior**: Skills list (Storyteller Mode, etc., migrated from `LeftPanel.tsx`), Critic Floor slider, Post Frequency, approval modes, and the new **per-platform approval override table** (rows for LinkedIn, X, Reddit, Threads; options: `auto-post | review required | drafts only`).
     - **API & Developer**: API keys table, webhook config, self-host stats.
     - **Danger Zone**: Thin red border (`var(--by-red)`) wrapping this section. Includes "Export all data" (triggers download of project config + voice profile + drafts as JSON) and "Reset pipeline" (with confirmation modal).

### R6. Docs Tab (New)
1. **Create `DocsTab.tsx`**:
   - Single-page layout with sticky sub-navigation linking to:
     - **Quick Start**: Command box moved from `LeftPanel.tsx`.
     - **How the Pipeline Works**: Inline SVG flow chart showing:
       `[Strategist] ─┬─> [LinkedIn Writer] ─┬─> [Critic]`
       `               ├─> [X Writer]        │`
       `               └─> [Reddit Writer]  ─┘`
       Features static status dot indicators to demonstrate colors/vocab.
     - **Platform Playbooks**: Cards detailing checks before drafts.
     - **API Reference**: Table of available endpoints.
   - All heading elements must use HTML IDs so the `CommandPalette` can match and anchor-scroll directly to them.

### R7. Simulation Data Shape Alignment
1. **Define `AgentStep` Types**:
   Ensure all simulation routines run with the strict interface type:
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
2. **Rewrite Simulation Engine**:
   - Transition from simple integer ticks to assembling and emitting realistic `AgentStep` objects in sequence.
   - Inject realistic decision chains into steps (e.g., Critic deciding to block Reddit drafts with warning flags).

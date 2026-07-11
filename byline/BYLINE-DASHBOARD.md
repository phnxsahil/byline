# Byline Dashboard — Technical Summary

> Multi-agent content engine dashboard. 12 components, CSS token system, simulated pipeline, agent chat, 5 tab views.

---

## 1. Layout Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│ TopBar (44px) — tabs, logo, log dispatch button, avatar         │
├────────┬─────────────────────────────────────────────────────────┤
│        │                                                         │
│ Left   │  Active Tab Content                                     │
│ Panel  │  (Overview | Desk | Signal | Activity | Settings)       │
│ (248px)│                                                         │
│        │                                                         │
├────────┴─────────────────────────────────────────────────────────┤
│ StatusBar (28px) — connection, latency, chat/log toggles, ⌘K    │
└──────────────────────────────────────────────────────────────────┘

Overlays (fixed position):
  ┌────────────────────────────────┐
  │ RunLogPanel                    │
  │ (bottom: 28, left: 248,       │
  │  height: 340px)                │
  └────────────────────────────────┘

  ┌──────────────────────┐
  │ ChatPanel (400px)    │
  │ (right sidebar,      │
  │  top: 44, bottom: 28)│
  └──────────────────────┘
```

### Layout Structure (`DashboardLayout.tsx`)
- Root: `height: 100vh`, `flex column`, background `var(--by-bg)`
- **TopBar**: sticky, 44px, macOS traffic lights (desktop) / hamburger (mobile)
- **LeftPanel**: 248px sidebar, hidden on mobile (<900px)
- **Tab content**: flex: 1, switches via `activeTab` state
- **StatusBar**: 28px bottom strip, always visible
- **RunLogPanel**: fixed overlay, toggled via StatusBar "logs" button or pipeline run
- **ChatPanel**: fixed right overlay (400px), toggled via StatusBar "chat" button

### Tab Routing
```tsx
type DashTab = "overview" | "desk" | "signal" | "activity" | "settings";
```

| Tab | Component | Purpose |
|-----|-----------|---------|
| Overview | `OverviewTab.tsx` | KPIs, charts, recent bylines, new byline input |
| The Desk | `DeskTab.tsx` | Platform draft editor, critic score panel, stage workflow |
| Signal | `SignalTab.tsx` | Analytics, engagement charts, platform breakdown, signal feed |
| Activity | `ActivityTab.tsx` | Filterable event stream with expandable details |
| Settings | `SettingsTab.tsx` | Provider keys, Composio, API keys, blocklist, approval, voice, self-host |

---

## 2. Component-by-Component Breakdown

### 2.1 TopBar.tsx
- **Height**: 44px, `position: sticky, top: 0, zIndex: 50`
- **Desktop**: macOS traffic light dots (red/yellow/green), logo "byline\_", self-hosted badge, centered tab bar with orange underline active state, terminal/log toggle, "log dispatch" amber button, boring-avatars avatar
- **Mobile**: hamburger menu, logo, active tab label, compact "Run" button
- **Tab bar**: 5 tabs centered via `position: absolute; left: 50%; transform: translateX(-50%)`
- Active tab: 2px orange bottom border (`#E85E2C`)
- Imports: `IconBolt`, `IconTerminal2`, `IconMenu2` from tabler, `Avatar` from boring-avatars

### 2.2 LeftPanel.tsx
- **Width**: 248px, `height: 100%`, `overflow-y: auto`, background `var(--by-bg-2)`
- **Sections** (collapsible):
  - **PROJECTS**: 2 default projects (fltrd.tech, byline) with boring-avatars, active selection, stack metadata card
  - **AGENT PIPELINE**: 5-node visual flow (Strategist → LinkedIn Writer → X Writer → Reddit Writer → Critic) with per-node click-to-expand detail (completion time, token usage), run button
  - **AGENT CONFIG**: Platform toggles (LinkedIn/X/Reddit/Threads), Voice Strength slider (1-10), Critic Floor slider (1-10), Post Frequency segmented control (low/medium/high with orange active)
  - **AGENT SKILLS**: 5 toggleable skills (Storyteller Mode, Thread Architect, Reddit Stealth, Ghost Mode, Velocity Mode)
  - **QUICK START**: Code block with 3-step self-host instructions + copy button
- Pipeline visual: vertical line connector, numbered circles that transition through pending → running (spinning border) → done (green checkmark)

### 2.3 OverviewTab.tsx
- **SetupChecklist**: 5-step progress tracker (Add project → Train voice → Connect platform → Log milestone → Approve & ship). Circular check icons, orange progress bar, dismissable on complete.
- **KPI cards** (4): Total Posts, Total Reach, Voice Score, Avg Score — each with sparkline (`recharts AreaChart`)
- **Charts** (2): Posts/Week bar chart + Voice Score Trend area chart
- **Recent Bylines**: Scrollable table (`maxHeight: 280`, `overflowY: auto`) with platform icons, preview, status badges, score, date
- **New Byline Input**: Text area + photo upload button + microphone button + publish button with amber accent

### 2.4 DeskTab.tsx
- **Layout**: Side panel (platform selector + critic score) + main panel (draft content + editor)
- **Platform selector**: LinkedIn/X/Reddit/Threads with platform-colored badges
- **Draft editor**: Content area with edit mode toggle, image upload (photo button, multiple files)
- **Critic score panel**: Overall score display, sparkline, 4 breakdown metrics (clarity/voice_match/hook_strength/platform_fit) with progress bars, flags list, AI slop detection indicator
- **Stage workflow**: `ideate → draft → review → post` with numbered steps and active state

### 2.5 SignalTab.tsx
- **KPI cards** (4): Total Reach, Total Engagement, Avg CTR, Active Signals — same sparkline pattern
- **Engagement chart**: Area chart over time
- **Platform breakdown**: Table with platform icon, posts, reach, engagement, CTR columns
- **Audience mix**: Donut/pie chart showing audience distribution
- **Signal feed**: Filterable list (GitHub/Voice/Manual) with timestamps and preview text

### 2.6 ActivityTab.tsx
- **Filter pills**: 8 event type filters (all, dispatch, milestone, draft, review, post, connect, system) with glow animation on active hover
- **Searchable event stream**: Expandable rows showing detail per event
- **Event items**: boring-avatars per project, timestamps, type badges with platform colors, expand/collapse chevron

### 2.7 SettingsTab.tsx
- **Provider keys**: Anthropic + OpenAI + Composio API key inputs with show/hide toggle (eye icon)
- **Composio section**: Status indicator (connected), 5 integrated apps (LinkedIn/X/GitHub/Reddit/Linear) with tool names, pip + npx setup code blocks with copy buttons
- **Byline API keys**: Table of generated keys with copy/delete, "Generate new key" button
- **Platform outlets**: Per-platform toggle cards with connection status
- **Phrase blocklist**: Textarea for banned phrases
- **Approval modes**: Segmented control (auto-post / review required / drafts only)
- **Post frequency**: Slider
- **Voice profile**: Last trained timestamp, retrain button
- **Self-host info**: Version, uptime, Docker status

### 2.8 RunLogPanel.tsx
- **Position**: `fixed, bottom: 28, left: 248, right: 0, height: 340px`, z-index 45
- **Background**: `#0E0D0B` (darker than main bg for terminal feel)
- **Header**: Status dot (amber when running, green when done), "PIPELINE RUN LOG" label, timing metadata, agent completion counter, close button
- **Simulated log streaming**: 5 agent groups, each with 5-7 log lines, streamed at ~120-200ms intervals per line
- **Log line format**: `[TIME] [LEVEL] [TEXT]` with color-coded prefixes (INFO/DEBG/WARN/DONE)
- **Collapsible per-agent**: Click agent header to expand/collapse
- **Empty state**: CPU icon + "No runs yet" message

### 2.9 ChatPanel.tsx
- **Position**: `fixed, top: 44, right: 0, bottom: 28, width: 400px`, z-index 60
- **Header**: Robot icon, "AGENT CHAT" label, writing... indicator, close button
- **Message flow**: User types milestone → simulated 5-agent sequential response (Strategist → LinkedIn Writer → X Writer → Reddit Writer → Critic) with 600-900ms delays
- **Message types**: User (right-aligned, amber-tinted bg), Agent (left-aligned, dark bg), status indicators (pulsing amber dot for running, green check for done, amber warning for flagged)
- **Quick actions**: Navigation hint buttons (overview/the desk/signal/activity/settings) that call `onNavigate` → switches active tab
- **Input area**: Photo attachment (FileReader data URL), textarea with Enter-to-send, amber send button (lightning bolt icon)
- **Image support**: Multiple image upload, thumbnail strip with remove button, images shown in message bubbles
- **Color tokens**: Uses `var(--by-accent)`, `var(--by-green)`, `var(--by-amber)`, `var(--by-red)` — all CSS custom properties

### 2.10 StatusBar.tsx
- **Height**: 28px, background `rgba(0,0,0,0.2)`
- **Left side**: Green dot + "connected", latency (186ms), last run (6m ago), status (running/idle)
- **Right side**: Version (v0.1.0), chat toggle, logs toggle, ⌘K hint
- Chat/log buttons: orange when active (`#E85E2C`), muted when inactive

### 2.11 SetupChecklist.tsx
- 5-step progress tracker with circular check icons
- Orange progress bar, dismisses on completion
- Used inside OverviewTab

---

## 3. CSS Token System

### 3.1 `byline-tokens.css` — Dashboard Tokens

```css
/* Backgrounds */
--by-bg:    #0F0F0D;  /* page background */
--by-bg-2:  #1A1A18;  /* sidebar, cards, panels */
--by-bg-3:  #21262D;  /* inputs, hovered rows, code blocks */

/* Borders */
--by-border:  rgba(245,244,240,0.1);  /* all borders, dividers */

/* Text */
--by-text:   #F5F4F0;    /* primary text */
--by-text-2: rgba(...0.6); /* muted labels */
--by-text-3: rgba(...0.35); /* timestamps, placeholders */

/* Semantic */
--by-accent: #E85E2C;  /* buttons, active states, accent */
--by-green:  #3FB950;  /* success, done indicators */
--by-amber:  #F59E0B;  /* warnings, flags */
--by-red:    #F87171;  /* errors, danger */
```

### 3.2 Token Usage Pattern
- All dashboard components use `var(--by-*)` tokens — NOT the landing page `var(--bg)` / `var(--surface)` / `var(--text-primary)` tokens
- The dashboard tokens are **aligned** with the landing page dark mode values (same `#0F0F0D` bg, same warm white text)
- Accent color `#E85E2C` is hardcoded in ~30+ places across components (toggle backgrounds, tab borders, buttons, status indicators, progress bars) — should ideally use `var(--by-accent)` for consistency

---

## 4. Pipeline Simulation

The pipeline is **simulated** client-side (no real API calls). Flow:

```
OverviewTab "publish" / ChatPanel "send"
  → DashboardLayout.runPipeline()
    → setInterval every 1800ms, increments runningAgent 0-4
      → LeftPanel shows agent state (pending → running → done)
      → RunLogPanel streams ~5-7 log lines per agent
      → ChatPanel shows agent responses
```

### Agent timing:
| Agent | Duration | Lines |
|-------|----------|-------|
| Strategist | ~1.8s | 6 lines |
| LinkedIn Writer | ~1.8s | 6 lines |
| X Writer | ~1.8s | 6 lines |
| Reddit Writer | ~1.8s | 6 lines |
| Critic | ~1.8s | 7 lines |
| **Total** | **~9s** | **31 lines** |

---

## 5. Chat System

- **State**: `messages: Message[]` with `role, agent, text, images, status, score, time, quickActions`
- **Simulated responses**: 5 hardcoded agent response strings (one per agent type)
- **Sending threshold**: 900ms intervals between agents, total ~5s for full response
- **Image handling**: FileReader → data URL → stored in message state → displayed in chat
- **Status indicators**: pulsing amber dot (→ running) → green checkmark (→ done), per agent
- **Quick actions**: `onNavigate` callback switches `DashboardLayout.activeTab` — wired for 5 dashboard tabs

---

## 6. Mobile Responsiveness

- **Breakpoint**: 900px
- **Desktop**: Full layout (TopBar + LeftPanel + tab content + StatusBar)
- **Mobile**: Hamburger menu replaces traffic lights + centered tabs, LeftPanel hidden, compact "Run" button, full-width tab content
- **TopBar**: On mobile, shows hamburger left + active tab label center + compact right actions
- **LeftPanel**: Not rendered on mobile; mobile menu overlay covers when hamburger is clicked
- **Tab content**: Each tab receives `isMobile` prop and can adjust internally

---

## 7. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State management | `useState` in `DashboardLayout` | No external state lib needed at this scale |
| Pipeline | Client-side `setInterval` simulation | Phase 0 — real LangGraph pipeline in Phase 1 |
| Chat | Inline simulation with hardcoded responses | Replace with real API + SSE streaming in Phase 1 |
| Routing | URL hash (`#dashboard`) | Zero external dependencies, single-page app |
| CSS | CSS custom properties (`var(--by-*)`) | Consistent with AGENTS.md design tokens |
| Fonts | Inter (body) + IBM Plex Mono (code/mono) + Space Grotesk (logo) | Per AGENTS.md font spec |
| Icons | @tabler/icons-react | Already in dependency tree |
| Charts | recharts (AreaChart, BarChart, PieChart) | Lightweight, React-native |
| Avatars | boring-avatars | Deterministic, no image upload needed |

---

## 8. Current Limitations & Next Steps

### Known Issues
1. **Real pipeline**: Agent responses are hardcoded — no actual LangGraph/Claude API calls
2. **No SSE**: Pipeline simulation uses `setInterval` instead of real SSE streaming
3. **Image upload**: FileReader data URLs only — no server upload endpoint
4. **Provider keys**: Settings inputs are visual-only — no backend configuration
5. **Posting**: Approval buttons are visual — no Composio API integration

### Phase 1 Goals
- [ ] Wire ChatPanel to real `/dispatch` POST endpoint
- [ ] Connect RunLogPanel to SSE stream (`GET /dispatch/{id}/stream`)
- [ ] Make agent pipeline animate from real data instead of `setInterval`
- [ ] Replace hardcoded `#E85E2C` with `var(--by-accent)` across all components
- [ ] Add `--by-accent` as CSS custom property in `byline-tokens.css`

---

*Generated from codebase — June 2026*

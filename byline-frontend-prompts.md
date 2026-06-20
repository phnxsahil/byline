# Byline v2 — Frontend Prompts

Use these verbatim (or near-verbatim) when prompting opencode/Claude/whatever
agent is doing the actual frontend work. The point of writing them this
precisely is to stop visual drift across sessions — every prompt re-states
the token system and the one signature element so nothing quietly reverts
to a generic dark-dashboard default partway through the rebuild.

Paste **Prompt 0** into every new session before any other prompt, even if
you think the agent "already knows" the design system. It doesn't carry
context across sessions and will reach for defaults the moment it's unsure.

---

## Prompt 0 — Design system anchor (paste first, every session)

```
You're working on Byline, a self-hosted multi-agent content pipeline
dashboard. Before writing any UI code, internalize this design system —
do not deviate from it or "improve" it with a different palette/font
unless I explicitly ask.

TOKENS (already defined in byline-tokens.css, use var(--by-*) everywhere,
never hardcode hex values in component files):

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

FONTS: Inter (body), IBM Plex Mono (code, timestamps, logs, anything
terminal-feeling), Space Grotesk (logo/wordmark only).

AESTHETIC: warm-dark "mountain journal / field log" feel — like a climbing
expedition's logbook crossed with a terminal. Not a generic SaaS dark mode.
Signals of this done right: monospace timestamps everywhere logs appear,
slightly desaturated warm dark backgrounds (not pure black/blue-black),
amber-orange as the only saturated color in the whole UI, sharp small
corner-radii (4-6px, not pill-shaped, not 0 either), and a general feeling
of "instrument panel" rather than "marketing dashboard."

DO NOT: introduce a second accent color, switch to a cream/light theme,
add gradients, add glassmorphism/blur effects, use rounded pill buttons,
or default to a generic blue/purple AI-tool palette. Those are the
defaults you'd reach for unprompted — actively resist them here.

THE SIGNATURE ELEMENT: the Agent Rail — a vertical strip of status dots
representing live agents (Strategist, LinkedIn Writer, X Writer, Reddit
Writer, Critic), each pulsing amber when running, solid green when done,
solid red when blocked. This is the one element that should feel
distinctive and alive; everything else in the UI should be quiet and
disciplined around it. When in doubt about where to spend visual energy,
spend it there, not elsewhere.

Confirm you've internalized this before I give you the next task.
```

---

## Prompt 1 — Sidebar nav + command palette shell

```
Replace the current 5-tab TopBar navigation with:

1. A persistent left sidebar (232px, var(--by-bg-2) background, right
   border var(--by-border)) containing nav items: Overview, Desk, Signal,
   Activity, Settings, Docs. Each item: icon (tabler icons, already in
   deps) + label, active state = var(--by-accent) left border (2px) +
   var(--by-text) color, inactive = var(--by-text-2).

2. A command palette triggered by Cmd+K (Ctrl+K on non-Mac), modal overlay,
   centered, max-width 560px, var(--by-bg-2) background, var(--by-border)
   border, IBM Plex Mono for any keyboard hints shown.
   - Behavior: fuzzy-matches against nav destinations AND a freeform input
     mode. If what's typed doesn't match a known destination, show a
     single result row "Dispatch: '{typed text}'" — selecting it should
     call the same dispatch function the chat panel uses (don't write a
     second dispatch path, reuse the existing one).
   - This palette is the dispatch entry point, not just navigation — that
     distinction matters, don't simplify it down to pure nav-only.

3. Keep TopBar but shrink its job to: logo, project switcher dropdown, a
   visible "⌘K" pill button (not just a tooltip — the affordance should be
   visible without hovering), avatar.

Mobile (<900px): sidebar collapses to a hamburger-triggered overlay, same
as current TopBar mobile behavior — preserve that pattern, don't redesign
mobile separately.

Build this as DashboardLayout.tsx changes + a new CommandPalette.tsx. Don't
touch tab content components yet.
```

---

## Prompt 2 — Agent Rail (collapsed / expanded / fullscreen)

```
Build the Agent Rail to replace the current floating ChatPanel overlay.
Three states, same component, controlled by a single `railState` prop:
"collapsed" | "expanded" | "fullscreen".

COLLAPSED (default, 56px wide, right side, var(--by-bg-2) background,
left border var(--by-border)):
- 5 status dots stacked vertically, one per agent (strategist, linkedin,
  x, reddit, critic), 12px circles.
- Status → color: pending = var(--by-text-3) outline only, running =
  var(--by-amber) with a pulse animation (opacity 0.4-1.0, 1.2s loop),
  done = solid var(--by-green), blocked = solid var(--by-red), error =
  solid var(--by-red) with a thin white outline to distinguish from blocked.
- Hover a dot → tooltip showing the agent's current one-line decision
  summary (from AgentStep.decisions[-1].label), IBM Plex Mono, small.
- Click a dot → transitions to "expanded" and opens that agent's thread.

EXPANDED (280px wide, same position):
- Full chat thread, reusing existing ChatPanel message rendering, but the
  data source is now AgentStep objects (see ARCHITECTURE.md once written —
  for now, accept the existing Message[] shape and adapt incrementally).
- Header: agent name + status dot (same colors as collapsed), collapse
  button (back to 56px), fullscreen button.
- Below each agent message: a collapsed-by-default "Reasoning" disclosure
  showing the decisions array as a short bulleted list, IBM Plex Mono,
  var(--by-text-2).

FULLSCREEN (triggered by Cmd+Shift+A or the fullscreen button):
- Rail expands to cover the main content area entirely (not just grow
  wider — actually take over the layout, with a visible "Exit fullscreen"
  affordance, top right).
- Same content as expanded, just more breathing room — don't redesign the
  message layout for this state, just give it more width.

Transition between states should animate (width/position), not snap —
200-250ms ease, nothing bouncy.

This replaces ChatPanel.tsx's role. Keep RunLogPanel separate for now —
don't merge them yet, that's a later pass.
```

---

## Prompt 3 — Activity tab → decision trace view

```
Add a "Decision Trace" detail view to ActivityTab, opened by clicking any
past pipeline run in the event stream.

Layout: full-width panel (not a modal — push into the same content area,
with a clear "back to activity" affordation) showing the run's AgentStep
chain top to bottom: Strategist → LinkedIn Writer → X Writer → Reddit
Writer → Critic.

Each step renders as a card (var(--by-bg-2) background):
- Header: agent name, status badge (reuse the dot+color system from the
  Agent Rail — same colors, same meaning, don't invent a new status
  vocabulary here).
- "What it received" — collapsed by default, shows AgentStep.input.context
  as a bulleted list.
- "What it decided" — always visible, shows AgentStep.decisions as a list,
  each with a small icon: info icon for routine decisions, warning-triangle
  (var(--by-amber)) for anything that altered the default path, blocked
  icon (var(--by-red)) for blocked-status steps specifically.
- "Output" — the actual draft text if status is done, or nothing if
  blocked (don't show a draft for a step that got blocked before
  producing one).

Add a filter pill specifically for "Blocked" alongside the existing 8
event-type filters, so blocked-Critic runs are easy to find on their own —
this is the single most important filter in the whole tab, make sure it's
not visually buried among the other 8.
```

---

## Prompt 4 — Settings restructure

```
Restructure SettingsTab.tsx from its current flat list into 5 grouped
sections, each with its own left-nav within the Settings view (sub-nav,
not a new top-level page): Connect, Voice & Brand, Pipeline Behavior,
API & Developer, Danger Zone.

Move existing components into these groups without rewriting their
internals yet:
- Connect: provider keys, Composio section, platform outlet toggles
- Voice & Brand: voice profile + retrain, phrase blocklist
- Pipeline Behavior: agent skills toggles (moved from LeftPanel — remove
  them from LeftPanel once moved here), Critic Floor slider, Post
  Frequency, approval modes
- API & Developer: Byline API keys table, self-host info
- Danger Zone: add two new actions — "Export all data" (button, triggers
  a JSON download of project context + voice profile + past drafts) and
  "Reset pipeline" (button, confirmation modal required, var(--by-red)
  styling)

New feature to add in Pipeline Behavior: per-platform approval overrides.
A small table: platform name | approval mode dropdown (auto-post / review
required / drafts only), one row per platform (LinkedIn/X/Reddit/Threads),
defaulting to whatever the global approval mode currently is, but
independently overridable. This is a real feature, not cosmetic — wire it
to actually override the global setting per-platform in whatever state
shape currently holds approvalMode.

Danger Zone styling: var(--by-red) for the section header and any
destructive button, but keep it restrained — a thin red-tinted border
around the section is enough, don't make the whole section red.
```

---

## Prompt 5 — Docs tab (new)

```
Build a new DocsTab.tsx, added as a 6th sidebar nav item.

Sections (single-page scroll with a sticky in-page sub-nav, not separate
routes):
1. "Quick start" — the existing 3-step self-host code block, moved here
   from LeftPanel's QUICK START section (remove it from LeftPanel after
   moving).
2. "How the pipeline works" — a diagram (build as an inline SVG component,
   not an image) showing Strategist → 3 parallel Writers → Critic, with a
   short plain-language caption under each node explaining what that agent
   optimizes for. Reuse the Agent Rail's dot/color vocabulary for each
   node's visual state indicator (even though this is static/illustrative,
   not live).
3. "Platform playbooks" — 4 cards (LinkedIn/X/Reddit/Threads), each with 2-3
   bullet points on what Byline checks for on that platform before drafting
   (e.g., Reddit: self-promo pattern check against subreddit norms; X:
   compression into thread-friendly chunks above a voice-strength
   threshold). Write this copy from the end user's perspective — what the
   system does for them, not how it's implemented internally.
4. "API reference" — table of available endpoints, even if just documenting
   what exists today (can be sparse, expand later).

Index all heading text so the Cmd+K command palette can fuzzy-match into
specific doc sections, not just the top-level "Docs" nav item — e.g.
typing "reddit" in the palette should be able to jump straight to the
Reddit playbook card.

Visual treatment: this should feel like documentation, not marketing —
generous line-height, var(--by-text) at slightly reduced size for body
copy, IBM Plex Mono for any inline code/endpoint references, no decorative
elements beyond the one diagram in section 2.
```

---

## Prompt 6 — First-run / empty state pass

```
Add a first-run experience triggered when no project exists yet (check
existing project state — if projects array is empty).

Overview tab, when empty:
- Replace the current 4 zeroed KPI cards + empty recent-bylines table with
  a single centered panel: short headline ("Watch the pipeline run"), one
  sentence of explanation, and one button: "Run a sample pipeline."
- Clicking it should: seed one demo project (use placeholder content —
  name it something obviously fake like "Demo Project," don't pretend it's
  real), then immediately trigger runPipeline() against that demo project,
  and switch railState to "expanded" so the Agent Rail is visible the
  moment the run starts.
- After the first real (non-demo) project is added, revert Overview to its
  normal KPI-card layout permanently — this empty state should only ever
  be seen once.

SetupChecklist component: reorder its steps so "Run a sample pipeline" is
step 1, ahead of "Add a project" — watching the pipeline run is what
should hook someone, not configuration.

Keep all empty-state copy in the interface's voice: state what's missing
and what action resolves it, no apologetic tone, no exclamation marks.
```

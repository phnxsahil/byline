# Byline v2 — Agentic Dashboard Spec

> Reframe: Byline stops being "a Buffer clone with AI." It becomes an **agent
> command center** for a content pipeline — the social posting is the domain,
> the orchestration/observability/memory is the actual product. That's the
> resume story.

---

## 0. Why the reframe matters

Looked at what's already shipping in 2026:

- Postiz now ships an AI assistant for captions/images, but it's still
  fundamentally write-once → preview-per-channel → schedule. No persistent
  memory of *you* or *your projects* across sessions.
- Typefully is the same shape: great editor, AI tone assist, still no agent
  layer with visible state.
- The agent-tooling world (Cursor 3, Cursor's "Agents Window") has moved to a
  specific pattern: **you are a dispatcher, not a prompter.** Multiple agents
  run, you watch a sidebar of live status, you intervene when needed, the
  system doesn't pretend it's one continuous chat.
- Dashboard convention has converged hard on **sidebar nav + command palette**,
  not tab bars — tab bars break down past ~10 destinations, which Byline is
  already near (5 tabs + settings sub-sections + chat + logs).

Nobody in the social-tools space has built the "dispatcher" pattern. That's
the wedge. Byline's pitch becomes: *a transparent multi-agent system you can
watch think, interrupt, and learn from — applied to build-in-public posting.*

This is also just a better resume line:
> "Designed and built a multi-agent orchestration dashboard with real-time
> agent state visualization, conversational command interface, and a
> persistent project-memory layer — applied to automated content generation
> across 4 social platforms."
vs.
> "Built a tool that posts to social media."

---

## 1. Navigation — replace the 5-tab bar

### The problem with the current layout
5 top tabs + a 248px sidebar with 5 collapsible sections + a separate chat
overlay + a separate log overlay = 4 different places state can live, and no
single source of truth for "what is happening right now." This is the exact
failure mode dashboard design calls out: users end up asking "where do I go
to see X."

### New structure: **Sidebar nav + Command Palette + Agent Rail**

```
┌──────────────────────────────────────────────────────────────────┐
│ TopBar — logo, project switcher, search/⌘K trigger, avatar      │
├────────┬──────────────────────────────────────┬──────────────────┤
│        │                                      │                  │
│ Side   │  Active View                         │  Agent Rail      │
│ Nav    │  (Overview/Desk/Signal/Activity/      │  (always-on,     │
│ 232px  │   Settings/Docs)                      │   collapsible)   │
│        │                                      │  280px           │
│        │                                      │                  │
├────────┴──────────────────────────────────────┴──────────────────┤
│ StatusBar — connection, ⌘K hint, agent run summary                │
└──────────────────────────────────────────────────────────────────┘
```

**Key change:** the chat panel is no longer an overlay you toggle on/off — it
collapses into an **Agent Rail** that's always present in some form:

- **Collapsed state** (default, 56px): vertical strip showing live agent
  status dots (Strategist/LinkedIn/X/Reddit/Critic), like Cursor's Agents
  Window strip. Click any dot → expands that agent's thread inline.
- **Expanded state** (280px): full chat, same content as today's ChatPanel,
  but now it's a *first-class panel*, not a floating overlay competing with
  RunLogPanel for the same screen real estate.
- **Full-screen state** (⌘+Shift+A or a button): chat takes over the main
  content area entirely — for when you're doing a long dispatch session and
  want max width, à la Cursor's Agent Tabs.

This solves the actual UX bug in the current build: ChatPanel and
RunLogPanel both fight for the right/bottom of the screen and can't be open
usefully at the same time on anything under a 16" display.

### Command palette (⌘K) — the actual nerve center
This is the highest-leverage thing to add. It does three jobs at once:

1. **Navigation** — type "settings", "desk", "activity" → jump there.
2. **Action dispatch** — type a milestone directly into the palette
   (`> shipped dark mode for fltrd.tech`) and hit enter → it routes straight
   into the pipeline, same as typing into ChatPanel. No need to find the chat
   panel first.
3. **Search** — fuzzy search across past bylines, log lines, and settings.
   ("Where did I turn off Reddit auto-post?" → palette finds it.)

This single decision — make ⌘K the dispatch entry point, not just a nav
shortcut — is what makes the tool feel "agentic" rather than "a dashboard
with a chatbot bolted on." It mirrors the pattern where the palette **forwards
anything that isn't a known destination straight to the assistant**, so
typing never dead-ends.

### Tabs → renamed and re-scoped

| Old tab | New view | Change |
|---|---|---|
| Overview | **Overview** | unchanged purpose, but KPI cards now link to Activity filtered by metric |
| The Desk | **Desk** | unchanged, becomes the canvas the Agent Rail writes into live |
| Signal | **Signal** | unchanged |
| Activity | **Activity** | becomes the audit log / observability surface (see §3) |
| Settings | **Settings** | restructured, see §4 |
| *(new)* | **Docs** | in-app documentation, see §5 |

---

## 2. The Agent Rail — making "agentic" actually mean something

Right now the multi-agent system is cosmetic: a `setInterval` that fakes
progress and 5 hardcoded response strings. To make this resume-defensible
(and to make the dashboard interesting to build), the agent layer needs
real, inspectable state — even before Phase 1 wires up a real LLM backend.

### State model (build this now, even in simulation)
Every agent run produces a structured trace, not just log lines:

```ts
type AgentStep = {
  agentId: "strategist" | "linkedin" | "x" | "reddit" | "critic";
  startedAt: number;
  finishedAt?: number;
  status: "pending" | "running" | "done" | "blocked" | "error";
  input: { context: string[]; instructions: string };   // what it was given
  output?: { draft?: string; reasoning?: string; score?: number };
  decisions: { label: string; detail: string }[];        // see below
};
```

The `decisions` array is the actual differentiator. This is "agent
observability" — instead of a log line that says `[INFO] generating draft`,
each agent step records *why* it did what it did:

- Strategist: "Chose LinkedIn + X only this run — Reddit skipped because no
  subreddit fit found for this topic (see Critic notes)."
- Critic: "Blocked Reddit draft — phrase 'check out my new app' matches
  self-promo blocklist pattern, would likely get removed by r/SideProject
  automod."
- LinkedIn Writer: "Used storytelling structure because Voice Strength is
  set to 8/10 and last 3 LinkedIn posts used the same arc successfully."

This is genuinely useful (it's the actual feature gap — see §6) and it's
also the thing you'd screen-record for a portfolio demo, because watching an
agent explain a *blocked* action is much more interesting than watching it
succeed.

### Agent Rail UI behavior
- Collapsed strip shows 5 dots with current status (pending/running/done/
  blocked/error — error and blocked get distinct colors, not just amber).
- Hovering a dot shows a tooltip with the one-line decision summary.
- Clicking expands a per-agent thread showing: input context it received →
  reasoning trace → output → score (if Critic).
- A "blocked" status is a first-class outcome, not a failure state — this is
  important, it's what proves the Critic actually does something instead of
  rubber-stamping everything.

---

## 3. Activity tab → Observability surface

Right now Activity is a filtered event list. Reframe it as the place that
answers "why did the system do what it did," which is the actual unmet need
in this market (see §6, bottleneck #1).

Additions:
- **Decision trace view**: click any past run → see the full Strategist →
  Writer → Critic chain for that run, with the `decisions` data from §2.
  This is effectively a lightweight version of what LLM observability tools
  (LangSmith, Helicone) do, scoped to this one pipeline.
- **Diff view for edited drafts**: when you hand-edit an agent's draft before
  posting, store both versions. Over time this becomes training signal
  ("the agent's first drafts are diverging less from my edits over time") —
  good portfolio metric, also genuinely useful.
- **Blocked-action log**: a dedicated filter for everything the Critic
  stopped, with reason. This is your "the system has judgment" proof.

---

## 4. Settings — restructure around mental model, not feature list

Current Settings is a flat list of 8 unrelated sections. Group by what the
user is actually trying to do:

### 4.1 Connect
- Provider keys (Anthropic/OpenAI)
- Composio + per-app connections (LinkedIn/X/GitHub/Reddit/Linear)
- Platform outlets with live connection status

### 4.2 Voice & Brand
- Voice profile (last trained, retrain button) — promote this out of being
  buried; it's core to why drafts don't sound generic
- Phrase blocklist
- Per-platform tone overrides (new: "On Reddit, drop all emoji and headline
  case" type rules — platform-specific voice, not just one global voice)

### 4.3 Pipeline Behavior
- Agent skills toggles (Storyteller Mode, etc. — moved from LeftPanel, this
  is config, not navigation)
- Critic Floor slider, Post Frequency
- Approval modes (auto-post / review required / drafts only)
- **New: per-platform approval overrides** — e.g. "auto-post to X, always
  require review for Reddit" — because Reddit risk (ban/shadowban) and
  LinkedIn risk (professional reputation) are not the same risk, and forcing
  one global approval mode is a real gap in every competitor tool.

### 4.4 API & Developer
- Byline API keys table
- Webhook config (new — lets the dashboard itself be dispatched into from
  GitHub Actions / CI, closing the loop on "GitHub commit → auto-draft")
- Self-host info (version, uptime, Docker status)

### 4.5 Danger Zone
- Export all data (new — given this stores your voice/writing, exportability
  matters and is a trust signal worth having even in a demo)
- Reset pipeline / clear memory

---

## 5. Docs — in-app documentation tab

This is new and worth having for two reasons: it's a real feature gap
(every tool in this space dumps you into a generic help center, none explain
*why* the agent did something), and it's an easy way to show product
thinking on a resume project — docs-as-feature, not docs-as-afterthought.

Structure:
- **Quick start** — same 3-step self-host snippet, promoted from LeftPanel
- **How the pipeline works** — a real diagram (Strategist → Writers → Critic)
  with plain-language explanation of what each agent is actually optimizing
  for. This doubles as the explainer that makes the Agent Rail's decision
  traces make sense to a new user.
- **Platform playbooks** — per-platform: what Byline encodes about that
  platform's norms (this is content, not code — e.g. "Reddit: we check
  against r/SideProject and r/webdev self-promo patterns before drafting,"
  "X: we compress to thread-friendly chunks if Voice Strength > 6")
- **API reference** — for the API keys section in Settings
- Searchable via ⌘K (palette indexes doc content too)

---

## 6. Market bottlenecks worth actually solving

Verified against current tools (Postiz, Typefully, Buffer) — these are the
gaps that are real, not just narratively convenient:

1. **No agent observability.** Confirmed — none of Postiz/Typefully/Buffer
   expose *why* a draft looks the way it does. They're black boxes that
   output text. → Solved by §2/§3.

2. **No platform-risk-aware approval policy.** Every tool treats all
   platforms as equally safe to auto-post to. Reddit self-promo bans are a
   categorically different risk than a mediocre LinkedIn post. → Solved by
   §4.3 per-platform approval overrides.

3. **No cross-project synthesis.** If you've shipped 4 projects with a
   shared technical theme (e.g., RAG pipelines across fltrd.tech and
   another project), no tool notices that pattern and proposes a
   thought-leadership post instead of a project update. This is a real
   differentiator and is buildable on top of the existing project-context
   store — worth a v1.1 feature, not core v2 scope.

4. **No engagement feedback loop into drafting.** Tools show you analytics;
   none feed "this performed well" back into how future drafts are written.
   Even a simple heuristic (favor sentence patterns from your top-quartile
   posts) beats nothing. Good Phase 1 feature once real posting exists.

5. **No prompt/context transparency.** Power users can't see what's actually
   sent to the model. The decision trace in §2 covers most of this; a
   "view raw prompt" toggle for power users is a cheap addition on top.

Don't try to build all 5 at once — #1 and #2 are the ones to actually ship
for v2, since they're what the dashboard redesign is already built around.
#3–5 are good "Phase 1.1 / roadmap" bullet points to list in Docs or a
README, which itself is good resume signal (shows you know the next moves
without needing to have shipped them all).

---

## 7. What NOT to add (scope control)

Given you said complexity is fine — a few guardrails so "complex" doesn't
become "unfinished":

- Don't build real OAuth posting to all 4 platforms before the agent
  observability layer is solid. A dashboard that fakes posting but has a
  genuinely good agent trace is a better demo than one that posts for real
  but the agent layer is still a black box.
- Don't build the cross-project synthesis agent (#3 above) until the core
  3-agent (Strategist/Writer/Critic) trace is real — it's a second-order
  feature on top of a working primitive, not a replacement for one.
- Keep the simulation (`setInterval`) for now, but make its *output shape*
  identical to what the real Phase 1 SSE stream will emit (`AgentStep`
  objects, not strings). That way swapping simulation for real API calls
  later is a data-source change, not a UI rewrite — also a good thing to
  mention in a writeup ("designed the simulation layer to be a drop-in
  replacement target for the real pipeline").

---

## 8. Build order

1. Sidebar nav + ⌘K palette shell (biggest visual/UX change, do first)
2. Agent Rail collapsed/expanded/fullscreen states, wired to existing
   simulated pipeline but emitting `AgentStep` objects
3. Activity → decision trace view, using the same `AgentStep` data
4. Settings restructure (4.1–4.5)
5. Docs tab (mostly content + the diagram, low engineering risk, good to
   timebox at the end)
6. Per-platform approval overrides (small, but ties §2 and §4 together —
   good "polish that shows judgment" item for a demo)

---

## 9. One-line pitch for the resume/README

> Byline is a multi-agent content pipeline with full decision-trace
> observability — every draft, approval, and platform-specific safety check
> an agent makes is inspectable, not just its output. Built as a
> dispatcher-style dashboard (sidebar + command palette + always-on agent
> rail) rather than a chat-bolted-onto-a-form-tool.

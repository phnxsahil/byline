## Audiences

**Primary:** Developer-founders setting up their own Byline instance
Solo developers or small teams wanting to automate their "build in public" social media presence, needing local deployment and immediate time-to-value.

**Secondary:**
- Open-source maintainers and contributors — Developers wanting to submit PRs to the core Byline repo, caring about the monorepo setup and architecture.
- Content Creators exploring AI automation — Less technical founders or marketers deploying Byline for its content engine, caring about the dashboard and voice profiles.

---

## Getting Started: The "Zero to Automated Pipeline" Deploy

*Narrative:* Spinning up Byline locally via Docker, configuring the environment, connecting it to watch a GitHub repository, and manually dispatching a milestone to watch the agents work and approving it in the Desk.

**Steps:**
1. **Initializing the local workspace** (Covers Docker infra, Postgres/pgvector setup, running the server)
2. **Connecting a GitHub repository** (Covers project configuration and webhooks)
3. **Dispatching milestones and reviewing drafts** (Covers LangGraph execution, The Desk UI, approving outputs)

---

## Diving Deeper

*Topics that build the reader's mental model or enable customization after the initial tutorial.*

- **Understanding the agent pipeline**
  *Intent:* Explains the LangGraph `BylineState` and how the Strategist, Writers, and Critic interact.
  *Coverage:* `graph.py`, `state.py`, Agent prompts.
- **Tuning the AI voice profile**
  *Intent:* Shows how to customize the database so the output sounds like the founder's specific tone (e.g., lowercased text, banned phrases).
  *Coverage:* `voice_profiles` schema, Strategist prompt ingestion.
- **Adding custom platform writers**
  *Intent:* Walks through extending the LangGraph pipeline to add new target platforms like Medium or Dev.to.
  *Coverage:* Node patterns (`writer_linkedin.py`), extending `BylineState`.
- **Navigating the backend architecture**
  *Intent:* Explains the separation of FastAPI and Next.js, and how pgvector is used for semantic search.
  *Coverage:* FastAPI routes, Next.js dashboard, Database schema (`init.sql`).

---

## Reference

*Pure API specifications and lookups.*

- `dispatches.py` (FastAPI routing and SSE streaming)
- `graph.py` (LangGraph build logic)
- `state.py` (BylineState TypedDict)
- `nodes/` (Individual agent node logic)

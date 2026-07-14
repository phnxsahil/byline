<div align="center">
  <img src="./public/hero_bg.webp" alt="Byline Hero Grid" width="100%" style="border-radius: 8px; margin-bottom: 24px;" />

  <h1>Byline</h1>
  <p><strong>Your byline. Everywhere you ship.</strong></p>
  <p>An open-source, multi-agent content engine for developer-founders who build in public.</p>

  <a href="https://yourbyline.vercel.app">View Demo</a> · 
  <a href="https://github.com/phnxsahil/byline/issues">Report Bug</a> · 
  <a href="https://github.com/phnxsahil/byline/pulls">Request Feature</a>
</div>

---

## What is Byline?

Most content tools wait for you to bring the content. **Byline watches and finds it.**

Byline watches your GitHub, listens for voice notes, and accepts quick captures. When it detects something worth saying (a milestone, a shipped feature, or a hard lesson learned), it triggers a 5-agent LangGraph pipeline to draft platform-native content for **LinkedIn**, **X (Twitter)**, **Reddit**, and **Threads**—all written in your unique voice.

You review, edit, and approve the drafts from a beautiful, editorial web dashboard. Once approved, Byline dispatches them via Composio.

## How it works

When a milestone is detected, Byline runs a rigorous 5-agent LangGraph pipeline:

1. **Strategist:** Analyzes the raw milestone, decides the best angle (e.g., `lesson_learned`, `build_log`), selects the target platforms, and determines if it's even worth posting.
2. **Four Platform Writers:** Specialized agents that generate native drafts for their respective platforms (LinkedIn, X, Reddit, Threads). They adhere to strict rules (e.g., no "excited to announce", proper hook structures, platform-specific formatting).
3. **Critic:** Scores every draft out of 10 based on clarity, voice match, hook strength, and platform fit. It flags AI-slop and demands rewrites for anything that sounds unnatural.

## Tech Stack

Byline is built with a modern, AI-native stack:

- **Frontend:** Next.js 14 (TypeScript), React, TailwindCSS
- **Backend:** FastAPI (Python), asyncpg
- **Database:** PostgreSQL + `pgvector`
- **AI/Agents:** LangGraph, Anthropic (`claude-sonnet-4-6`)
- **Integrations:** Composio (for dispatching)

## Local Setup

Byline is fully open-source and self-hostable.

### 1. Database
You need a PostgreSQL database with the `pgvector` extension installed.
```bash
docker-compose up -d
```
*Run the `init.sql` script to set up the schema and seed data.*

### 2. Backend (FastAPI + LangGraph)
Navigate to the `api` directory, set up your Python virtual environment, and install dependencies. You will need an `ANTHROPIC_API_KEY`.
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend (Next.js)
Navigate to the web directory and install the dependencies.
```bash
cd packages/web
npm install
npm run dev
```

## Voice Profiles

Byline learns how you write. You can configure your **Voice Profile** to ensure the agents sound like you. You can provide:
- Average post lengths
- Favorite opener patterns
- **Banned phrases** (e.g., no "thrilled to share" or "delve")
- Raw writing samples for the Critic agent to cross-reference

## License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  Built by <a href="https://sharmasahil.me">@Sahil</a>
</div>
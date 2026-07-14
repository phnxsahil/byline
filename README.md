<div align="center">
  <img src="./byline/public/favicon.svg" alt="Byline Logo" width="120" style="margin-bottom: 20px;" />

  <h1>Byline Platform</h1>
  <p><strong>Your byline. Everywhere you ship.</strong></p>

  <p>
    An open-source, multi-agent content engine designed for developer-founders building in public. Byline monitors your workflow and automatically dispatches native content across platforms.
  </p>

  <div>
    <a href="https://github.com/phnxsahil/byline/actions"><img src="https://img.shields.io/github/actions/workflow/status/phnxsahil/byline/ci.yml?style=for-the-badge&logo=github&label=Build" alt="Build Status"></a>
    <a href="https://github.com/phnxsahil/byline/releases"><img src="https://img.shields.io/github/v/release/phnxsahil/byline?style=for-the-badge&color=F0A500&logo=react" alt="Release"></a>
    <a href="https://github.com/phnxsahil/byline/blob/master/LICENSE"><img src="https://img.shields.io/github/license/phnxsahil/byline?style=for-the-badge" alt="License"></a>
  </div>
  
  <br />

  <a href="https://yourbyline.vercel.app"><strong>Explore the Demo</strong></a> ·
  <a href="https://github.com/phnxsahil/byline/issues"><strong>Report Bug</strong></a> ·
  <a href="https://github.com/phnxsahil/byline/pulls"><strong>Request Feature</strong></a>

  <br /><br />
  
  <img src="./byline/public/hero_bg.webp" alt="Byline Dashboard Preview" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);" />
</div>

<hr />

## Table of Contents
- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture & Agents](#architecture--agents)
- [Tech Stack](#tech-stack)
- [Enterprise Deployment](#enterprise-deployment)
- [Voice Configuration](#voice-configuration)
- [Contributing](#contributing)
- [License](#license)

<hr />

## Overview

Most content tools require you to manually construct and publish updates. **Byline operates on a push model.** 

It continuously monitors your environment—fetching GitHub commits, processing voice notes, and capturing terminal outputs. When a significant milestone is detected, Byline triggers a LangGraph-orchestrated multi-agent pipeline to generate, critique, and finalize platform-native drafts for **LinkedIn, X (Twitter), Reddit, and Threads**. You review the drafts in a central dashboard and dispatch them instantly.

## Quick Start

The fastest way to scaffold Byline into your environment is via our interactive CLI tool.

```bash
npx byline init
```

This command will:
1. Initialize the Byline configuration file (`byline.config.ts`).
2. Scaffold the required `.env` variables for your Anthropic and Composio API keys.
3. Check your system for Docker and PostgreSQL dependencies.
4. Optionally start the development server.

## Architecture & Agents

The Byline intelligence engine relies on a strict **5-Agent Pipeline** to ensure quality and voice consistency:

1. **Strategist:** Evaluates raw input to determine content viability, narrative angle (e.g., `technical_deep_dive`, `build_log`), and optimal target platforms.
2. **Platform Writers (x4):** Highly specialized sub-agents responsible for crafting native drafts for their respective platforms. They enforce platform-specific constraints:
   - **X (Twitter):** Optimizes for threading, character limits, and high-engagement hooks.
   - **LinkedIn:** Formats for professional storytelling, strategic line-breaks, and avoiding generic buzzwords.
   - **Reddit:** Strictly enforces anti-self-promotion rules, prioritizing educational value and deep-dives.
   - **Threads:** Casual, raw, and conversational formatting.
3. **Critic:** The final checkpoint. It evaluates drafts across four dimensions (Clarity, Voice Match, Hook Strength, Platform Fit) and enforces the user's negative constraints (e.g., rejecting AI-generated clichés like "delve" or "thrilled to announce").

<hr />

## Tech Stack

Designed for scale and performance, Byline leverages a modern, AI-native infrastructure:

- **Frontend:** Next.js 14, React, TailwindCSS, Framer Motion
- **Backend:** FastAPI (Python), asyncpg
- **Database:** PostgreSQL with `pgvector` for semantic search and Retrieval-Augmented Generation (RAG)
- **AI Orchestration:** LangGraph, Anthropic (`claude-sonnet-4-6`)
- **Deployment & Social APIs:** Composio Integration

<hr />

## Enterprise Deployment

For teams and power-users, Byline is built to be self-hosted. The recommended deployment strategy utilizes Docker for the data layer and local runtimes for the application services.

### 1. Database Initialization
Ensure Docker is installed, then spin up the PostgreSQL instance (which includes the `pgvector` extension natively).
```bash
docker-compose up -d
```
*Note: Execute the `init.sql` script to apply the schema migrations and seed data.*

### 2. Backend Services
Initialize the FastAPI application and LangGraph pipelines. You must supply a valid `ANTHROPIC_API_KEY` in your `.env`.
```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend Dashboard
Start the Next.js client interface.
```bash
cd packages/web
npm install
npm run dev
```

<hr />

## Voice Configuration

To maintain brand authenticity, Byline supports granular Voice Profiles. Administrators can configure:
- **Baseline Metrics:** Target word counts and average paragraph lengths.
- **Hook Patterns:** Preferred opening structures.
- **Banned Lexicon:** Strict arrays of prohibited phrases to prevent generic AI output.
- **Reference Material:** Vector embeddings of historical writing samples used by the Critic agent for style-matching.

<hr />

## Contributing

Byline is completely open-source. Whether you're fixing a bug, proposing a new agent, or adding a new platform integration, your contributions are welcome! Please check the `CONTRIBUTING.md` file for guidelines.

<hr />

<div align="center">
  <p>Distributed under the MIT License.</p>
  <p>Built by <a href="https://sharmasahil.me">@Sahil</a></p>
</div>

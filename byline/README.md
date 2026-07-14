<div align="center">
  <img src="./public/favicon.svg" alt="Byline Logo" width="120" style="margin-bottom: 20px;" />

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
  
  <img src="./public/hero_bg.webp" alt="Byline Dashboard Preview" width="100%" style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);" />
</div>

<hr />

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Enterprise Deployment](#enterprise-deployment)
- [Voice Configuration](#voice-configuration)
- [License](#license)

<hr />

## Overview

Most content tools require you to manually construct and publish updates. **Byline operates on a push model.** 

It continuously monitors your environment—fetching GitHub commits, processing voice notes, and capturing terminal outputs. When a significant milestone is detected, Byline triggers a LangGraph-orchestrated multi-agent pipeline to generate, critique, and finalize platform-native drafts for **LinkedIn, X (Twitter), Reddit, and Threads**. You review the drafts in a central dashboard and dispatch them instantly.

## Architecture

The Byline intelligence engine relies on a strict **5-Agent Pipeline** to ensure quality and voice consistency:

1. **Strategist:** Evaluates raw input to determine content viability, narrative angle (e.g., `technical_deep_dive`, `build_log`), and optimal target platforms.
2. **Platform Writers (x4):** Highly specialized sub-agents responsible for crafting native drafts for their respective platforms. They enforce platform-specific constraints (e.g., X character limits, Reddit anti-promotion guidelines).
3. **Critic:** The final checkpoint. It evaluates drafts across four dimensions (Clarity, Voice Match, Hook Strength, Platform Fit) and enforces the user's negative constraints (e.g., rejecting AI-generated clichés like "delve" or "thrilled to announce").

<hr />

## Tech Stack

Designed for scale and performance, Byline leverages a modern, AI-native infrastructure:

- **Frontend:** Next.js 14, React, TailwindCSS
- **Backend:** FastAPI (Python), asyncpg
- **Database:** PostgreSQL with `pgvector` for semantic search
- **Orchestration:** LangGraph, Anthropic (`claude-sonnet-4-6`)
- **Deployment:** Composio Integration

<hr />

## Enterprise Deployment

Byline is built to be self-hosted. The recommended deployment strategy utilizes Docker for the data layer and local runtimes for the application services.

### 1. Database Initialization
Ensure Docker is installed, then spin up the PostgreSQL instance (includes `pgvector`).
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

<div align="center">
  <p>Distributed under the MIT License.</p>
  <p>Built by <a href="https://sharmasahil.me">@Sahil</a></p>
</div>
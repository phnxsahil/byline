---
title: "Self-Hosting Byline"
description: "How to deploy Byline on your own infrastructure using Docker Compose."
---

Byline is designed to be easily self-hosted. The entire application (FastAPI backend, Next.js web dashboard, and PostgreSQL + pgvector database) can be spun up using a single Docker Compose file.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed.
- API Keys for Anthropic (for the agents) and OpenAI (for embeddings).

## 1. Clone the Repository

Clone the open-source repository from GitHub:

```bash
git clone https://github.com/phnxsahil/byline.git
cd byline
```

## 2. Configure Environment Variables

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Your `.env` file should look like this:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://byline:byline@db:5432/byline

# LLM API Keys
ANTHROPIC_API_KEY=your-anthropic-key-for-agents
OPENAI_API_KEY=your-openai-key-for-embeddings

# Optional: Composio API Key for direct posting
COMPOSIO_API_KEY=your-composio-key
```

## 3. Run Docker Compose

Start the services in detached mode:

```bash
docker compose up -d
```

This command will:
1. Start a PostgreSQL instance with the `pgvector` extension enabled.
2. Run the `init.sql` script to set up the database schema and seed data.
3. Start the FastAPI backend on port `8000`.
4. Start the Next.js frontend on port `3000`.

## 4. Access the Dashboard

Once the containers are running, you can access the Byline dashboard at:
**[http://localhost:3000](http://localhost:3000)**

The API is accessible at:
**[http://localhost:8000](http://localhost:8000)**

## Managing the Database

If you need to reset the database or apply changes to the schema, you can run the initialization script directly inside the postgres container, or simply recreate the volume:

```bash
docker compose down -v
docker compose up -d
```

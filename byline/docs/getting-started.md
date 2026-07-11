# Getting Started: The "Zero to Automated Pipeline" Deploy

## Initializing the local workspace

- Clone the Byline repository
- Boot the database dependencies (PostgreSQL + pgvector)
- Initialize the local FastAPI and Next.js services using the CLI

### Provisioning the infrastructure

Byline requires a database and a local server.

The setup process begins with cloning the repository.

You must provide an OpenAI API key.

```bash
# Clone the repository
git clone https://github.com/sahil/byline.git
cd byline

# Copy the environment template and add your API keys
cp .env.example .env

# Boot the pgvector database
docker-compose up -d

# Initialize the local desk (Next.js UI + FastAPI backend)
npx byline init
```

Docker provisions the Postgres database with the pgvector extension.

The initialization command boots the web dashboard and the agent runner.

## Connecting a GitHub repository

- Register a project in the database
- Configure the GitHub webhook to point to your local instance

### Registering the project

Byline needs a registered project to map incoming commits.

The curl command inserts your project details into the database.

```bash
# Register your project via the local API (or use The Desk UI)
curl -X POST http://localhost:8000/projects \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "fltrd-tech",
    "name": "fltrd.tech",
    "tagline": "AI-powered content filtering",
    "stack": ["Next.js", "FastAPI", "pgvector"]
  }'

# Map the webhook in your GitHub repository settings to:
# Payload URL: https://<your-ngrok-url>/webhooks/github
# Content type: application/json
```

### Configuring webhooks

GitHub webhooks notify Byline about new code pushes.

You configure GitHub to send payloads to your local instance.

## Dispatching milestones and reviewing drafts

- Trigger a manual dispatch for a specific milestone
- Stream the LangGraph agent execution in real-time
- Review the platform-native drafts in The Desk

### Triggering the pipeline

The CLI provides a manual way to trigger the LangGraph pipeline.

The Strategist agent evaluates the input for post-worthiness.

```bash
# Manually trigger a dispatch using the CLI tool
python cli.py log "shipped semantic search on fltrd.tech using pgvector"
```

```json
// Example SSE stream from GET /dispatch/{id}/stream
{"node": "strategist", "status": "running"}
{"node": "strategist", "status": "done", "output": {"platforms": ["linkedin", "x", "reddit"]}}
{"done": true, "dispatch_id": "8f7e2a9b-..."}
```

The backend streams agent progress via server-sent events.

The specialized writer nodes generate platform-native drafts concurrently.

### Approving in The Desk

```bash
# Or, open The Desk to watch the wire feed visually and approve drafts
open http://localhost:3000/desk
```

The Desk dashboard displays the finished drafts for your final approval.

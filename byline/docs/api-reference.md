# Byline API Reference

Byline exposes a set of REST and Server-Sent Events (SSE) endpoints that allow you to programmatically trigger agent pipelines, check status, and post content.

## Base URL

By default, the Byline API runs locally on port 8000:
`http://localhost:8000`

---

## `POST /api/dispatches`

Creates a new dispatch (milestone) and starts the agent pipeline in the background.

### Request

```json
{
  "project_id": "uuid",
  "milestone": "string",
  "source": "manual | github | voice | paste"
}
```

### Response `200 OK`

```json
{
  "dispatch_id": "uuid",
  "status": "running"
}
```

### Example

```bash
curl -X POST http://localhost:8000/api/dispatches \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "d0f81a70-8e50-482f-876a-939e6022e378",
    "milestone": "shipped a new postgres integration",
    "source": "manual"
  }'
```

---

## `GET /api/dispatches/{id}`

Fetches the complete state of a dispatch, including its metadata, strategist reasoning, and the latest platform drafts.

### Example

```bash
curl http://localhost:8000/api/dispatches/d0f81a70-8e50-482f-876a-939e6022e378
```

### Response `200 OK`

```json
{
  "dispatch": {
    "id": "uuid",
    "status": "ready",
    "arc_id": "uuid",
    "is_post_worthy": true,
    "stamps": [
      {
        "platform": "linkedin",
        "status": "draft",
        "draft_id": "uuid",
        "critic_score": 8.5
      }
    ]
  },
  "drafts": [
    {
      "id": "uuid",
      "platform": "linkedin",
      "body": "..."
    }
  ]
}
```

---

## `GET /api/dispatches/{id}/stream` (SSE)

Connects to a Server-Sent Events (SSE) stream that broadcasts the live, step-by-step progress of the agent pipeline.

### Example

```javascript
const eventSource = new EventSource('http://localhost:8000/api/dispatches/{id}/stream');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.node, data.status);
};
```

**Events Emitted:**
- `{"node": "strategist", "status": "running"}`
- `{"node": "write_linkedin", "status": "done", "output": {...}}`
- `{"done": true, "dispatch_id": "uuid"}`

---

## `POST /api/drafts/{id}/post`

Takes an approved draft and posts it natively to the target platform (via Composio). 

### Example

```bash
curl -X POST http://localhost:8000/api/drafts/draft_uuid/post
```

### Response `200 OK`

```json
{
  "ok": true,
  "external_id": "platform_post_id"
}
```

---

## `POST /api/voice-profile`

Generates or updates a voice profile using provided samples. The system will extract your tone, commonly used phrases, and structural habits.

### Request

```json
{
  "raw_posts": "string (your pasted samples)",
  "platform": "all"
}
```

### Example

```bash
curl -X POST http://localhost:8000/api/voice-profile \
  -H "Content-Type: application/json" \
  -d '{
    "raw_posts": "sample text here...",
    "platform": "all"
  }'
```

### Response `200 OK`

```json
{
  "id": "uuid",
  "version": 2,
  "body": "lowercase on casual channels, sentence case on LinkedIn...",
  "generated_at": "2024-03-24T12:00:00Z"
}
```

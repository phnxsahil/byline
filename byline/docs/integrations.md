---
title: "Integrations & Publishing"
description: "How Byline connects to your workflow and social accounts."
---

Byline is designed to plug directly into the tools where developer-founders already work. 

## Composio Integration

Byline uses [Composio](https://composio.dev/) to handle OAuth connections and native posting to social platforms, meaning you don't have to manage Twitter API keys or LinkedIn Developer apps yourself.

### Connecting Accounts

To authorize Byline to post on your behalf, run the Composio CLI commands on your machine:

```bash
composio add linkedin
composio add twitter
composio add reddit
```

Once connected, when you click **Approve** on a draft in the Byline dashboard, the backend triggers `POST /api/drafts/{id}/post`. This securely executes the Composio action (`LINKEDIN_CREATE_LINKEDIN_POST`, `TWITTER_CREATE_TWEET`, etc.) to publish the content natively.

## Webhook Ingestion

Instead of manually typing milestones, you can configure Byline to automatically trigger the agent pipeline whenever you push code.

### GitHub Webhooks

1. Go to your GitHub repository settings.
2. Navigate to **Webhooks** -> **Add webhook**.
3. Set the Payload URL to your deployed Byline instance: `https://your-byline-url.com/api/webhooks/github`.
4. Set the Content type to `application/json`.
5. Select **Just the push event**.

When you push commits to the repository, Byline parses the commit messages. If a commit summary starts with keywords like `feat`, `fix`, or `shipped`, it will automatically create a new dispatch and start generating drafts in the background.

## Future Integrations

We are actively exploring integrations for:
- **VS Code Extension**: Log a milestone directly from the command palette without leaving your editor.
- **Obsidian Plugin**: Send build logs directly from your local markdown notes to the Byline agents.

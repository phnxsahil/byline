---
title: "Voice Profile Configuration"
description: "How Byline extracts and matches your unique writing style."
---

One of the biggest problems with AI-generated social content is that it sounds like AI. To solve this, Byline uses a **Voice Profile** system.

Instead of prompting the AI with generic rules (e.g., "write professionally"), you provide Byline with 3-5 of your best, manually written past posts. The backend analyzes these samples to extract a set of strict heuristics that define your exact style.

## Training Your Voice

You can train your voice profile directly from the Byline Dashboard:

1. Navigate to the **Settings** tab.
2. Select **Voice & Brand Guardrails**.
3. Paste 3-5 raw posts you've written in the past into the provided textarea.
4. Click **Analyze My Voice**.

Byline will hit the `/api/voice-profile/extract` endpoint and generate a persistent rule set that the agent pipeline will obey moving forward.

## What is Extracted?

When Byline analyzes your samples, it looks for:
- **Capitalization habits**: Do you prefer sentence case, lowercase, or title case?
- **Opener patterns**: How do you hook the reader? (e.g., "I spent X days on Y", or "Here's what nobody tells you about Z").
- **Paragraph structure**: Do you use single-sentence paragraphs? Bullet points?
- **Banned phrases**: What corporate jargon do you avoid? By default, Byline aggressively strips phrases like "excited to announce", "humbled", "game-changer", and "synergy".

## Reviewing Voice Alignment

Every time a draft is generated, the **Critic Agent** scores it against your active Voice Profile. 

When you review a draft in the **Desk Drawer**, you will see a **Voice Match Score (X/10)**. If the score is low, the Critic will provide notes on exactly which of your voice rules the Writer agent violated, allowing you to manually refine the draft before publishing.

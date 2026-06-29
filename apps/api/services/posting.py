from __future__ import annotations

import logging
import httpx
import asyncio
from datetime import datetime
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from apps.api.db.models import Draft, Outlet
from apps.api.config import get_settings

logger = logging.getLogger("byline.posting")


def reddit_guardrail(content: str, title: str) -> bool:
    """Returns True if safe to post (i.e. no banned promotional phrases)."""
    signals = ["check out", "try my", "launched", "excited to", "sign up", "available now", "get it here"]
    combined = f"{title} {content}".lower()
    return not any(s in combined for s in signals)


async def post_draft_to_platform(session: AsyncSession, draft_id: UUID) -> str | None:
    # Load draft and refresh from DB
    draft = await session.get(Draft, draft_id)
    if not draft:
        logger.error(f"Draft {draft_id} not found.")
        return None

    # Fetch corresponding outlet
    result = await session.execute(select(Outlet).where(Outlet.platform == draft.platform))
    outlet = result.scalar_one_or_none()

    # If the outlet is not connected, run in mock mode
    if not outlet or not outlet.is_connected:
        logger.info(f"Outlet '{draft.platform}' is not connected. Simulating post.")
        await asyncio.sleep(0.5)

        if draft.platform == "reddit":
            title = draft.reddit_title or "Shipped a new milestone"
            if not reddit_guardrail(draft.body, title):
                raise ValueError("Reddit promotional guardrail triggered. Post blocked.")

        post_id = f"mock-{draft.platform}-post-{int(datetime.now().timestamp())}"
        draft.status = "posted"
        draft.posted_at = datetime.now()
        draft.composio_post_id = post_id
        await session.commit()
        await session.refresh(draft)
        return post_id

    # Outlet is connected: Real posting flow
    settings = get_settings()

    try:
        if draft.platform == "threads":
            # Threads Meta API directly
            # Threads access token can be saved in the outlet display_name or settings (as a fallback)
            # In a real app, it is stored in settings or a credential table.
            token = getattr(settings, "threads_access_token", None) or (outlet.composio_entity_id)
            if not token:
                raise ValueError("Threads access token not configured.")

            async with httpx.AsyncClient() as client:
                # 1. Create container
                container_url = f"https://graph.threads.net/v1.0/me/threads"
                res = await client.post(
                    container_url,
                    params={
                        "media_type": "TEXT",
                        "text": draft.body,
                        "access_token": token,
                    }
                )
                res.raise_for_status()
                container_data = res.json()
                creation_id = container_data["id"]

                # 2. Publish container
                publish_url = f"https://graph.threads.net/v1.0/me/threads_publish"
                res_publish = await client.post(
                    publish_url,
                    params={
                        "creation_id": creation_id,
                        "access_token": token,
                    }
                )
                res_publish.raise_for_status()
                post_id = res_publish.json()["id"]
        else:
            # LinkedIn, X, and Reddit via Composio
            try:
                from composio import ComposioToolSet
            except ImportError:
                raise ImportError(
                    "composio-core is not installed. "
                    "Install it using 'pip install composio-core' to use live posting."
                )

            entity_id = outlet.composio_entity_id or "default"
            toolset = ComposioToolSet(entity_id=entity_id)

            if draft.platform == "linkedin":
                res = toolset.execute_action(
                    action="LINKEDIN_CREATE_LINKEDIN_POST",
                    params={"text": draft.body}
                )
                post_id = res.get("id") or res.get("post_id") or "linkedin-post-success"

            elif draft.platform == "x":
                res = toolset.execute_action(
                    action="TWITTER_CREATE_TWEET",
                    params={"text": draft.body}
                )
                post_id = res.get("id") or res.get("tweet_id") or "twitter-post-success"

            elif draft.platform == "reddit":
                title = draft.reddit_title or "Shipped a new milestone"
                subreddit = draft.reddit_subreddit or "SideProject"
                if not reddit_guardrail(draft.body, title):
                    raise ValueError("Reddit promotional guardrail triggered. Post blocked.")

                res = toolset.execute_action(
                    action="REDDIT_CREATE_TEXT_POST",
                    params={
                        "title": title,
                        "content": draft.body,
                        "subreddit": subreddit
                    }
                )
                post_id = res.get("id") or res.get("post_id") or "reddit-post-success"
            else:
                raise ValueError(f"Unknown platform '{draft.platform}'")

        # Save success status
        draft.status = "posted"
        draft.posted_at = datetime.now()
        draft.composio_post_id = post_id
        await session.commit()
        await session.refresh(draft)
        
        # Update outlet last posted time
        outlet.last_posted_at = datetime.now()
        await session.commit()
        
        return post_id

    except Exception as e:
        logger.error(f"Failed to post draft {draft.id} to {draft.platform}: {e}")
        # Re-raise to let the router handle it
        raise e

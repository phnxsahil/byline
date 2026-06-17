from __future__ import annotations

import asyncio
from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.models import Dispatch, Draft, NarrativeArc, Project, VoiceProfile
from packages.agents.graph import run_pipeline


async def _recent_posts(session: AsyncSession) -> list[dict]:
    result = await session.execute(
        select(Draft, Dispatch)
        .join(Dispatch, Draft.dispatch_id == Dispatch.id)
        .order_by(desc(Draft.created_at))
        .limit(10)
    )
    posts = []
    for draft, dispatch in result.all():
        posts.append(
            {
                "platform": draft.platform,
                "topic": dispatch.body,
                "angle": dispatch.angle,
                "created_at": draft.created_at.isoformat(),
            }
        )
    return posts


async def _active_arcs(session: AsyncSession) -> list[dict]:
    result = await session.execute(
        select(NarrativeArc).where(NarrativeArc.is_active.is_(True)).order_by(NarrativeArc.created_at.asc())
    )
    return [
        {"name": arc.name, "description": arc.description, "recent_topics": []}
        for arc in result.scalars().all()
    ]


async def _voice_profile(session: AsyncSession) -> str:
    result = await session.execute(
        select(VoiceProfile)
        .where(VoiceProfile.platform == "all", VoiceProfile.is_active.is_(True))
        .order_by(desc(VoiceProfile.generated_at))
        .limit(1)
    )
    profile = result.scalar_one_or_none()
    if profile is None:
        return "Write like a builder's field log: direct, concrete, low-hype, and technically specific."
    return profile.body


async def generate_drafts_for_dispatch(
    session: AsyncSession,
    dispatch_id: UUID,
    event_queue: asyncio.Queue | None = None,
) -> dict:
    dispatch = await session.get(Dispatch, dispatch_id)
    if dispatch is None:
        raise ValueError("Dispatch not found")
    project = await session.get(Project, dispatch.project_id)
    if project is None:
        raise ValueError("Project not found")

    final_state = await run_pipeline(
        dispatch_id=str(dispatch.id),
        dispatch_body=dispatch.body,
        project={
            "id": str(project.id),
            "name": project.name,
            "description": project.description,
            "stack": project.stack or [],
            "status": project.status,
            "demo_url": project.demo_url,
            "repo_url": project.repo_url,
        },
        recent_posts=await _recent_posts(session),
        active_arcs=await _active_arcs(session),
        voice_profile=await _voice_profile(session),
        event_queue=event_queue,
    )

    strategist_out = final_state.get("strategist_output", {})
    dispatch.is_post_worthy = final_state.get("post_worthy") or strategist_out.get("should_post")
    dispatch.hold_reason = final_state.get("hold_reason") or strategist_out.get("skip_reason")
    dispatch.angle = final_state.get("angle") or strategist_out.get("angle")
    dispatch.suggested_platforms = list(final_state.get("target_platforms", []))
    dispatch.avoid_topics = list(final_state.get("avoid", []))
    dispatch.strategist_reasoning = strategist_out

    generation_result = await session.execute(
        select(Draft.generation).where(Draft.dispatch_id == dispatch.id).order_by(desc(Draft.generation)).limit(1)
    )
    next_generation = (generation_result.scalar_one_or_none() or 0) + 1

    drafts_by_platform: dict[str, Draft] = {}
    for platform, draft_result in final_state.get("drafts", {}).items():
        status = "draft" if draft_result.get("critic_passed") else "rejected"
        draft = Draft(
            dispatch_id=dispatch.id,
            platform=platform,
            body=draft_result["body"],
            reddit_title=draft_result.get("reddit_title"),
            reddit_subreddit=draft_result.get("reddit_subreddit"),
            generation=next_generation,
            critic_score=draft_result.get("critic_score"),
            critic_note=draft_result.get("critic_note"),
            status=status,
        )
        session.add(draft)
        drafts_by_platform[platform] = draft

    await session.commit()

    for platform, draft in drafts_by_platform.items():
        if event_queue is not None:
            await event_queue.put(
                {
                    "platform": platform,
                    "status": "flagged" if draft.status == "rejected" else "ready",
                    "draft_id": draft.id,
                    "critic_score": draft.critic_score,
                    "critic_note": draft.critic_note,
                }
            )

    return {"dispatch": dispatch, "drafts": drafts_by_platform}


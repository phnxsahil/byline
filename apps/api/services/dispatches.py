from __future__ import annotations

from collections import defaultdict

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from apps.api.db.models import Dispatch, Draft, NarrativeArc, Project
from apps.api.schemas.dispatches import DispatchCreate, DispatchRead, StampState
from packages.agents.llm import embed_text


async def create_dispatch(session: AsyncSession, payload: DispatchCreate) -> Dispatch:
    dispatch = Dispatch(
        project_id=payload.project_id,
        arc_id=payload.arc_id,
        body=payload.body,
        source=payload.source,
        embedding=await embed_text(payload.body),
    )
    session.add(dispatch)
    await session.commit()
    await session.refresh(dispatch)
    return dispatch


async def get_dispatch(session: AsyncSession, dispatch_id) -> Dispatch | None:
    result = await session.execute(
        select(Dispatch)
        .where(Dispatch.id == dispatch_id)
        .options(
            selectinload(Dispatch.project),
            selectinload(Dispatch.arc),
            selectinload(Dispatch.drafts),
        )
    )
    return result.scalar_one_or_none()


async def list_dispatches(session: AsyncSession) -> list[DispatchRead]:
    result = await session.execute(
        select(Dispatch)
        .where(Dispatch.deleted_at.is_(None))
        .order_by(desc(Dispatch.created_at))
        .options(
            selectinload(Dispatch.project),
            selectinload(Dispatch.arc),
            selectinload(Dispatch.drafts),
        )
    )
    items = []
    for dispatch in result.scalars().all():
        latest_by_platform = {}
        for draft in sorted(dispatch.drafts, key=lambda item: (item.platform, item.generation, item.created_at)):
            latest_by_platform[draft.platform] = draft
        stamps = [
            StampState(
                platform=platform,
                status=(latest_by_platform[platform].status if platform in latest_by_platform else "pending"),
                draft_id=(latest_by_platform[platform].id if platform in latest_by_platform else None),
                critic_score=(latest_by_platform[platform].critic_score if platform in latest_by_platform else None),
                critic_note=(latest_by_platform[platform].critic_note if platform in latest_by_platform else None),
            )
            for platform in ("linkedin", "x", "reddit", "threads")
        ]
        items.append(
            DispatchRead(
                id=dispatch.id,
                project_id=dispatch.project_id,
                project_name=dispatch.project.name,
                arc_id=dispatch.arc_id,
                arc_name=dispatch.arc.name if dispatch.arc else None,
                body=dispatch.body,
                source=dispatch.source,
                is_post_worthy=dispatch.is_post_worthy,
                hold_reason=dispatch.hold_reason,
                angle=dispatch.angle,
                suggested_platforms=dispatch.suggested_platforms,
                avoid_topics=dispatch.avoid_topics,
                strategist_reasoning=dispatch.strategist_reasoning,
                created_at=dispatch.created_at,
                updated_at=dispatch.updated_at,
                stamps=stamps,
            )
        )
    return items


async def list_active_arcs(session: AsyncSession) -> list[NarrativeArc]:
    result = await session.execute(
        select(NarrativeArc).where(NarrativeArc.is_active.is_(True)).order_by(NarrativeArc.created_at.asc())
    )
    return list(result.scalars())


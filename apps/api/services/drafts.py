from __future__ import annotations

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.models import Draft
from apps.api.schemas.drafts import DraftPatch


async def list_latest_drafts_for_dispatch(session: AsyncSession, dispatch_id) -> list[Draft]:
    result = await session.execute(
        select(Draft).where(Draft.dispatch_id == dispatch_id).order_by(desc(Draft.generation), Draft.platform.asc())
    )
    latest: dict[str, Draft] = {}
    for draft in result.scalars().all():
        latest.setdefault(draft.platform, draft)
    return list(latest.values())


async def patch_draft(session: AsyncSession, draft_id, payload: DraftPatch) -> Draft | None:
    draft = await session.get(Draft, draft_id)
    if draft is None:
        return None
    if payload.body is not None:
        draft.body = payload.body
    if payload.status is not None:
        draft.status = payload.status
    await session.commit()
    await session.refresh(draft)
    return draft


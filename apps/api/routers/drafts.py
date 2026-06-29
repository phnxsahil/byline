from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.session import get_session
from apps.api.schemas.drafts import DraftPatch, DraftRead
from apps.api.services.drafts import list_latest_drafts_for_dispatch, patch_draft


router = APIRouter(tags=["drafts"])


@router.get("/dispatches/{dispatch_id}/drafts", response_model=list[DraftRead])
async def get_dispatch_drafts(dispatch_id: UUID, session: AsyncSession = Depends(get_session)):
    """Get the latest draft per platform for a dispatch. Auth: none."""
    return await list_latest_drafts_for_dispatch(session, dispatch_id)


@router.patch("/drafts/{draft_id}", response_model=DraftRead)
async def update_draft(draft_id: UUID, payload: DraftPatch, session: AsyncSession = Depends(get_session)):
    """Update a draft body or status. Auth: none."""
    draft = await patch_draft(session, draft_id, payload)
    if draft is None:
        raise HTTPException(status_code=404, detail="Draft not found")

    if payload.status == "approved":
        from apps.api.services.posting import post_draft_to_platform
        try:
            await post_draft_to_platform(session, draft_id)
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Posting failed: {str(e)}")

    return draft

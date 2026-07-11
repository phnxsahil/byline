from __future__ import annotations

from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from apps.api.db.session import get_session
from apps.api.db.models import Outlet

router = APIRouter(prefix="/outlets", tags=["outlets"])


class OutletRead(BaseModel):
    id: UUID
    platform: str
    is_connected: bool
    display_name: str | None = None
    connected_at: datetime | None = None
    approval_mode: str

    model_config = {"from_attributes": True}


class OutletPatch(BaseModel):
    is_connected: bool | None = None
    display_name: str | None = None
    approval_mode: str | None = None


@router.get("", response_model=list[OutletRead])
async def get_outlets(session: AsyncSession = Depends(get_session)):
    """List connected platform outlets."""
    result = await session.execute(select(Outlet))
    return list(result.scalars().all())


@router.patch("/{platform}", response_model=OutletRead)
async def patch_outlet(platform: str, payload: OutletPatch, session: AsyncSession = Depends(get_session)):
    """Update connection state for a platform outlet."""
    result = await session.execute(select(Outlet).where(Outlet.platform == platform))
    outlet = result.scalar_one_or_none()
    if outlet is None:
        raise HTTPException(status_code=404, detail=f"Outlet '{platform}' not found")

    if payload.is_connected is not None:
        outlet.is_connected = payload.is_connected
        if payload.is_connected:
            outlet.connected_at = datetime.now()
        else:
            outlet.connected_at = None

    if payload.display_name is not None:
        outlet.display_name = payload.display_name

    if payload.approval_mode is not None:
        if payload.approval_mode not in ("auto_post", "review_required", "drafts_only"):
            raise HTTPException(status_code=400, detail="Invalid approval mode")
        outlet.approval_mode = payload.approval_mode

    await session.commit()
    await session.refresh(outlet)
    return outlet

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.session import get_session
from apps.api.schemas.voice import VoiceProfileCreate, VoiceProfileRead
from apps.api.services.voice import create_or_replace_voice_profile, get_active_voice_profile


router = APIRouter(prefix="/voice-profile", tags=["voice-profile"])


@router.get("", response_model=VoiceProfileRead)
async def get_voice_profile(session: AsyncSession = Depends(get_session)):
    """Return the active voice profile for the single-user workspace. Auth: none."""
    profile = await get_active_voice_profile(session)
    if profile is None:
        raise HTTPException(status_code=404, detail="Voice profile not found")
    return profile


@router.post("", response_model=VoiceProfileRead)
async def post_voice_profile(payload: VoiceProfileCreate, session: AsyncSession = Depends(get_session)):
    """Create or replace the active voice profile. Auth: none."""
    return await create_or_replace_voice_profile(session, payload)


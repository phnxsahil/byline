from __future__ import annotations

import hmac
import hashlib
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.config import get_settings
from apps.api.db.session import get_session, get_session_factory
from apps.api.schemas.voice import VoiceProfileCreate, VoiceProfileRead
from apps.api.services.voice import create_or_replace_voice_profile, get_active_voice_profile
from apps.api.schemas.dispatches import DispatchCreate, DispatchRead
from apps.api.services.dispatches import create_dispatch, get_dispatch
from apps.api.services.generation import generate_drafts_for_dispatch

router = APIRouter(prefix="/voice-profile", tags=["voice-profile"])
voice_router = APIRouter(tags=["voice"])


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


@router.post("/extract", response_model=VoiceProfileRead)
async def extract_voice_profile(payload: VoiceProfileCreate, session: AsyncSession = Depends(get_session)):
    """Extract and create/replace the active voice profile. Auth: none."""
    return await create_or_replace_voice_profile(session, payload)


async def run_pipeline_in_background(dispatch_id: UUID):
    async with get_session_factory()() as session:
        try:
            await generate_drafts_for_dispatch(session, dispatch_id)
        except Exception as e:
            import sys
            print(f"Error generating drafts for voice dispatch {dispatch_id}: {e}", file=sys.stderr)


@voice_router.post("/voice")
async def post_voice_note(
    background_tasks: BackgroundTasks,
    project_id: UUID = Form(...),
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
):
    settings = get_settings()
    transcription = ""

    # Validate file content type and size before reading into memory
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    ALLOWED_CONTENT_TYPES = {
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/ogg",
        "audio/webm",
        "audio/x-m4a",
        "audio/m4a",
        "audio/mp4",
    }
    content_type = file.content_type
    if not content_type or (content_type not in ALLOWED_CONTENT_TYPES and not content_type.startswith("audio/")):
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    file_size = getattr(file, "size", None)
    if file_size is None:
        await file.seek(0, 2)
        file_size = await file.tell()
        await file.seek(0)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Audio file too large (max 10MB)")

    if settings.openai_api_key:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(api_key=settings.openai_api_key)
            file_bytes = await file.read()
            response = await client.audio.transcriptions.create(
                model="whisper-1",
                file=(file.filename or "audio.mp3", file_bytes, file.content_type or "audio/mpeg"),
            )
            transcription = response.text.strip()
        except Exception as e:
            # Fallback error mapping only allowed in dev mode
            if getattr(settings, "dev_mode", False):
                transcription = f"shipped a new voice note interface: {str(e)}"
            else:
                raise HTTPException(status_code=500, detail=f"Whisper transcription failed: {str(e)}")
    else:
        # Development fallback only allowed in dev mode
        if getattr(settings, "dev_mode", False):
            transcription = "shipped the new audio recorder interface directly in the overview dashboard milestone box"
        else:
            raise HTTPException(status_code=400, detail="OpenAI API key is missing, cannot transcribe audio")

    if not transcription:
        raise HTTPException(status_code=400, detail="Could not transcribe audio content")

    # Create new Dispatch milestone
    dispatch_payload = DispatchCreate(
        project_id=project_id,
        body=transcription,
        source="voice",
    )
    dispatch = await create_dispatch(session, dispatch_payload)

    # Schedule background LLM draft generation
    background_tasks.add_task(run_pipeline_in_background, dispatch.id)

    return {
        "status": "processed",
        "dispatch_id": str(dispatch.id),
        "transcription": transcription,
    }

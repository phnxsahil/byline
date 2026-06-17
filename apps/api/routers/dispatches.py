from __future__ import annotations

import asyncio
import json
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.session import get_session, get_session_factory
from apps.api.schemas.common import NarrativeArcRead
from apps.api.schemas.dispatches import DispatchCreate, DispatchRead
from apps.api.services.dispatches import create_dispatch, get_dispatch, list_active_arcs, list_dispatches
from apps.api.services.generation import generate_drafts_for_dispatch


router = APIRouter(tags=["dispatches"])


@router.get("/dispatches", response_model=list[DispatchRead])
async def get_dispatch_list(session: AsyncSession = Depends(get_session)):
    """List dispatches in reverse chronological order. Auth: none."""
    return await list_dispatches(session)


@router.post("/dispatches", response_model=DispatchRead)
async def post_dispatch(payload: DispatchCreate, session: AsyncSession = Depends(get_session)):
    """Log a new dispatch. Auth: none."""
    dispatch = await create_dispatch(session, payload)
    hydrated = await get_dispatch(session, dispatch.id)
    if hydrated is None:
        raise HTTPException(status_code=500, detail="Dispatch could not be reloaded")
    return (await list_dispatches(session))[0]


@router.get("/dispatches/{dispatch_id}/generate")
async def stream_generation(dispatch_id: UUID):
    """Run the generation pipeline and SSE-stream per-platform stamp updates. Auth: none."""
    queue: asyncio.Queue = asyncio.Queue()

    async def producer() -> None:
        async with get_session_factory()() as session:
            try:
                await generate_drafts_for_dispatch(session, dispatch_id, queue)
            except Exception as exc:
                await queue.put({"error": str(exc)})
            finally:
                await queue.put({"done": True})

    async def event_stream():
        task = asyncio.create_task(producer())
        try:
            while True:
                event = await queue.get()
                if event.get("done"):
                    break
                if "error" in event:
                    yield f"data: {json.dumps({'status': 'error', 'message': event['error']})}\n\n"
                    break
                yield f"data: {json.dumps(event, default=str)}\n\n"
        finally:
            await task

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/narrative-arcs", response_model=list[NarrativeArcRead])
async def get_narrative_arcs(session: AsyncSession = Depends(get_session)):
    """List active narrative arcs for dispatch tagging. Auth: none."""
    return await list_active_arcs(session)

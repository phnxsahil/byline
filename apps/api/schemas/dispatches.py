from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from .common import ORMModel


class DispatchCreate(BaseModel):
    project_id: UUID
    arc_id: UUID | None = None
    body: str
    source: str = "manual"
    idempotency_key: str | None = None


class StampState(BaseModel):
    platform: str
    status: str
    draft_id: UUID | None = None
    critic_score: int | None = None
    critic_note: str | None = None


class DispatchRead(ORMModel):
    id: UUID
    project_id: UUID
    project_name: str
    arc_id: UUID | None
    arc_name: str | None
    body: str
    source: str
    is_post_worthy: bool | None
    hold_reason: str | None
    angle: str | None
    suggested_platforms: list[str] | None
    avoid_topics: list[str] | None
    strategist_reasoning: dict | None
    created_at: datetime
    updated_at: datetime
    stamps: list[StampState]


class StampEvent(BaseModel):
    platform: str
    status: str
    draft_id: UUID | None = None
    critic_score: int | None = None
    critic_note: str | None = None


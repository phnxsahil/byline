from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from .common import ORMModel


class DraftRead(ORMModel):
    id: UUID
    dispatch_id: UUID
    platform: str
    body: str
    reddit_title: str | None
    reddit_subreddit: str | None
    generation: int
    critic_score: int | None
    critic_note: str | None
    status: str
    scheduled_at: datetime | None
    posted_at: datetime | None
    created_at: datetime
    updated_at: datetime


class DraftPatch(BaseModel):
    body: str | None = None
    status: str | None = None


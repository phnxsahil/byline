from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from .common import ORMModel


class VoiceProfileRead(ORMModel):
    id: UUID
    platform: str
    body: str
    version: int
    is_active: bool
    generated_at: datetime


class VoiceProfileCreate(BaseModel):
    raw_posts: str
    platform: str = "all"


from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from .common import ORMModel


class VoiceProfileRead(ORMModel):
    id: UUID
    platform: str
    body: str
    version: int
    is_active: bool
    generated_at: datetime


class VoiceProfileCreate(BaseModel):
    raw_posts: str = Field(min_length=1, max_length=50000)
    platform: str = Field(default="all", pattern=r"^(all|linkedin|x|reddit|threads)$")

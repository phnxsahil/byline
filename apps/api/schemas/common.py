from __future__ import annotations

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MilestoneRead(ORMModel):
    id: UUID
    title: str
    description: str | None
    achieved_at: date


class NarrativeArcRead(ORMModel):
    id: UUID
    name: str
    description: str | None
    is_active: bool
    created_at: datetime


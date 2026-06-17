from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from .common import MilestoneRead, ORMModel


class ProjectCreate(BaseModel):
    name: str
    slug: str
    description: str
    problem: str | None = None
    stack: list[str] | None = None
    status: str = "active"
    demo_url: str | None = None
    repo_url: str | None = None
    thumbnail_url: str | None = None


class ProjectRead(ORMModel):
    id: UUID
    name: str
    slug: str
    description: str
    problem: str | None
    stack: list[str] | None
    status: str
    demo_url: str | None
    repo_url: str | None
    thumbnail_url: str | None
    created_at: datetime
    updated_at: datetime


class ProjectDispatchSummary(BaseModel):
    id: UUID
    body: str
    angle: str | None
    created_at: datetime


class ProjectDetail(ProjectRead):
    milestones: list[MilestoneRead]
    recent_dispatches: list[ProjectDispatchSummary]


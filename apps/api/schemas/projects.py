from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from .common import MilestoneRead, ORMModel


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    slug: str = Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", min_length=1, max_length=80)
    description: str = Field(min_length=1, max_length=2000)
    problem: str | None = Field(default=None, max_length=500)
    stack: list[str] | None = None
    status: str = Field(default="active", pattern=r"^(active|paused|archived)$")
    demo_url: str | None = Field(default=None, max_length=2048)
    repo_url: str | None = Field(default=None, max_length=2048)
    thumbnail_url: str | None = Field(default=None, max_length=2048)


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

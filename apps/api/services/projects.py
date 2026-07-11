from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from apps.api.db.models import Dispatch, Milestone, Project
from apps.api.schemas.projects import ProjectCreate


async def list_projects(session: AsyncSession) -> list[Project]:
    result = await session.execute(select(Project).order_by(Project.created_at.asc()))
    return list(result.scalars())


async def create_project(session: AsyncSession, payload: ProjectCreate) -> Project:
    project = Project(**payload.model_dump())
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project


async def get_project_detail(session: AsyncSession, project_id) -> Project | None:
    result = await session.execute(
        select(Project)
        .where(Project.id == project_id)
        .options(selectinload(Project.milestones), selectinload(Project.dispatches))
    )
    return result.scalar_one_or_none()


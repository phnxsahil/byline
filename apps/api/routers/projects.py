from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.session import get_session
from apps.api.schemas.projects import ProjectCreate, ProjectDetail, ProjectDispatchSummary, ProjectRead
from apps.api.services.projects import create_project, get_project_detail, list_projects


router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectRead])
async def get_projects(session: AsyncSession = Depends(get_session)):
    """List all projects for the single-user Byline workspace. Auth: none."""
    return await list_projects(session)


@router.post("", response_model=ProjectRead)
async def post_project(payload: ProjectCreate, session: AsyncSession = Depends(get_session)):
    """Create a project in the single-user Byline workspace. Auth: none."""
    return await create_project(session, payload)


@router.get("/{project_id}", response_model=ProjectDetail)
async def get_project(project_id: UUID, session: AsyncSession = Depends(get_session)):
    """Fetch project detail with milestones and recent dispatches. Auth: none."""
    project = await get_project_detail(session, project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")

    recent_dispatches = sorted(project.dispatches, key=lambda item: item.created_at, reverse=True)[:5]
    return ProjectDetail(
        **ProjectRead.model_validate(project).model_dump(),
        milestones=project.milestones,
        recent_dispatches=[
            ProjectDispatchSummary(id=item.id, body=item.body, angle=item.angle, created_at=item.created_at)
            for item in recent_dispatches
        ],
    )

from __future__ import annotations

import hmac
import hashlib
import re
import asyncio
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, HTTPException, BackgroundTasks
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.config import get_settings
from apps.api.db.session import get_session, get_session_factory
from apps.api.db.models import Project, Dispatch
from apps.api.services.dispatches import create_dispatch
from apps.api.schemas.dispatches import DispatchCreate
from apps.api.services.generation import generate_drafts_for_dispatch

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def normalize_repo_url(url: str | None) -> str:
    if not url:
        return ""
    # strip protocol, git@, and trailing .git
    cleaned = url.strip().lower()
    cleaned = re.sub(r"^(https?://|git@)", "", cleaned)
    cleaned = re.sub(r"^github\.com[:/]", "", cleaned)
    cleaned = re.sub(r"\.git$", "", cleaned)
    return cleaned


def is_post_worthy(commit_msg: str, files_changed: list[str]) -> bool:
    skip = ["chore", "deps", "lint", "format", "typo", "merge", "bump", "wip"]
    post = ["feat", "add", "ship", "launch", "fix", "perf", "release", "implement"]
    msg = commit_msg.lower()
    if any(k in msg for k in skip):
        return False
    if any(k in msg for k in post):
        return True

    # Check significant paths
    sig_paths = [
        f for f in files_changed
        if any(p in f for p in ["pages/", "app/", "components/", "api/"])
    ]
    return len(sig_paths) >= 3


async def verify_github_signature(
    request: Request,
    x_hub_signature_256: str | None = Header(None, alias="X-Hub-Signature-256"),
):
    settings = get_settings()
    if not settings.github_webhook_secret:
        return
    if not x_hub_signature_256:
        raise HTTPException(status_code=401, detail="X-Hub-Signature-256 header missing")
    body = await request.body()
    computed_signature = "sha256=" + hmac.new(
        settings.github_webhook_secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(computed_signature, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="Signature verification failed")


async def run_pipeline_in_background(dispatch_id: UUID):
    async with get_session_factory()() as session:
        try:
            await generate_drafts_for_dispatch(session, dispatch_id)
        except Exception as e:
            # Simple console log fallback
            import sys
            print(f"Error generating drafts for webhook dispatch {dispatch_id}: {e}", file=sys.stderr)


@router.post("/github", dependencies=[Depends(verify_github_signature)])
async def github_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
):
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    repository = payload.get("repository", {})
    repo_url = repository.get("html_url") or repository.get("clone_url") or repository.get("ssh_url")
    if not repo_url:
        raise HTTPException(status_code=400, detail="Repository URL not found in payload")

    # Match repository URL to project
    norm_incoming = normalize_repo_url(repo_url)
    result = await session.execute(select(Project).where(Project.status == "active"))
    projects = result.scalars().all()
    matched_project = None
    for p in projects:
        if p.repo_url and normalize_repo_url(p.repo_url) == norm_incoming:
            matched_project = p
            break

    if not matched_project:
        # Silently ignore webhook if project is not tracked to avoid webhook errors in GitHub
        return {"status": "ignored", "reason": f"No active project found matching repository {repo_url}"}

    commits = payload.get("commits", [])
    post_worthy_commits = []
    for commit in commits:
        commit_msg = commit.get("message", "")
        # Collect all files changed
        files_changed = commit.get("added", []) + commit.get("removed", []) + commit.get("modified", [])
        if is_post_worthy(commit_msg, files_changed):
            post_worthy_commits.append(commit)

    created_dispatches = []
    for commit in post_worthy_commits:
        commit_msg = commit.get("message", "")
        # Extract the first line of the commit message for the dispatch body
        first_line = commit_msg.splitlines()[0] if commit_msg else ""
        body = f"shipped: {first_line}" if not first_line.lower().startswith(("shipped", "feat")) else first_line

        dispatch_payload = DispatchCreate(
            project_id=matched_project.id,
            body=body,
            source="github",
        )
        dispatch = await create_dispatch(session, dispatch_payload)
        created_dispatches.append(str(dispatch.id))

        # Schedule draft generation pipeline in the background
        background_tasks.add_task(run_pipeline_in_background, dispatch.id)

    return {
        "status": "processed",
        "project": matched_project.name,
        "commits_received": len(commits),
        "post_worthy_commits": len(post_worthy_commits),
        "dispatches_created": created_dispatches,
    }

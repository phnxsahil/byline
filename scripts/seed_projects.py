from __future__ import annotations

import asyncio
import json
from pathlib import Path

from sqlalchemy import select

from apps.api.db.models import NarrativeArc, Project
from apps.api.db.session import get_session_factory
ROOT = Path(__file__).resolve().parent.parent
PROJECTS_FILE = ROOT / "scripts" / "projects.json"


async def main() -> None:
    projects = json.loads(PROJECTS_FILE.read_text(encoding="utf-8"))
    async with get_session_factory()() as session:
        for item in projects:
            existing = await session.scalar(select(Project).where(Project.slug == item["slug"]))
            payload = dict(item)
            if existing is None:
                session.add(Project(**payload))
            else:
                for key, value in payload.items():
                    setattr(existing, key, value)

        existing_arcs = await session.scalar(select(NarrativeArc).limit(1))
        if existing_arcs is None:
            session.add_all(
                [
                    NarrativeArc(name="Building Byline in public", description="Feature-by-feature public build log."),
                    NarrativeArc(name="Job search 2026", description="Narrative arc around the search and the work it produces."),
                    NarrativeArc(name="Weekly shipping", description="Compounding product updates across projects."),
                ]
            )
        await session.commit()


if __name__ == "__main__":
    asyncio.run(main())

from __future__ import annotations

import os
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine


_engine: AsyncEngine | None = None


def get_agent_engine() -> AsyncEngine:
    global _engine
    if _engine is None:
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            raise RuntimeError("DATABASE_URL is not configured")
        _engine = create_async_engine(database_url, future=True)
    return _engine


async def fetch_retrieved_context(embedding: list[float]) -> list[dict[str, Any]]:
    vector = "[" + ",".join(f"{value:.6f}" for value in embedding) + "]"
    engine = get_agent_engine()
    async with engine.connect() as connection:
        dispatch_rows = (
            await connection.execute(
                text(
                    """
                    SELECT 'dispatch' AS source, body, angle, created_at
                    FROM dispatches
                    WHERE embedding IS NOT NULL AND deleted_at IS NULL
                    ORDER BY embedding <=> CAST(:embedding AS vector)
                    LIMIT 5
                    """
                ),
                {"embedding": vector},
            )
        ).mappings().all()
        voice_rows = (
            await connection.execute(
                text(
                    """
                    SELECT 'voice_sample' AS source, body, platform, created_at
                    FROM voice_samples
                    WHERE embedding IS NOT NULL AND deleted_at IS NULL
                    ORDER BY embedding <=> CAST(:embedding AS vector)
                    LIMIT 5
                    """
                ),
                {"embedding": vector},
            )
        ).mappings().all()

    return [dict(row) for row in [*dispatch_rows, *voice_rows]]


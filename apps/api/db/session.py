from __future__ import annotations

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from apps.api.config import get_settings


settings = get_settings()
_session_factory: async_sessionmaker[AsyncSession] | None = None


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    global _session_factory
    if _session_factory is None:
        engine = create_async_engine(settings.database_url, future=True, pool_pre_ping=True)
        _session_factory = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    return _session_factory


async def get_session() -> AsyncIterator[AsyncSession]:
    async with get_session_factory()() as session:
        yield session

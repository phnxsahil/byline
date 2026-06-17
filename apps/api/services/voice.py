from __future__ import annotations

from sqlalchemy import desc, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from apps.api.db.models import VoiceProfile, VoiceSample
from apps.api.schemas.voice import VoiceProfileCreate
from packages.agents.llm import call_text_model, embed_text


VOICE_PROFILE_SYSTEM_PROMPT = """
You derive a compact writing profile for a software builder from raw past posts.
Summarize recurring traits, sentence rhythm, hooks, level of technical detail, favorite transitions, and phrases to avoid.
Keep it under 220 words and make it useful as a writer instruction.
Output plain text only.
""".strip()


def _fallback_voice_profile(raw_posts: str) -> str:
    lines = [line.strip() for line in raw_posts.splitlines() if line.strip()]
    sample = lines[:6]
    return (
        "Write like a builder keeping field notes: concrete first, low-hype, technically specific, and direct.\n"
        "Prefer short paragraphs, visible tradeoffs, and real implementation detail over launch language.\n"
        f"Representative lines: {' | '.join(sample) if sample else 'No prior posts supplied.'}"
    )


async def get_active_voice_profile(session: AsyncSession) -> VoiceProfile | None:
    result = await session.execute(
        select(VoiceProfile)
        .where(VoiceProfile.platform == "all", VoiceProfile.is_active.is_(True))
        .order_by(desc(VoiceProfile.generated_at))
        .limit(1)
    )
    return result.scalar_one_or_none()


async def create_or_replace_voice_profile(
    session: AsyncSession, payload: VoiceProfileCreate
) -> VoiceProfile:
    try:
        body = await call_text_model(VOICE_PROFILE_SYSTEM_PROMPT, payload.raw_posts, max_tokens=500)
    except Exception:
        body = _fallback_voice_profile(payload.raw_posts)

    current = await get_active_voice_profile(session)
    if current is not None:
        current.is_active = False
        next_version = current.version + 1
    else:
        next_version = 1

    samples = [chunk.strip() for chunk in payload.raw_posts.split("\n\n") if chunk.strip()]
    for sample in samples:
        session.add(
            VoiceSample(
                platform=payload.platform if payload.platform in {"linkedin", "x", "reddit", "threads"} else "other",
                body=sample,
                embedding=await embed_text(sample),
            )
        )

    profile = VoiceProfile(platform=payload.platform, body=body.strip(), version=next_version, is_active=True)
    session.add(profile)
    await session.commit()
    await session.refresh(profile)
    return profile


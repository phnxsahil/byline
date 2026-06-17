from __future__ import annotations

import json

from packages.agents.constants import Platform
from packages.agents.fallbacks import fallback_critic
from packages.agents.llm import call_json_model
from packages.agents.prompt_loader import load_prompt

from ..state import DispatchState


async def _emit(state: DispatchState, payload: dict) -> None:
    queue = state.get("event_queue")
    if queue is not None:
        await queue.put(payload)


async def _critic(platform: Platform, state: DispatchState) -> dict:
    draft = dict(state["drafts"][platform])
    system_prompt = load_prompt("critic.txt")
    user_prompt = json.dumps(
        {
            "voice_profile": state["voice_profile"],
            "platform": platform,
            "avoid": state["avoid"],
            "milestone": state["dispatch_body"],
            "draft": draft,
        },
        ensure_ascii=False,
        indent=2,
        default=str,
    )

    try:
        result = await call_json_model(system_prompt, user_prompt, max_tokens=600)
    except Exception:
        result = fallback_critic(platform, draft["body"], state["dispatch_body"], state["avoid"])

    score = result.get("overall_score", result.get("score", 0))
    passed = score >= 7 if isinstance(score, (int, float)) else result.get("passed", False)

    draft["critic_score"] = score
    draft["critic_note"] = result.get("note") or (result.get("flags", [None])[0] if result.get("flags") else None)
    draft["critic_passed"] = passed

    if not draft["critic_passed"]:
        await _emit(
            state,
            {
                "platform": platform,
                "status": "flagged",
                "critic_score": draft["critic_score"],
                "critic_note": draft["critic_note"],
            },
        )

    return {"drafts": {platform: draft}}


async def critic_linkedin(state: DispatchState) -> dict:
    return await _critic("linkedin", state)


async def critic_x(state: DispatchState) -> dict:
    return await _critic("x", state)


async def critic_reddit(state: DispatchState) -> dict:
    return await _critic("reddit", state)


async def critic_threads(state: DispatchState) -> dict:
    return await _critic("threads", state)


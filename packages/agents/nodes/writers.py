from __future__ import annotations

from packages.agents.constants import Platform
from packages.agents.fallbacks import (
    fallback_reddit_subreddit,
    fallback_reddit_title,
    fallback_writer,
)
from packages.agents.llm import call_json_model
from packages.agents.prompt_loader import load_prompt
from packages.agents.prompt_safety import build_untrusted_json_prompt

from ..state import DispatchState


async def _emit(state: DispatchState, payload: dict) -> None:
    queue = state.get("event_queue")
    if queue is not None:
        await queue.put(payload)


async def _write(platform: Platform, state: DispatchState) -> dict:
    await _emit(state, {"platform": platform, "status": "writing"})
    prompt_name = f"{platform}_writer.txt"
    system_prompt = load_prompt(prompt_name)
    user_prompt = build_untrusted_json_prompt(
        {
            "milestone": state["dispatch_body"],
            "project_context": state["project"],
            "voice_profile": state["voice_profile"],
            "angle": state["angle"],
            "key_points": state["key_points"],
            "narrative_arc": state.get("narrative_arc"),
            "suggested_hook": state.get("strategist_output", {}).get("suggested_hook"),
        },
    )

    try:
        result = await call_json_model(system_prompt, user_prompt, max_tokens=1200)
    except Exception:
        body = fallback_writer(platform, state["dispatch_body"], state["project"], state["angle"] or "", state["key_points"])
        result = {"content": body.strip(), "body": body.strip(), "char_count": len(body.strip())}

    draft = {
        "critic_score": 0,
        "critic_note": None,
        "critic_passed": False,
    }

    if platform == "linkedin":
        draft["body"] = result.get("content", result.get("body", str(result)))
    elif platform == "x":
        tweets = result.get("tweets", [])
        draft["body"] = "\n\n".join(t["content"] for t in tweets) if tweets else result.get("content", str(result))
    elif platform == "reddit":
        draft["body"] = result.get("body", str(result))
        draft["reddit_title"] = result.get("title") or fallback_reddit_title(state["project"], state["dispatch_body"])
        draft["reddit_subreddit"] = result.get("suggested_subreddit") or fallback_reddit_subreddit(state["angle"] or "")
    elif platform == "threads":
        draft["body"] = result.get("content", result.get("body", str(result)))
    else:
        draft["body"] = result.get("content", str(result))

    await _emit(state, {"platform": platform, "status": "ready"})
    return {"drafts": {platform: draft}}


async def linkedin_writer(state: DispatchState) -> dict:
    return await _write("linkedin", state)


async def x_writer(state: DispatchState) -> dict:
    return await _write("x", state)


async def reddit_writer(state: DispatchState) -> dict:
    return await _write("reddit", state)


async def threads_writer(state: DispatchState) -> dict:
    return await _write("threads", state)

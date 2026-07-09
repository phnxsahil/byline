from __future__ import annotations

from packages.agents.fallbacks import fallback_strategist
from packages.agents.llm import call_json_model
from packages.agents.prompt_loader import load_prompt
from packages.agents.prompt_safety import build_untrusted_json_prompt

from ..state import DispatchState


async def strategist(state: DispatchState) -> dict:
    system_prompt = load_prompt("strategist.txt")
    user_prompt = build_untrusted_json_prompt(
        {
            "milestone": state["dispatch_body"],
            "project_context": state["project"],
            "recent_posts": state["recent_posts"],
            "active_arcs": state["active_arcs"],
            "retrieved_context": state.get("retrieved_context") or [],
            "voice_profile": state["voice_profile"],
        },
    )

    try:
        response = await call_json_model(system_prompt, user_prompt, max_tokens=1000)
    except Exception:
        response = fallback_strategist(
            dispatch_body=state["dispatch_body"],
            project=state["project"],
            active_arcs=state["active_arcs"],
            recent_posts=state["recent_posts"],
        )

    should_post = response.get("should_post", response.get("post_worthy", True))
    platforms = response.get("platforms", response.get("target_platforms", []))
    skip_reason = response.get("skip_reason", response.get("hold_reason"))

    return {
        "strategist_output": response,
        "post_worthy": should_post,
        "hold_reason": skip_reason,
        "angle": response.get("angle"),
        "narrative_arc": response.get("narrative_arc"),
        "target_platforms": [p for p in platforms if p in ("linkedin", "x", "reddit", "threads")],
        "key_points": response.get("key_points", []),
        "avoid": response.get("avoid", []),
    }

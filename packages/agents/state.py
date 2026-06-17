"""
packages/agents/state.py

The single shared state TypedDict that flows through the Byline pipeline.
Nodes receive the full state and return a partial dict with only the keys
they modify — they never mutate the input.
"""

from __future__ import annotations

import asyncio
from typing import Annotated, Any, TypedDict, NotRequired

from .constants import Platform


def merge_drafts(current: dict[str, Any], updates: dict[str, Any]) -> dict[str, Any]:
    """Merge multiple concurrent draft updates into one dict."""
    merged = dict(current)
    for key, value in updates.items():
        if isinstance(value, dict) and key in merged and isinstance(merged[key], dict):
            merged[key].update(value)
        else:
            merged[key] = value
    return merged


class DraftResult(TypedDict):
    body: str
    reddit_title: NotRequired[str | None]
    reddit_subreddit: NotRequired[str | None]
    critic_score: int
    critic_note: str | None
    critic_passed: bool


class DispatchState(TypedDict):
    # ── Inputs (set before pipeline runs) ────────────────────────────────────
    dispatch_id: str
    dispatch_body: str
    project: dict                  # {name, description, stack, status, ...}
    recent_posts: list[dict]       # [{platform, topic, angle, created_at}, ...]
    active_arcs: list[dict]        # [{name, description, recent_topics}, ...]
    voice_profile: str             # structured voice profile text
    event_queue: asyncio.Queue | None  # for SSE streaming, may be None

    # ── Set by embed_and_retrieve ─────────────────────────────────────────────
    retrieved_context: list[dict] | None  # similar past dispatches + voice samples

    # ── Set by strategist ─────────────────────────────────────────────────────
    strategist_output: dict         # raw JSON: {post_worthy_score, should_post, angle, platforms, narrative_arc, suggested_hook, angle_reasoning, skip_reason}
    post_worthy: bool | None
    hold_reason: str | None
    angle: str | None
    narrative_arc: str | None
    target_platforms: list[Platform]
    key_points: list[str]
    avoid: list[str]

    # ── Set by writer + critic nodes ──────────────────────────────────────────
    # Keys are platform names: "linkedin", "x", "reddit", "threads"
    # Uses Annotated with merge_drafts to handle concurrent updates
    drafts: Annotated[dict[Platform, DraftResult], merge_drafts]
    critic_results: dict[str, dict]   # {platform: {overall_score, scores, flags, verdict}}

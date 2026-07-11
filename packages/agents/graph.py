"""
packages/agents/graph.py

The Byline LangGraph pipeline.

Graph shape:
  embed_and_retrieve
        |
    strategist
    /    |    \\    \\
  li    x    rd   th   (conditional fan-out to selected platforms)
    \\    |    /   /
        critic (one per platform draft, in parallel)
        |
    END (state returned to API)

Each writer node emits an event to the passed-in queue so the API can
SSE-stream stamp updates to the frontend as each draft completes.
"""

from __future__ import annotations

import asyncio

from .constants import Platform
from .nodes import (
    critic_linkedin,
    critic_reddit,
    critic_threads,
    critic_x,
    embed_and_retrieve,
    linkedin_writer,
    reddit_writer,
    strategist,
    threads_writer,
    x_writer,
)
from .state import DispatchState

try:
    from langgraph.graph import END, StateGraph
except ModuleNotFoundError:  # pragma: no cover - exercised only in lightweight local fallback mode
    END = "__end__"
    StateGraph = None


def build_graph():
    if StateGraph is None:
        return None

    graph = StateGraph(DispatchState)

    graph.add_node("embed_and_retrieve", embed_and_retrieve)
    graph.add_node("strategist", strategist)
    graph.add_node("linkedin_writer", linkedin_writer)
    graph.add_node("x_writer", x_writer)
    graph.add_node("reddit_writer", reddit_writer)
    graph.add_node("threads_writer", threads_writer)
    graph.add_node("critic_linkedin", critic_linkedin)
    graph.add_node("critic_x", critic_x)
    graph.add_node("critic_reddit", critic_reddit)
    graph.add_node("critic_threads", critic_threads)

    graph.set_entry_point("embed_and_retrieve")
    graph.add_edge("embed_and_retrieve", "strategist")

    graph.add_conditional_edges(
        "strategist",
        route_to_writers,
        {
            "linkedin_writer": "linkedin_writer",
            "x_writer": "x_writer",
            "reddit_writer": "reddit_writer",
            "threads_writer": "threads_writer",
            END: END,
        },
    )

    graph.add_edge("linkedin_writer", "critic_linkedin")
    graph.add_edge("x_writer", "critic_x")
    graph.add_edge("reddit_writer", "critic_reddit")
    graph.add_edge("threads_writer", "critic_threads")

    graph.add_edge("critic_linkedin", END)
    graph.add_edge("critic_x", END)
    graph.add_edge("critic_reddit", END)
    graph.add_edge("critic_threads", END)

    return graph.compile()


def route_to_writers(state: DispatchState) -> list[str]:
    """Return the list of writer node names to run next."""
    if not state.get("post_worthy"):
        return [END]

    platform_to_node: dict[Platform, str] = {
        "linkedin": "linkedin_writer",
        "x": "x_writer",
        "reddit": "reddit_writer",
        "threads": "threads_writer",
    }
    return [platform_to_node[platform] for platform in state.get("target_platforms", []) if platform in platform_to_node]


_compiled_graph = build_graph()


async def _run_without_langgraph(initial_state: DispatchState) -> DispatchState:
    state = dict(initial_state)

    state.update(await embed_and_retrieve(state))
    state.update(await strategist(state))
    if not state.get("post_worthy"):
        return state  # type: ignore[return-value]

    writer_map = {
        "linkedin": linkedin_writer,
        "x": x_writer,
        "reddit": reddit_writer,
        "threads": threads_writer,
    }
    critic_map = {
        "linkedin": critic_linkedin,
        "x": critic_x,
        "reddit": critic_reddit,
        "threads": critic_threads,
    }

    for platform in state.get("target_platforms", []):
        writer = writer_map[platform]
        writer_result = await writer(state)  # type: ignore[arg-type]
        state["drafts"] = {**state["drafts"], **writer_result["drafts"]}
        critic = critic_map[platform]
        critic_result = await critic(state)  # type: ignore[arg-type]
        state["drafts"] = {**state["drafts"], **critic_result["drafts"]}

    return state  # type: ignore[return-value]


async def run_pipeline(
    dispatch_id: str,
    dispatch_body: str,
    project: dict,
    recent_posts: list[dict],
    active_arcs: list[dict],
    voice_profile: str,
    event_queue: asyncio.Queue | None = None,
) -> DispatchState:
    """Run the full generation pipeline for one dispatch."""
    initial_state: DispatchState = {
        "dispatch_id": dispatch_id,
        "dispatch_body": dispatch_body,
        "project": project,
        "recent_posts": recent_posts,
        "active_arcs": active_arcs,
        "voice_profile": voice_profile,
        "event_queue": event_queue,
        "retrieved_context": None,
        "post_worthy": None,
        "hold_reason": None,
        "angle": None,
        "narrative_arc": None,
        "target_platforms": [],
        "key_points": [],
        "avoid": [],
        "drafts": {},
    }

    if _compiled_graph is None:
        return await _run_without_langgraph(initial_state)
    return await _compiled_graph.ainvoke(initial_state)

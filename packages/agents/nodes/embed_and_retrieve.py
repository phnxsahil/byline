from __future__ import annotations

from packages.agents.llm import embed_text
from packages.agents.store import fetch_retrieved_context

from ..state import DispatchState


async def embed_and_retrieve(state: DispatchState) -> dict:
    embedding = await embed_text(state["dispatch_body"])
    try:
        retrieved_context = await fetch_retrieved_context(embedding)
    except Exception:
        retrieved_context = []
    return {"retrieved_context": retrieved_context}


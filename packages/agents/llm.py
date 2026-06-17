from __future__ import annotations

import hashlib
import json
import os
from typing import Any

def _extract_json_block(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found in LLM response")
    return json.loads(cleaned[start : end + 1])


async def _call_anthropic(system_prompt: str, user_prompt: str, max_tokens: int) -> str | None:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return None
    try:
        from anthropic import AsyncAnthropic
        client = AsyncAnthropic(api_key=api_key)
        response = await client.messages.create(
            model="claude-sonnet-4-6",
            system=system_prompt,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": user_prompt}],
        )
        parts = [part.text for part in response.content if getattr(part, "type", None) == "text"]
        return "".join(parts).strip()
    except Exception:
        return None


async def _call_gemini(system_prompt: str, user_prompt: str, max_tokens: int) -> str | None:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{system_prompt}\n\n{user_prompt}",
            config={"max_output_tokens": max_tokens},
        )
        return response.text.strip()
    except Exception:
        return None


async def call_text_model(system_prompt: str, user_prompt: str, max_tokens: int = 1200) -> str:
    result = await _call_anthropic(system_prompt, user_prompt, max_tokens)
    if result is not None:
        return result
    result = await _call_gemini(system_prompt, user_prompt, max_tokens)
    if result is not None:
        return result
    raise RuntimeError("No LLM provider configured. Set ANTHROPIC_API_KEY or GEMINI_API_KEY in .env")


async def call_json_model(system_prompt: str, user_prompt: str, max_tokens: int = 1200) -> dict[str, Any]:
    text = await call_text_model(system_prompt=system_prompt, user_prompt=user_prompt, max_tokens=max_tokens)
    return _extract_json_block(text)


async def embed_text(text: str) -> list[float]:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=api_key)
            response = await client.embeddings.create(model="text-embedding-3-small", input=text)
            return response.data[0].embedding
        except Exception:
            pass

    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values: list[float] = []
    seed = digest * (1536 // len(digest) + 1)
    for index in range(1536):
        byte = seed[index]
        values.append((byte / 255.0) * 2.0 - 1.0)
    return values

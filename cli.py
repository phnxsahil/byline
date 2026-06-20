#!/usr/bin/env python3
"""
Byline CLI — Phase 0

Usage:
    python cli.py log <milestone> [--project <slug>]
    python cli.py projects

Log a milestone → get 4 platform drafts with critic scores.

Examples:
    python cli.py log "shipped semantic search on fltrd.tech using pgvector"
    python cli.py log "fixed a nasty n+1 bug in the RAG pipeline" --project miryn
    python cli.py projects
"""

import asyncio
import json
import sys
import time

import httpx

API_BASE = "http://localhost:8000"


async def list_projects() -> list[dict]:
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{API_BASE}/projects")
        r.raise_for_status()
        return r.json()


async def list_narrative_arcs() -> list[dict]:
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{API_BASE}/narrative-arcs")
        r.raise_for_status()
        return r.json()


async def create_dispatch(project_id: str, body: str, arc_id: str | None = None) -> dict:
    async with httpx.AsyncClient(timeout=30.0) as c:
        payload = {"project_id": project_id, "body": body, "source": "cli"}
        if arc_id:
            payload["arc_id"] = arc_id
        r = await c.post(f"{API_BASE}/dispatches", json=payload)
        r.raise_for_status()
        return r.json()


async def trigger_generation(dispatch_id: str) -> None:
    async with httpx.AsyncClient(timeout=120.0) as c:
        async with c.stream("GET", f"{API_BASE}/dispatches/{dispatch_id}/generate") as resp:
            async for line in resp.aiter_lines():
                if not line.startswith("data: "):
                    continue
                data = json.loads(line[6:])
                if data.get("done"):
                    break
                if data.get("status") == "writing":
                    print(f"  [{data['platform']}] generating...")
                elif data.get("status") == "ready":
                    print(f"  [{data['platform']}] draft complete")
                elif data.get("status") == "flagged":
                    print(f"  [{data['platform']}] flagged (score: {data.get('critic_score', '?')})")
                elif data.get("status") == "error":
                    print(f"  [error] {data.get('message', 'unknown error')}")
                    return


async def fetch_drafts(dispatch_id: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30.0) as c:
        r = await c.get(f"{API_BASE}/dispatches/{dispatch_id}/drafts")
        r.raise_for_status()
        return r.json()


async def cmd_projects() -> None:
    projects = await list_projects()
    print("\nProjects:")
    print(f"{'slug':<20} {'name':<20} {'status':<10}")
    print("-" * 50)
    for p in projects:
        print(f"{p['slug']:<20} {p['name']:<20} {p['status']:<10}")
    print()


async def cmd_log(milestone: str, project_slug: str | None) -> None:
    projects = await list_projects()
    if not projects:
        print("error: no projects found in database. seed them first.")
        sys.exit(1)

    if project_slug:
        project = next((p for p in projects if p["slug"] == project_slug), None)
        if not project:
            print(f"error: project '{project_slug}' not found")
            sys.exit(1)
    else:
        project = projects[0]

    arcs = await list_narrative_arcs()
    arc_id = arcs[0]["id"] if arcs else None

    print(f"\n  project: {project['name']}")
    print(f"  arc:     {arcs[0]['name'] if arcs else 'none'}")
    print(f"  body:    {milestone}")
    print()

    print("[dispatch] creating...")
    dispatch = await create_dispatch(str(project["id"]), milestone, arc_id)
    dispatch_id = dispatch["id"]
    print(f"[dispatch] created: {dispatch_id}")
    print()

    print("[pipeline] running agents...")
    await trigger_generation(dispatch_id)
    print()

    print("[pipeline] fetching drafts...")
    drafts = await fetch_drafts(dispatch_id)
    print()

    if not drafts:
        print("no drafts were generated (strategist may have held it).")
        print(f"  reason: {dispatch.get('hold_reason', 'not specified')}")
        return

    for draft in drafts:
        platform = draft["platform"].upper()
        score = draft.get("critic_score")
        status = draft["status"]
        body = draft["body"]
        reddit_title = draft.get("reddit_title")

        print(f"{'='*55}")
        print(f"  PLATFORM: {platform}")
        print(f"  CRITIC:   {score}/10 ({status})")
        if draft.get("critic_note"):
            print(f"  NOTE:     {draft['critic_note']}")
        print(f"{'='*55}")
        if reddit_title:
            print(f"  Title: {reddit_title}")
            print()
        print(body)
        print()

    print(f"{'='*55}")
    print("  done. copy-paste to platforms manually.")
    print()


async def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    command = sys.argv[1]

    if command == "projects":
        await cmd_projects()
    elif command == "log":
        project_slug = None
        args = sys.argv[2:]
        parsed_args = []
        i = 0
        while i < len(args):
            if args[i] == "--project" and i + 1 < len(args):
                project_slug = args[i + 1]
                i += 2
            else:
                parsed_args.append(args[i])
                i += 1
        milestone = " ".join(parsed_args)
        if not milestone:
            print("error: milestone text is required")
            print(__doc__)
            sys.exit(1)
        await cmd_log(milestone, project_slug)
    else:
        print(f"unknown command: {command}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())

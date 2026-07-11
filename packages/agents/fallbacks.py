from __future__ import annotations

from textwrap import shorten

from .constants import ALL_PLATFORMS, Platform


def fallback_strategist(
    dispatch_body: str,
    project: dict,
    active_arcs: list[dict],
    recent_posts: list[dict],
) -> dict:
    lowered = dispatch_body.lower()
    if len(dispatch_body.strip()) < 18:
        return {
            "should_post": False,
            "skip_reason": "Too small to stand alone. Batch it with a larger milestone.",
            "angle": "build in public update",
            "narrative_arc": active_arcs[0]["name"] if active_arcs else None,
            "platforms": [],
            "key_points": [dispatch_body.strip()],
            "avoid": [],
            "post_worthy_score": 2,
            "angle_reasoning": "Too short to determine angle.",
            "suggested_hook": None,
        }

    angle = "technical_deep_dive"
    if any(token in lowered for token in ("learned", "mistake", "bug", "debug", "fixed")):
        angle = "lesson_learned"
    elif any(token in lowered for token in ("launched", "release", "users", "stars", "%", "revenue", "latency")):
        angle = "milestone"

    avoid = []
    for post in recent_posts[:3]:
        if post.get("angle"):
            avoid.append(f"Repeating the angle '{post['angle']}' too literally")

    return {
        "should_post": True,
        "skip_reason": None,
        "angle": angle,
        "narrative_arc": active_arcs[0]["name"] if active_arcs else None,
        "platforms": list(ALL_PLATFORMS),
        "key_points": [
            shorten(dispatch_body.strip(), width=120, placeholder="..."),
            f"Project: {project.get('name', 'Byline')}",
            f"Status: {project.get('status', 'active')}",
        ],
        "avoid": avoid,
        "post_worthy_score": 8,
        "angle_reasoning": "The dispatch contains enough specific detail to warrant a post.",
        "suggested_hook": shorten(dispatch_body.strip(), width=80, placeholder="..."),
    }


def fallback_writer(platform: Platform, dispatch_body: str, project: dict, angle: str, key_points: list[str]) -> str:
    project_name = project.get("name", "Byline")
    lead = key_points[0] if key_points else shorten(dispatch_body.strip(), width=120, placeholder="...")

    if platform == "linkedin":
        return (
            f"{project_name} just turned a raw build log into a sharper publishing loop.\n\n"
            f"{lead}\n\n"
            f"Angle: {angle}. What mattered here was taking a messy implementation detail and turning it into something worth sharing without sanding off the specifics.\n\n"
            f"I'm keeping the writeup grounded in the actual work instead of the usual launch-language gloss."
        )
    if platform == "x":
        return f"{lead}\n\n{project_name} update: {angle}. Still optimizing the boring parts because those are the parts people actually feel."
    if platform == "reddit":
        return (
            f"I hit this while working on {project_name}: {dispatch_body.strip()}\n\n"
            f"The useful part for me was how the constraint changed the implementation path. Happy to dig into the tradeoffs if anyone's solving something similar."
        )
    return f"worked on {project_name.lower()} today. {lead.lower()} still tuning the rough edges, but the shape is finally starting to feel right."


def fallback_reddit_title(project: dict, dispatch_body: str) -> str:
    return f"What changed while building {project.get('name', 'this project')}: {shorten(dispatch_body, width=70, placeholder='...')}"


def fallback_reddit_subreddit(angle: str) -> str:
    if angle == "technical deep-dive":
        return "r/webdev"
    return "r/SideProject"


def fallback_critic(platform: Platform, draft_body: str, dispatch_body: str, avoid: list[str]) -> dict:
    score = 8
    note = None
    flags = []

    if len(draft_body.strip()) < 40:
        score = 6
        flags.append("Open stronger and add one concrete implementation detail.")
    elif any(fragment.lower() in draft_body.lower() for fragment in avoid):
        score = 6
        flags.append("Cut the repeated framing and lead with the new detail.")
    elif platform == "reddit" and "happy to dig into" not in draft_body.lower():
        score = 7
        flags.append("Make the Reddit ending more discussion-first and less presentational.")

    return {
        "overall_score": score,
        "passed": score >= 7,
        "scores": {
            "clarity": 2 if draft_body.count("\n") < 3 else 3,
            "voice_match": 2,
            "hook_strength": 1 if len(draft_body) < 40 else 2,
            "platform_fit": 2 if platform == "x" and len(draft_body) > 280 else 3,
        },
        "flags": flags,
        "ai_slop_detected": False,
        "verdict": "approve" if score >= 7 else "flag",
        "self_promo_risk": "low",
        "note": note or (flags[0] if flags else None),
    }


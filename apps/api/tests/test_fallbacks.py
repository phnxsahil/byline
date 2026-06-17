from packages.agents.fallbacks import fallback_critic, fallback_strategist, fallback_writer


def test_fallback_strategist_marks_real_dispatch_post_worthy():
    result = fallback_strategist(
        dispatch_body="Shipped pgvector retrieval for dispatch memory and cut bad drafts in half.",
        project={"name": "Dispatch", "status": "active"},
        active_arcs=[{"name": "Building Dispatch in public"}],
        recent_posts=[],
    )
    assert result["post_worthy"] is True
    assert "linkedin" in result["target_platforms"]


def test_fallback_writer_produces_platform_specific_output():
    linkedin = fallback_writer("linkedin", "Shipped a new retrieval layer.", {"name": "Dispatch"}, "technical deep-dive", ["Shipped a new retrieval layer."])
    threads = fallback_writer("threads", "Shipped a new retrieval layer.", {"name": "Dispatch"}, "technical deep-dive", ["Shipped a new retrieval layer."])
    assert "Dispatch" in linkedin
    assert "today" in threads or "worked on" in threads


def test_fallback_critic_flags_short_copy():
    result = fallback_critic("linkedin", "too short", "too short", [])
    assert result["passed"] is False
    assert result["score"] < 7

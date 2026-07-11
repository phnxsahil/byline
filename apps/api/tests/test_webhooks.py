from __future__ import annotations

import pytest
from apps.api.routers.webhooks import normalize_repo_url, is_post_worthy


def test_normalize_repo_url():
    assert normalize_repo_url("https://github.com/sahil/fltrd") == "sahil/fltrd"
    assert normalize_repo_url("https://github.com/sahil/fltrd.git") == "sahil/fltrd"
    assert normalize_repo_url("git@github.com:sahil/fltrd.git") == "sahil/fltrd"
    assert normalize_repo_url("http://github.com/sahil/fltrd.git") == "sahil/fltrd"
    assert normalize_repo_url("") == ""
    assert normalize_repo_url(None) == ""


def test_is_post_worthy():
    # skip keywords
    assert is_post_worthy("chore: update readme", ["app/page.tsx"]) is False
    assert is_post_worthy("wip on login flow", ["app/page.tsx"]) is False

    # post keywords
    assert is_post_worthy("feat: added new search endpoint", []) is True
    assert is_post_worthy("fix: login button alignment", []) is True
    assert is_post_worthy("perf: optimized queries", []) is True

    # file count triggers (>= 3 pages/app/components/api)
    assert is_post_worthy("changed some files", ["app/page.tsx", "components/Button.tsx", "api/routes.py"]) is True
    assert is_post_worthy("changed some files", ["app/page.tsx", "components/Button.tsx", "README.md"]) is False

from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4
from datetime import datetime
from fastapi.testclient import TestClient

from apps.api.main import app
from apps.api.db.session import get_session
from apps.api.services.posting import reddit_guardrail
from apps.api.db.models import Draft, Outlet

client = TestClient(app)


def test_reddit_guardrail():
    assert reddit_guardrail("this is a lesson on how to structure a fastapi router.", "fastapi tutorial") is True
    assert reddit_guardrail("check out my new cool saas product!", "launched product") is False
    assert reddit_guardrail("you can try my app now.", "try it") is False
    assert reddit_guardrail("sign up on the landing page.", "byline sign up") is False


def test_posting_mock_linkedin():
    # Setup mock objects with all required schema fields
    mock_draft = Draft(
        id=uuid4(),
        dispatch_id=uuid4(),
        platform="linkedin",
        body="Test LinkedIn post content",
        status="draft",
        generation=1,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    mock_outlet = Outlet(
        platform="linkedin",
        is_connected=False,
    )

    # Setup mock session
    mock_session = AsyncMock()
    mock_session.get.return_value = mock_draft
    
    # Use MagicMock for synchronous query results returned by execute
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_outlet
    mock_session.execute.return_value = mock_result

    # Mock refresh to avoid leaving defaults unassigned
    async def mock_refresh(instance):
        pass
    mock_session.refresh = mock_refresh

    async def override_get_session():
        yield mock_session

    # Apply dependency override
    app.dependency_overrides[get_session] = override_get_session

    try:
        response = client.patch(f"/drafts/{mock_draft.id}", json={"status": "approved"})
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "posted"
        assert mock_draft.composio_post_id.startswith("mock-linkedin-post-")
        mock_session.commit.assert_called()
    finally:
        app.dependency_overrides.clear()


def test_posting_reddit_guardrail_blocking():
    # Setup mock objects with all required schema fields
    mock_draft = Draft(
        id=uuid4(),
        dispatch_id=uuid4(),
        platform="reddit",
        body="Check out my new app called Byline, sign up here!",
        reddit_title="Launched Byline",
        reddit_subreddit="SideProject",
        status="draft",
        generation=1,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    
    mock_outlet = Outlet(
        platform="reddit",
        is_connected=False,
    )

    # Setup mock session
    mock_session = AsyncMock()
    mock_session.get.return_value = mock_draft
    
    # Use MagicMock for synchronous query results returned by execute
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_outlet
    mock_session.execute.return_value = mock_result

    async def override_get_session():
        yield mock_session

    # Apply dependency override
    app.dependency_overrides[get_session] = override_get_session

    try:
        response = client.patch(f"/drafts/{mock_draft.id}", json={"status": "approved"})
        assert response.status_code == 400
        assert "Reddit promotional guardrail triggered" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()

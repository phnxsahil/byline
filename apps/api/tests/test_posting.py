from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, patch
from uuid import uuid4
from fastapi.testclient import TestClient

from apps.api.main import app
from apps.api.services.posting import reddit_guardrail
from apps.api.db.models import Draft

client = TestClient(app)


def test_reddit_guardrail():
    assert reddit_guardrail("this is a lesson on how to structure a fastapi router.", "fastapi tutorial") is True
    assert reddit_guardrail("check out my new cool saas product!", "launched product") is False
    assert reddit_guardrail("you can try my app now.", "try it") is False
    assert reddit_guardrail("sign up on the landing page.", "byline sign up") is False


def test_posting_mock_linkedin():
    # Test linkedin mock posting (when outlet is not connected)
    # We patch the DB get and execute calls to simulate loading the draft and outlet
    with patch("apps.api.services.posting.session.get") as mock_get, \
         patch("apps.api.services.posting.session.execute") as mock_execute:
        
        # Mock Draft
        mock_draft = Draft(
            id=uuid4(),
            platform="linkedin",
            body="Test LinkedIn post content",
            status="draft",
        )
        mock_get.return_value = mock_draft

        # Mock Outlet (not connected)
        mock_outlet_result = AsyncMock()
        mock_outlet_result.scalar_one_or_none.return_value = None
        mock_execute.return_value = mock_outlet_result

        # Run patch route
        with patch("apps.api.routers.drafts.patch_draft") as mock_patch_draft, \
             patch("apps.api.services.posting.session.commit") as mock_commit, \
             patch("apps.api.services.posting.session.refresh") as mock_refresh:
            
            mock_patch_draft.return_value = mock_draft
            
            # Request update to approved status
            response = client.patch(f"/drafts/{mock_draft.id}", json={"status": "approved"})
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "posted"
            assert mock_draft.composio_post_id.startswith("mock-linkedin-post-")


def test_posting_reddit_guardrail_blocking():
    # Test reddit guardrail rejection in the endpoint update
    with patch("apps.api.services.posting.session.get") as mock_get, \
         patch("apps.api.services.posting.session.execute") as mock_execute:
        
        # Mock promotional Reddit Draft
        mock_draft = Draft(
            id=uuid4(),
            platform="reddit",
            body="Check out my new app called Byline, sign up here!",
            reddit_title="Launched Byline",
            status="draft",
        )
        mock_get.return_value = mock_draft

        # Mock Outlet (not connected)
        mock_outlet_result = AsyncMock()
        mock_outlet_result.scalar_one_or_none.return_value = None
        mock_execute.return_value = mock_outlet_result

        with patch("apps.api.routers.drafts.patch_draft") as mock_patch_draft:
            mock_patch_draft.return_value = mock_draft
            
            # Request update to approved status (should trigger 400 validation error)
            response = client.patch(f"/drafts/{mock_draft.id}", json={"status": "approved"})
            assert response.status_code == 400
            assert "Reddit promotional guardrail triggered" in response.json()["detail"]

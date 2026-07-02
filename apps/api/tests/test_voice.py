from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4
from datetime import datetime
from fastapi.testclient import TestClient

from apps.api.main import app
from apps.api.config import get_settings
from apps.api.db.session import get_session

client = TestClient(app)


def test_extract_voice_profile_fallback():
    # Mock session to avoid real DB access
    mock_session = AsyncMock()
    # get_active_voice_profile returns None via MagicMock execute result
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_execute_result

    # Custom mock refresh to populate database generated defaults
    async def mock_refresh(instance):
        instance.id = uuid4()
        instance.generated_at = datetime.now()
        instance.updated_at = datetime.now()

    mock_session.refresh = mock_refresh

    async def override_get_session():
        yield mock_session

    app.dependency_overrides[get_session] = override_get_session

    try:
        payload = {
            "raw_posts": "shipped a new feature today.\nit was fun.",
            "platform": "all"
        }
        response = client.post("/voice-profile/extract", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["platform"] == "all"
        assert "Representative lines" in data["body"]
        mock_session.commit.assert_called()
    finally:
        app.dependency_overrides.clear()


@patch("openai.resources.audio.transcriptions.AsyncTranscriptions.create", new_callable=AsyncMock)
def test_post_voice_note_mocked_whisper(mock_whisper_create):
    # Mock Whisper transcription response
    from unittest.mock import MagicMock
    mock_response = MagicMock()
    mock_response.text = "this is a mocked transcription from whisper"
    mock_whisper_create.return_value = mock_response

    # Force OpenAI key settings
    settings = get_settings()
    original_key = settings.openai_api_key
    settings.openai_api_key = "mocked_key"

    # Setup mock session to avoid real DB access
    mock_session = AsyncMock()
    
    # Mock create_dispatch to return a mock dispatch
    mock_dispatch = MagicMock()
    mock_dispatch.id = uuid4()

    async def override_get_session():
        yield mock_session

    app.dependency_overrides[get_session] = override_get_session

    try:
        project_id = str(uuid4())

        with patch("apps.api.routers.voice.create_dispatch", new_callable=AsyncMock) as mock_create_dispatch, \
             patch("apps.api.routers.voice.run_pipeline_in_background", new_callable=AsyncMock) as mock_run_pipeline:
            mock_create_dispatch.return_value = mock_dispatch

            files = {"file": ("test.mp3", b"dummy_audio_bytes", "audio/mpeg")}
            data = {"project_id": project_id}

            response = client.post("/voice", data=data, files=files)
            assert response.status_code == 200
            json_data = response.json()
            assert json_data["status"] == "processed"
            assert json_data["transcription"] == "this is a mocked transcription from whisper"
    finally:
        settings.openai_api_key = original_key
        app.dependency_overrides.clear()

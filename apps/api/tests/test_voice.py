from __future__ import annotations

import pytest
from unittest.mock import AsyncMock, patch
from uuid import uuid4
from fastapi.testclient import TestClient

from apps.api.main import app
from apps.api.config import get_settings

client = TestClient(app)


def test_extract_voice_profile_fallback():
    # Verify extraction route works and hits fallback if model fails
    payload = {
        "raw_posts": "shipped a new feature today.\nit was fun.",
        "platform": "all"
    }
    response = client.post("/voice-profile/extract", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "all"
    assert "Representative lines" in data["body"]


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

    try:
        # Create a dummy project UUID
        project_id = str(uuid4())

        # Mock the create_dispatch function to avoid DB connection issues in simple unit test
        with patch("apps.api.routers.voice.create_dispatch") as mock_create_dispatch:
            mock_dispatch = AsyncMock()
            mock_dispatch.id = uuid4()
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

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

from fastapi.testclient import TestClient

from apps.api.db.session import get_session
from apps.api.main import app


client = TestClient(app, raise_server_exceptions=False)


def test_projects_returns_json_when_database_is_unavailable():
    async def override_get_session():
        yield AsyncMock()

    app.dependency_overrides[get_session] = override_get_session

    try:
        with patch("apps.api.routers.projects.list_projects", new_callable=AsyncMock) as mock_list_projects:
            mock_list_projects.side_effect = ConnectionRefusedError("db offline")

            response = client.get("/projects")

        assert response.status_code == 503
        assert response.json() == {
            "error": {
                "code": "database_unavailable",
                "message": "Database connection failed. Check DATABASE_URL and ensure PostgreSQL is running.",
                "path": "/projects",
            }
        }
    finally:
        app.dependency_overrides.clear()


@patch("openai.resources.audio.transcriptions.AsyncTranscriptions.create", new_callable=AsyncMock)
def test_voice_returns_json_when_dispatch_save_hits_database_error(mock_whisper_create):
    mock_response = MagicMock()
    mock_response.text = "transcribed milestone"
    mock_whisper_create.return_value = mock_response

    settings_patch = MagicMock()
    settings_patch.openai_api_key = "test-key"

    async def override_get_session():
        yield AsyncMock()

    app.dependency_overrides[get_session] = override_get_session

    try:
        with patch("apps.api.routers.voice.get_settings", return_value=settings_patch), patch(
            "apps.api.routers.voice.create_dispatch",
            new_callable=AsyncMock,
        ) as mock_create_dispatch:
            mock_create_dispatch.side_effect = ConnectionRefusedError("db offline")

            response = client.post(
                "/voice",
                data={"project_id": str(uuid4())},
                files={"file": ("voice.webm", b"dummy_audio", "audio/webm")},
            )

        assert response.status_code == 503
        assert response.json() == {
            "error": {
                "code": "database_unavailable",
                "message": "Database connection failed. Check DATABASE_URL and ensure PostgreSQL is running.",
                "path": "/voice",
            }
        }
    finally:
        app.dependency_overrides.clear()

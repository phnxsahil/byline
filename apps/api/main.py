from pathlib import Path
import logging
import traceback

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from apps.api.config import get_settings
from apps.api.routers import dispatches, drafts, outlets, projects, voice, webhooks


settings = get_settings()
app = FastAPI(title="Byline API", version="0.1.0")
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(dispatches.router)
app.include_router(drafts.router)
app.include_router(voice.router)
app.include_router(voice.voice_router)
app.include_router(outlets.router)
app.include_router(webhooks.router)


def _exception_chain(exc: BaseException):
    current: BaseException | None = exc
    seen: set[int] = set()
    while current is not None and id(current) not in seen:
        yield current
        seen.add(id(current))
        current = current.__cause__ or current.__context__


@app.exception_handler(Exception)
async def handle_unexpected_exception(request: Request, exc: Exception):
    logger.error("Unhandled API exception on %s %s\n%s", request.method, request.url.path, traceback.format_exc())

    is_database_error = any(
        isinstance(err, (ConnectionRefusedError, SQLAlchemyError))
        for err in _exception_chain(exc)
    )

    if is_database_error:
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "database_unavailable",
                    "message": "Database connection failed. Check DATABASE_URL and ensure PostgreSQL is running.",
                    "path": request.url.path,
                }
            },
        )

    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "internal_server_error",
                "message": "An unexpected server error occurred.",
                "path": request.url.path,
            }
        },
    )


@app.get("/healthz")
async def healthcheck():
    return {"status": "ok"}


BYLINE_DIST = Path(__file__).resolve().parent.parent.parent / "byline" / "dist"


@app.get("/")
async def serve_byline():
    return FileResponse(BYLINE_DIST / "index.html")


@app.get("/robots.txt")
async def serve_robots():
    return FileResponse(BYLINE_DIST / "robots.txt", media_type="text/plain")


@app.get("/assets/{asset_path:path}")
async def serve_assets(asset_path: str):
    return FileResponse(BYLINE_DIST / "assets" / asset_path)

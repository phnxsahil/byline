from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from apps.api.config import get_settings
from apps.api.routers import dispatches, drafts, outlets, projects, voice


settings = get_settings()
app = FastAPI(title="Byline API", version="0.1.0")

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
app.include_router(outlets.router)


@app.get("/healthz")
async def healthcheck():
    return {"status": "ok"}


BYLINE_DIST = Path(__file__).resolve().parent.parent.parent / "byline" / "dist"


@app.get("/")
async def serve_byline():
    return FileResponse(BYLINE_DIST / "index.html")


@app.get("/assets/{asset_path:path}")
async def serve_assets(asset_path: str):
    return FileResponse(BYLINE_DIST / "assets" / asset_path)


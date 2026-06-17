from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apps.api.config import get_settings
from apps.api.routers import dispatches, drafts, projects, voice


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


@app.get("/healthz")
async def healthcheck():
    return {"status": "ok"}


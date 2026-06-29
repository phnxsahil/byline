from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = Field(
        default="postgresql+asyncpg://byline:byline@localhost:5432/byline",
        alias="DATABASE_URL",
    )
    anthropic_api_key: str | None = Field(default=None, alias="ANTHROPIC_API_KEY")
    openai_api_key: str | None = Field(default=None, alias="OPENAI_API_KEY")
    gemini_api_key: str | None = Field(default=None, alias="GEMINI_API_KEY")
    github_webhook_secret: str | None = Field(default=None, alias="GITHUB_WEBHOOK_SECRET")
    byline_allowed_origins: str = Field(default="*", alias="BYLINE_ALLOWED_ORIGINS")

    @property
    def allowed_origins(self) -> list[str]:
        if self.byline_allowed_origins.strip() == "*":
            return ["*"]
        return [item.strip() for item in self.byline_allowed_origins.split(",") if item.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

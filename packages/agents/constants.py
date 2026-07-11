from typing import Literal

Platform = Literal["linkedin", "x", "reddit", "threads"]

ALL_PLATFORMS: tuple[Platform, ...] = ("linkedin", "x", "reddit", "threads")

PLATFORM_LABELS: dict[Platform, str] = {
    "linkedin": "LI",
    "x": "X",
    "reddit": "RD",
    "threads": "TH",
}


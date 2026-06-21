"""Read every source file in the Byline project and dump into byline-code.json with full source code."""

import json
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

# Files to skip (binaries, generated, large node_modules, etc.)
SKIP_DIRS = {
    "__pycache__", ".git", ".pytest_cache", "node_modules", "dist",
    ".vite", "test-results", "__pycache__", ".agents",
}
SKIP_EXTS = {".pyc", ".pyo", ".lock", ".svg"}
SKIP_FILES = {
    "package-lock.json", "pnpm-lock.yaml", "tmp.json", "byline-code.json",
}

def should_skip(p: Path) -> bool:
    for part in p.parts:
        if part in SKIP_DIRS:
            return True
    if p.suffix in SKIP_EXTS:
        return True
    if p.name in SKIP_FILES:
        return True
    return False

SOURCE_EXTS = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".css", ".html", ".json", ".yaml", ".yml", ".toml",
    ".txt", ".sql", ".md", ".env.example", ".gitignore",
}

files = {}

# Walk the project
for root, dirs, filenames in os.walk(BASE):
    root_p = Path(root)
    # Prune skip dirs
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

    for fn in sorted(filenames):
        fp = root_p / fn
        if should_skip(fp):
            continue
        if fp.suffix not in SOURCE_EXTS and fn not in (".env.example", ".gitignore"):
            continue

        rel = fp.relative_to(BASE)
        try:
            content = fp.read_text(encoding="utf-8")
        except Exception as e:
            content = f"// ERROR reading file: {e}"

        files[str(rel).replace("\\", "/")] = content

# Remove non-essential / large generated files
KEEP_EXTS = {".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".css", ".html", ".json", ".yaml", ".yml", ".toml", ".txt", ".sql", ".md", ".env.example", ".gitignore"}
SKIP_LARGE = {"index.html", "landing-v3.html", "byline_dashboard_ux_critique.html", "default_shadcn_theme.css"}
SKIP_DOCS = {"AGENTS.md", "HANDBOOK (1).md", "README.md", "BYLINE_SPEC.md", "BYLINE-DASHBOARD.md", "PROJECT.md", "ATTRIBUTIONS.md", "byline-frontend-prompts.md", "byline-v2-spec.md"}

pruned = {}
for path, content in files.items():
    # Skip large HTML docs, markdown docs, debug scripts
    name = path.rsplit("/", 1)[-1] if "/" in path else path
    if name in SKIP_LARGE or name in SKIP_DOCS:
        continue
    # Skip debug scripts and zip/generated files
    if any(dbg in path for dbg in ("debug_", "fix_", "verify_", "format_", "strip_", "tmp_")):
        continue
    if path.startswith("screenshots/") or path.startswith("lovable-project/") or path.startswith("dispatch-md-"):
        continue
    if "node_modules" in path or ".vite" in path:
        continue
    pruned[path] = content

# Build compact output
output = {
    "project": {
        "name": "Byline",
        "description": "Open-source multi-agent content engine for developer-founders",
        "domain": "byline.so",
        "license": "MIT",
    },
    "files": pruned,
}

out_path = BASE / "byline-code.json"
out_path.write_text(json.dumps(output, ensure_ascii=False), encoding="utf-8")

print(f"Wrote {len(pruned)} files ({sum(len(v) for v in pruned.values()):,} chars) to {out_path}")
print(f"Removed {len(files) - len(pruned)} non-essential files")

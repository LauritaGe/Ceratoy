from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
POSTS_DIR = ROOT / "content" / "posts"
IMAGES_DIR = ROOT / "web" / "public" / "images"
AGENTS_DIR = ROOT / "agents"
PROMPTS_DIR = ROOT / "prompts"
ENV_FILE = ROOT / "config" / ".env"


def load_env() -> None:
    if ENV_FILE.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(ENV_FILE)
            return
        except ImportError:
            pass
    if not ENV_FILE.exists():
        return
    for line in ENV_FILE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def get(key: str, default: str = "") -> str:
    return os.environ.get(key, default)


def llm_provider() -> str:
    return get("LLM_PROVIDER", "anthropic").lower()


def llm_model() -> str:
    default = "claude-sonnet-4-20250514" if llm_provider() == "anthropic" else "gpt-4o"
    return get("LLM_MODEL", default)


def image_model() -> str:
    return get("IMAGE_MODEL", "black-forest-labs/flux-schnell")


def has_llm_key() -> bool:
    provider = llm_provider()
    if provider == "anthropic":
        return bool(get("ANTHROPIC_API_KEY"))
    if provider == "openai":
        return bool(get("OPENAI_API_KEY"))
    return bool(get("ANTHROPIC_API_KEY") or get("OPENAI_API_KEY"))


def has_image_key() -> bool:
    return bool(get("REPLICATE_API_TOKEN"))

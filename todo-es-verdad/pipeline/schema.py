from __future__ import annotations

import re
from typing import Any

REQUIRED_FIELDS = [
    "slug",
    "title_es",
    "title_en",
    "location",
    "year",
    "category",
    "excerpt_es",
    "excerpt_en",
    "body_es",
    "body_en",
    "image_prompt",
    "characters",
    "tags",
]

VALID_CATEGORIES = {"descubrimientos", "filtraciones", "testimonios", "archivos"}


def get_existing_slugs(posts_dir) -> list[str]:
    from pathlib import Path
    posts_dir = Path(posts_dir)
    if not posts_dir.exists():
        return []
    return [f.stem for f in posts_dir.glob("*.json")]


def next_id(posts_dir) -> str:
    from pathlib import Path
    import json
    posts_dir = Path(posts_dir)
    existing = list(posts_dir.glob("*.json")) if posts_dir.exists() else []
    if not existing:
        return "001"
    ids = []
    for f in existing:
        data = json.loads(f.read_text(encoding="utf-8"))
        ids.append(int(data.get("id", "0")))
    return f"{max(ids) + 1:03d}"


def normalize_slug(slug: str) -> str:
    slug = slug.lower().strip()
    slug = re.sub(r"[^a-z0-9-]", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    return slug


def validate_article(data: dict[str, Any], existing_slugs: list[str]) -> list[str]:
    issues: list[str] = []

    for field in REQUIRED_FIELDS:
        if field not in data or data[field] in (None, ""):
            issues.append(f"Campo requerido ausente: {field}")

    if "year" in data:
        year = data["year"]
        if not isinstance(year, int) or year < 1850 or year > 1910:
            issues.append("year debe ser entero entre 1850 y 1910")

    if "category" in data and data["category"] not in VALID_CATEGORIES:
        issues.append(f"categoría inválida: {data['category']}")

    slug = normalize_slug(str(data.get("slug", "")))
    if not slug:
        issues.append("slug vacío o inválido")
    elif slug in existing_slugs:
        issues.append(f"slug duplicado: {slug}")

    for list_field in ("characters", "tags"):
        if list_field in data and not isinstance(data[list_field], list):
            issues.append(f"{list_field} debe ser una lista")

    return issues


def finalize_article(data: dict[str, Any], article_id: str) -> dict[str, Any]:
    from datetime import date

    slug = normalize_slug(str(data["slug"]))
    ext = data.get("_image_ext", "jpg")
    return {
        "id": article_id,
        "slug": slug,
        "title_es": data["title_es"].strip(),
        "title_en": data["title_en"].strip(),
        "location": data["location"].strip(),
        "year": int(data["year"]),
        "category": data["category"],
        "excerpt_es": data["excerpt_es"].strip(),
        "excerpt_en": data["excerpt_en"].strip(),
        "body_es": data["body_es"].strip(),
        "body_en": data["body_en"].strip(),
        "image_prompt": data["image_prompt"].strip(),
        "image_url": f"/images/{article_id}.{ext}",
        "characters": list(data.get("characters", [])),
        "tags": list(data.get("tags", [])),
        "published_at": date.today().isoformat(),
        "ai_generated": True,
    }

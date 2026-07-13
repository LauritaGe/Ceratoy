#!/usr/bin/env python3
"""
Pipeline orquestador — Todo es verdad

Flujo: Investigador → Redactor + Image Prompt → QA → Imagen → Publicador

Uso:
  python orchestrator.py --dry-run
  python orchestrator.py --generate
  python orchestrator.py --generate --topic "Máquina del tiempo en Lima"
  python orchestrator.py --generate --skip-image
"""

from __future__ import annotations

import argparse
import json
import random
import sys
from datetime import date
from pathlib import Path

from config import AGENTS_DIR, IMAGES_DIR, POSTS_DIR, PROMPTS_DIR, has_image_key, has_llm_key, load_env
from images import ImageError, generate_image, write_placeholder_svg
from llm import LLMError, chat
from schema import finalize_article, get_existing_slugs, next_id, validate_article

CATEGORIES = ["descubrimientos", "filtraciones", "testimonios", "archivos"]

IDEA_SCHEMA = """{
  "topic": "título provisional de la noticia",
  "location": "Ciudad, País",
  "year": 1885,
  "category": "descubrimientos|filtraciones|testimonios|archivos",
  "brief": "2-3 frases del ángulo editorial",
  "visual_hook": "descripción de la escena fotográfica vintage"
}"""

ARTICLE_SCHEMA = """{
  "slug": "tema-lugar-año-en-kebab-case",
  "title_es": "",
  "title_en": "",
  "location": "",
  "year": 1885,
  "category": "",
  "excerpt_es": "",
  "excerpt_en": "",
  "body_es": "párrafos separados por \\n\\n",
  "body_en": "párrafos separados por \\n\\n",
  "image_prompt": "vintage sepia photograph YEAR, scene..., daguerreotype style, grain, scratches",
  "characters": ["Nombre 1", "Nombre 2"],
  "tags": ["tag1", "tag2", "tag3"]
}"""


def load_agent(name: str) -> str:
    return (AGENTS_DIR / f"{name}.md").read_text(encoding="utf-8")


def load_template() -> str:
    return (PROMPTS_DIR / "story-template.md").read_text(encoding="utf-8")


def log(msg: str) -> None:
    print(msg, flush=True)


def generate_idea(existing_slugs: list[str], topic: str | None) -> dict:
    if topic:
        return {
            "topic": topic,
            "location": "por definir",
            "year": random.randint(1870, 1905),
            "category": random.choice(CATEGORIES),
            "brief": f"Noticia ficticia sobre: {topic}",
            "visual_hook": f"Escena de archivo vintage relacionada con {topic}",
        }

    system = (
        load_agent("researcher")
        + "\n\n"
        + load_agent("editor")
        + "\n\nResponde solo con JSON válido."
    )
    user = (
        f"Propón UNA idea original para el canal Todo es verdad.\n"
        f"Evita slugs o temas ya usados: {', '.join(existing_slugs[:20]) or 'ninguno'}\n"
        f"Schema:\n{IDEA_SCHEMA}"
    )
    return chat(system, user)


def generate_article(idea: dict) -> dict:
    system = (
        load_agent("writer")
        + "\n\n"
        + load_agent("image-prompt")
        + "\n\n"
        + load_agent("translator")
        + "\n\nResponde solo con JSON válido."
    )
    template = load_template().format(
        topic=idea["topic"],
        category=idea.get("category", "descubrimientos"),
        location=idea.get("location", "Europa"),
        year=idea.get("year", 1885),
    )
    user = (
        f"Brief editorial:\n{json.dumps(idea, ensure_ascii=False, indent=2)}\n\n"
        f"{template}\n\nSchema de salida:\n{ARTICLE_SCHEMA}"
    )
    article = chat(system, user)

    if idea.get("location") and idea["location"] != "por definir":
        article.setdefault("location", idea["location"])
    if idea.get("year"):
        article.setdefault("year", idea["year"])
    if idea.get("category"):
        article.setdefault("category", idea["category"])

    return article


def qa_review(article: dict, issues: list[str]) -> dict:
    if not issues:
        return {"approved": True, "issues": []}

    system = load_agent("qa") + "\n\nResponde solo con JSON: {\"approved\": bool, \"fixes\": {...}}"
    user = (
        f"Artículo:\n{json.dumps(article, ensure_ascii=False, indent=2)}\n\n"
        f"Problemas detectados:\n- " + "\n- ".join(issues)
    )
    try:
        result = chat(system, user)
        if result.get("fixes"):
            article.update(result["fixes"])
        return result
    except LLMError:
        return {"approved": False, "issues": issues}


def save_article(article: dict) -> Path:
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    path = POSTS_DIR / f"{article['slug']}.json"
    path.write_text(json.dumps(article, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return path


def run_dry_run(topic: str | None) -> dict:
    slugs = get_existing_slugs(POSTS_DIR)
    article_id = next_id(POSTS_DIR)
    return {
        "id": article_id,
        "slug": "ejemplo-pipeline-dry-run",
        "title_es": f"[DRY RUN] {topic or 'Noticia de prueba'}",
        "title_en": f"[DRY RUN] {topic or 'Test article'}",
        "location": "Madrid, España",
        "year": 1889,
        "category": "descubrimientos",
        "excerpt_es": "Esta es una noticia de prueba generada en modo dry-run.",
        "excerpt_en": "This is a test article generated in dry-run mode.",
        "body_es": "Contenido de prueba. Configure config/.env con API keys para generación real.",
        "body_en": "Test content. Configure config/.env with API keys for real generation.",
        "image_prompt": "vintage sepia photograph 1889, test scene, daguerreotype",
        "image_url": f"/images/{article_id}.svg",
        "characters": ["Dr. Prueba"],
        "tags": ["test"],
        "published_at": date.today().isoformat(),
        "ai_generated": True,
        "_existing_posts": len(slugs),
    }


def run_generate(topic: str | None, skip_image: bool) -> dict:
    if not has_llm_key():
        raise LLMError(
            "No hay API key de LLM. Copia config/api-keys.example.env → config/.env "
            "y configura ANTHROPIC_API_KEY u OPENAI_API_KEY."
        )

    slugs = get_existing_slugs(POSTS_DIR)
    article_id = next_id(POSTS_DIR)

    log("🔍 Paso 1/4 — Investigador + Editor")
    idea = generate_idea(slugs, topic)
    log(f"   → {idea.get('topic')} · {idea.get('location')} · {idea.get('year')}")

    log("✍️  Paso 2/4 — Redactor + Image Prompt + Traductor")
    draft = generate_article(idea)

    log("✅ Paso 3/4 — QA")
    issues = validate_article(draft, slugs)
    qa = qa_review(draft, issues)
    if not qa.get("approved", True) and issues:
        raise LLMError(f"QA rechazó el artículo: {issues}")

    remaining = validate_article(draft, slugs)
    if remaining:
        raise LLMError(f"Artículo inválido tras QA: {remaining}")

    article = finalize_article(draft, article_id)
    image_ext = "jpg"

    log("🖼️  Paso 4/4 — Imagen")
    image_path = IMAGES_DIR / f"{article_id}.{image_ext}"
    if skip_image:
        write_placeholder_svg(IMAGES_DIR / f"{article_id}.svg", article["title_es"], article["year"])
        article["image_url"] = f"/images/{article_id}.svg"
        log("   → Imagen omitida (--skip-image), placeholder SVG")
    elif has_image_key():
        try:
            generate_image(draft["image_prompt"], image_path)
            log(f"   → Imagen guardada: {image_path}")
        except ImageError as exc:
            log(f"   ⚠ Replicate falló ({exc}), usando placeholder")
            write_placeholder_svg(IMAGES_DIR / f"{article_id}.svg", article["title_es"], article["year"])
            article["image_url"] = f"/images/{article_id}.svg"
    else:
        write_placeholder_svg(IMAGES_DIR / f"{article_id}.svg", article["title_es"], article["year"])
        article["image_url"] = f"/images/{article_id}.svg"
        log("   → Sin REPLICATE_API_TOKEN, placeholder SVG")

    path = save_article(article)
    log(f"📰 Publicado: {path}")
    log(f"   URL local: /noticia/{article['slug']}")
    return article


def main() -> int:
    load_env()

    parser = argparse.ArgumentParser(description="Pipeline Todo es verdad")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true", help="Simular sin APIs (default)")
    mode.add_argument("--generate", action="store_true", help="Generar noticia con APIs")
    parser.add_argument("--topic", type=str, help="Tema opcional para la noticia")
    parser.add_argument("--skip-image", action="store_true", help="No llamar a Replicate")
    args = parser.parse_args()

    generate = args.generate
    dry_run = not generate

    log("📰 Todo es verdad — Pipeline")
    log(f"   Modo: {'GENERACIÓN' if generate else 'DRY RUN'}")
    log(f"   LLM: {'✓' if has_llm_key() else '✗'} · Imagen: {'✓' if has_image_key() else '✗'}")

    try:
        if dry_run:
            result = run_dry_run(args.topic)
            log("\n" + json.dumps(result, ensure_ascii=False, indent=2))
            return 0

        result = run_generate(args.topic, args.skip_image)
        log("\n" + json.dumps(result, ensure_ascii=False, indent=2))
        return 0

    except (LLMError, ImageError) as exc:
        log(f"\n❌ Error: {exc}")
        return 1


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Pipeline orquestador — Todo es verdad

Flujo: Editor → Investigador → Redactor → Image Prompt → Traductor → QA → Publicador

Uso:
  python orchestrator.py --dry-run          # Simula sin llamar APIs
  python orchestrator.py --topic "..."      # Genera una noticia con tema dado
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent.parent
POSTS_DIR = ROOT / "content" / "posts"
AGENTS_DIR = ROOT / "agents"


def load_agent(name: str) -> str:
    path = AGENTS_DIR / f"{name}.md"
    return path.read_text(encoding="utf-8")


def get_existing_slugs() -> list[str]:
    if not POSTS_DIR.exists():
        return []
    return [f.stem for f in POSTS_DIR.glob("*.json")]


def next_id() -> str:
    existing = list(POSTS_DIR.glob("*.json")) if POSTS_DIR.exists() else []
    if not existing:
        return "001"
    ids = []
    for f in existing:
        data = json.loads(f.read_text(encoding="utf-8"))
        ids.append(int(data.get("id", "0")))
    return f"{max(ids) + 1:03d}"


def run_pipeline(topic: str | None, dry_run: bool = True) -> dict:
    """Ejecuta el pipeline de agentes. En dry-run devuelve estructura de ejemplo."""
    slugs = get_existing_slugs()
    print(f"📰 Todo es verdad — Pipeline")
    print(f"   Posts existentes: {len(slugs)}")
    print(f"   Modo: {'DRY RUN' if dry_run else 'PRODUCCIÓN'}")

    agents = ["editor", "researcher", "writer", "image-prompt", "translator", "qa", "publisher"]
    for agent in agents:
        prompt = load_agent(agent)
        print(f"   ✓ Agente cargado: {agent} ({len(prompt)} chars)")

    if dry_run:
        article_id = next_id()
        result = {
            "id": article_id,
            "slug": "ejemplo-pipeline-dry-run",
            "title_es": f"[DRY RUN] {topic or 'Noticia de prueba'}",
            "title_en": f"[DRY RUN] {topic or 'Test article'}",
            "location": "Madrid, España",
            "year": 1889,
            "category": "descubrimientos",
            "excerpt_es": "Esta es una noticia de prueba generada en modo dry-run.",
            "excerpt_en": "This is a test article generated in dry-run mode.",
            "body_es": "Contenido de prueba. Configure las API keys para generación real.",
            "body_en": "Test content. Configure API keys for real generation.",
            "image_prompt": "vintage sepia photograph 1889, test scene, daguerreotype",
            "image_url": f"/images/{article_id}.svg",
            "characters": ["Dr. Prueba"],
            "tags": ["test"],
            "published_at": date.today().isoformat(),
            "ai_generated": True,
        }
        print(f"\n   → Artículo de ejemplo (no guardado):")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return result

    # Producción: integrar con OpenAI/Anthropic API
    raise NotImplementedError(
        "Modo producción requiere API keys. "
        "Configure config/.env y descomente las llamadas LLM en orchestrator.py"
    )


def main():
    parser = argparse.ArgumentParser(description="Pipeline Todo es verdad")
    parser.add_argument("--dry-run", action="store_true", default=True)
    parser.add_argument("--topic", type=str, help="Tema opcional para la noticia")
    args = parser.parse_args()

    run_pipeline(topic=args.topic, dry_run=args.dry_run)


if __name__ == "__main__":
    main()

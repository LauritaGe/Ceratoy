from __future__ import annotations

import json
import re
import urllib.error
import urllib.request
from typing import Any

from config import get, llm_model, llm_provider


class LLMError(RuntimeError):
    pass


def _extract_json(text: str) -> dict[str, Any]:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError as exc:
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group())
        raise LLMError(f"No se pudo parsear JSON del LLM: {exc}") from exc


def _post_json(url: str, headers: dict[str, str], payload: dict[str, Any]) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise LLMError(f"HTTP {exc.code}: {detail}") from exc


def chat(system: str, user: str) -> dict[str, Any]:
    provider = llm_provider()
    if provider == "openai":
        return _chat_openai(system, user)
    if provider == "anthropic":
        return _chat_anthropic(system, user)
    raise LLMError(f"Proveedor LLM no soportado: {provider}")


def _chat_openai(system: str, user: str) -> dict[str, Any]:
    api_key = get("OPENAI_API_KEY")
    if not api_key:
        raise LLMError("OPENAI_API_KEY no configurada en config/.env")

    data = _post_json(
        "https://api.openai.com/v1/chat/completions",
        {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        {
            "model": llm_model(),
            "temperature": 0.8,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        },
    )
    content = data["choices"][0]["message"]["content"]
    return _extract_json(content)


def _chat_anthropic(system: str, user: str) -> dict[str, Any]:
    api_key = get("ANTHROPIC_API_KEY")
    if not api_key:
        raise LLMError("ANTHROPIC_API_KEY no configurada en config/.env")

    data = _post_json(
        "https://api.anthropic.com/v1/messages",
        {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        },
        {
            "model": llm_model(),
            "max_tokens": 4096,
            "temperature": 0.8,
            "system": system + "\n\nResponde ÚNICAMENTE con JSON válido, sin markdown.",
            "messages": [{"role": "user", "content": user}],
        },
    )
    content = data["content"][0]["text"]
    return _extract_json(content)

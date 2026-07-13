from __future__ import annotations

import json
import time
import urllib.error
import urllib.request
from pathlib import Path

from config import IMAGES_DIR, get, image_model


class ImageError(RuntimeError):
    pass


def _api_request(method: str, url: str, payload: dict | None = None) -> dict:
    token = get("REPLICATE_API_TOKEN")
    if not token:
        raise ImageError("REPLICATE_API_TOKEN no configurada en config/.env")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ImageError(f"Replicate HTTP {exc.code}: {detail}") from exc


def generate_image(prompt: str, output_path: Path, negative_prompt: str = "") -> Path:
    model = image_model()
    neg = negative_prompt or (
        "modern, digital, CGI, cartoon, anime, oversaturated, clean, sharp digital photo, watermark"
    )

    prediction = _api_request(
        "POST",
        f"https://api.replicate.com/v1/models/{model}/predictions",
        {
            "input": {
                "prompt": prompt,
                "aspect_ratio": "16:10",
                "output_format": "jpg",
                "num_outputs": 1,
            }
        },
    )

    status = prediction.get("status")
    poll_url = prediction["urls"]["get"]
    deadline = time.time() + 180

    while status not in ("succeeded", "failed", "canceled"):
        if time.time() > deadline:
            raise ImageError("Timeout esperando imagen de Replicate")
        time.sleep(2)
        prediction = _api_request("GET", poll_url)
        status = prediction.get("status")

    if status != "succeeded":
        raise ImageError(f"Generación de imagen falló: {prediction.get('error', status)}")

    output = prediction.get("output")
    image_url = output[0] if isinstance(output, list) else output
    if not image_url:
        raise ImageError("Replicate no devolvió URL de imagen")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    urllib.request.urlretrieve(image_url, output_path)
    return output_path


def write_placeholder_svg(output_path: Path, title: str, year: int) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="750" viewBox="0 0 1200 750">
  <rect width="1200" height="750" fill="#c4a882"/>
  <text x="600" y="360" text-anchor="middle" fill="#5c4a32" font-family="Georgia, serif" font-size="22" opacity="0.8">{year}</text>
  <text x="600" y="400" text-anchor="middle" fill="#5c4a32" font-family="Georgia, serif" font-size="16" opacity="0.6">{title[:60]}</text>
  <text x="600" y="440" text-anchor="middle" fill="#5c4a32" font-family="Georgia, serif" font-size="14" opacity="0.5">Placeholder · configure REPLICATE_API_TOKEN</text>
</svg>'''
    output_path.write_text(svg, encoding="utf-8")
    return output_path

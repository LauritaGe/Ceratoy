# Integración de APIs — Pipeline

## Configuración

1. Copia las keys de ejemplo:

```bash
cp config/api-keys.example.env config/.env
```

2. Edita `config/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-...
REPLICATE_API_TOKEN=r8_...
LLM_PROVIDER=anthropic
```

## Uso

```bash
cd pipeline

# Simulación (sin APIs)
python3 orchestrator.py --dry-run

# Generar noticia real
python3 orchestrator.py --generate

# Con tema específico
python3 orchestrator.py --generate --topic "Observatorio secreto en los Andes, 1891"

# Solo texto, sin imagen (más barato)
python3 orchestrator.py --generate --skip-image
```

## Flujo del pipeline

| Paso | Agente(s) | API |
|------|-----------|-----|
| 1 | Investigador + Editor | LLM |
| 2 | Redactor + Image Prompt + Traductor | LLM |
| 3 | QA | LLM (si hay errores) |
| 4 | Imagen vintage | Replicate (Flux) |
| 5 | Publicador | Local (JSON + imagen) |

## Proveedores soportados

### Texto
- **Anthropic** (default): `LLM_PROVIDER=anthropic` + `ANTHROPIC_API_KEY`
- **OpenAI**: `LLM_PROVIDER=openai` + `OPENAI_API_KEY`

### Imagen
- **Replicate**: `REPLICATE_API_TOKEN` + `IMAGE_MODEL=black-forest-labs/flux-schnell`
- Sin token: genera placeholder SVG sepia automáticamente

## Automatización (GitHub Actions)

Workflow: `.github/workflows/generate-article.yml`

Secrets requeridos en GitHub:
- `ANTHROPIC_API_KEY` o `OPENAI_API_KEY`
- `REPLICATE_API_TOKEN` (opcional)

Ejecución manual: Actions → Generate Daily Article → Run workflow

## Coste estimado por noticia

| Servicio | Coste aprox. |
|----------|--------------|
| Claude Sonnet (3 llamadas) | $0.05–0.15 |
| Flux Schnell (Replicate) | $0.003 |
| **Total** | **~$0.05–0.20** |

## Ver el resultado

```bash
cd web
npm run dev
# Abre http://localhost:3000/noticia/{slug}
```

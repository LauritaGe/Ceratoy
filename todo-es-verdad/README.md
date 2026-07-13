# Todo es verdad

Repositorio independiente del canal de noticias ficticias generadas con IA.

Inspirado en [4rt.eu/pioneers](https://4rt.eu/pioneers/), con diseño basado en el **Apple Human Interface Guidelines**.

> Donde todo es verdad, nada lo es.

## Ubicación

Este proyecto vive en su propio repositorio, separado de Ceratoy:

```
/home/ubuntu/todo-es-verdad/
```

## Estructura

```
todo-es-verdad/
├── web/              # Sitio Next.js (Apple Design System)
├── content/posts/    # Noticias en JSON (fuente de verdad)
├── agents/           # System prompts por agente
├── pipeline/         # Orquestación Python
├── prompts/          # Plantillas de generación
├── config/           # Categorías y variables de entorno
└── docs/             # Brand guide y design system
```

## Inicio rápido

```bash
cd web
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Pipeline de agentes IA

```bash
cd pipeline
pip install -r requirements.txt
cp ../config/api-keys.example.env ../config/.env   # editar con tus keys

python3 orchestrator.py --dry-run
python3 orchestrator.py --generate --topic "Tu tema aquí"
```

Documentación completa: [docs/api-integration.md](docs/api-integration.md)

## Design System

Basado en Apple HIG:

- **Tipografía**: SF Pro via `-apple-system` stack
- **Colores**: System Blue `#007AFF`, grises semánticos, dark mode automático
- **Espaciado y radius**: 10–12px en cards, whitespace generoso
- **Tokens**: `web/src/styles/apple-tokens.css`

Ver `docs/design-system.md` para detalle completo.

## Legal

Todo el contenido es **100% ficticio**. Cada publicación incluye disclaimer de contenido generado por IA.

## Publicar en GitHub

Crea el repo en GitHub y conecta el remoto:

```bash
gh repo create todo-es-verdad --public --source=. --remote=origin --push
# o manualmente:
git remote add origin https://github.com/TU_USUARIO/todo-es-verdad.git
git push -u origin main
```

## Licencia

MIT

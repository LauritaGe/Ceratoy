# Todo es verdad

Canal de noticias ficticias generadas con IA. Inspirado en [4rt.eu/pioneers](https://4rt.eu/pioneers/), con diseño basado en el **Apple Human Interface Guidelines**.

> Donde todo es verdad, nada lo es.

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

## Pipeline de agentes

1. **Editor** — Define tono y aprueba temas
2. **Investigador** — Propone ideas editoriales
3. **Redactor** — Genera noticia bilingüe (ES/EN)
4. **Image Prompt** — Convierte noticia en prompt vintage
5. **Traductor** — Adapta culturalmente ES ↔ EN
6. **QA** — Revisa coherencia y legal
7. **Publicador** — Escribe JSON en `content/posts/`

```bash
cd pipeline
pip install -r requirements.txt
python orchestrator.py --dry-run
```

## Design System

Basado en Apple HIG:

- **Tipografía**: SF Pro via `-apple-system` stack
- **Colores**: System Blue `#007AFF`, grises semánticos, dark mode automático
- **Espaciado y radius**: 10–12px en cards, whitespace generoso
- **Tokens**: `web/src/styles/apple-tokens.css`

Ver `docs/design-system.md` para detalle completo.

## Legal

Todo el contenido es **100% ficticio**. Cada publicación incluye disclaimer de contenido generado por IA.

## Licencia

MIT

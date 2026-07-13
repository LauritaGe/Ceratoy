# Design System — Apple HIG

Este proyecto usa tokens basados en las [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines).

## Tipografía

Stack del sistema (SF Pro en macOS/iOS):

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
  "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
```

### Escala tipográfica

| Estilo | Tamaño | Peso | Uso |
|--------|--------|------|-----|
| Large Title | 34px | Bold | Títulos de página |
| Title 1 | 28px | Bold | Secciones |
| Title 2 | 22px | Bold | Subsecciones |
| Title 3 | 20px | Semibold | Cards, artículos |
| Headline | 17px | Semibold | Nav, énfasis |
| Body | 17px | Regular | Texto principal |
| Callout | 16px | Regular | Extractos |
| Subheadline | 15px | Regular | Metadata |
| Footnote | 13px | Regular | Labels |
| Caption 1 | 12px | Regular | Tags |
| Caption 2 | 11px | Regular | Micro texto |

## Colores

### Light mode

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#FFFFFF` | Fondo principal |
| `--color-background-secondary` | `#F2F2F7` | Secciones, cards |
| `--color-label` | `#000000` | Texto principal |
| `--color-label-secondary` | `rgba(60,60,67,0.6)` | Texto secundario |
| `--color-blue` | `#007AFF` | Links, acentos |
| `--color-separator` | `rgba(60,60,67,0.29)` | Bordes |

### Dark mode

| Token | Valor |
|-------|-------|
| `--color-background` | `#000000` |
| `--color-background-secondary` | `#1C1C1E` |
| `--color-label` | `#FFFFFF` |
| `--color-blue` | `#0A84FF` |

Dark mode se activa automáticamente con `prefers-color-scheme: dark`.

## Espaciado

- `--space-xs` 4px → `--space-3xl` 64px
- Padding de página: 20px (`px-5`)
- Max width contenido: 980px
- Max width prosa: 692px

## Radius

- Cards: 12px (`--radius-lg`)
- Badges: pill (`--radius-full`)
- Callouts: 10px (`--radius-md`)

## Componentes

| Componente | Archivo |
|------------|---------|
| Header | `web/src/components/Header.tsx` |
| Footer | `web/src/components/Footer.tsx` |
| ArticleCard | `web/src/components/ArticleCard.tsx` |
| CategoryBadge | `web/src/components/CategoryBadge.tsx` |

## Tokens CSS

Archivo fuente: `web/src/styles/apple-tokens.css`

# Plantilla de noticia — Todo es verdad

Genera una noticia ficticia con los siguientes parámetros:

- **Tema**: {topic}
- **Categoría**: {category}
- **Ubicación**: {location}
- **Año**: {year} (entre 1850 y 1910)
- **Idiomas**: ES + EN

## Requisitos

1. Título bilingüe (estilo periódico de archivo)
2. Extracto de 1-2 frases por idioma
3. Cuerpo de 4-5 párrafos por idioma
4. 2-3 personajes con nombres creíbles
5. 3-5 tags
6. Prompt de imagen vintage (daguerrotipo, sepia, grain)
7. Slug: `{tema}-{lugar}-{año}` en kebab-case

## Tono

Serio, periodístico, tercera persona. Presenta ficción como hecho documentado.
El canal se llama "Todo es verdad" — irónico, todo es inventado.

## Output

JSON válido con todos los campos del schema en `agents/publisher.md`.

# Programmatic SEO

Jeden szablon + dane = setki stron. Szczegóły w [docs/PROGRAMMATIC-SEO-PLAN.md](../docs/PROGRAMMATIC-SEO-PLAN.md).

## Struktura

- **diet/** — dieta × kcal × cel × posiłki (URL: `/dieta/[slug]`)
- **meals/** — posiłek × kcal (Faza 2)
- **diseases/** — dieta przy schorzeniach (Faza 3)

Każdy typ: `data.ts`, `generator.ts`, `template.ts`. Centralny loader: `index.ts` → `generateAllPages()`.

## Diet

- Slugi: np. `2000-kcal-redukcja-4-posilki`.
- Treści per cel w `content/diet/{mass|reduction|maintenance}` (intro, products, mistakes).

/**
 * Centralny loader programmatic SEO.
 * Zbiera wszystkie generatory i eksportuje listę ścieżek do generateStaticParams / sitemap.
 */

import { generateDietPages } from "./diet/generator";
// import { generateMealPages } from "./meals/generator";
// import { generateDiseasePages } from "./diseases/generator";

export type ProgrammaticPath = { slug: string; type: "diet" | "meal" | "disease"; params?: unknown };

/** Wszystkie ścieżki programmatic (dieta, posiłki, choroby) */
export function generateAllPages(): ProgrammaticPath[] {
  const dietPaths = generateDietPages().map(({ slug, params }) => ({
    slug,
    type: "diet" as const,
    params,
  }));
  // const mealPaths = generateMealPages().map(...)
  // const diseasePaths = generateDiseasePages().map(...)
  return [...dietPaths];
}

// Re-eksporty dla wygody
export { generateDietPages } from "./diet/generator";
export { getDietTemplateData } from "./diet/template";
export { dietParamsToSlug, slugToDietParams } from "./diet/generator";

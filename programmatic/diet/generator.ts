/**
 * Generator wszystkich kombinacji stron diet.
 * Użycie: generateStaticParams, sitemap, centralny loader.
 */

import { calories, goals, meals } from "./data";
import type { DietPageParams } from "../types";

/**
 * Polish declension for "posiłki/posiłków" in slugs
 * 3, 4 → posilki
 * 5+ → posilkow
 */
function mealCountSlug(count: number): string {
  if (count === 3 || count === 4) return `${count}-posilki`;
  return `${count}-posilkow`;
}

/**
 * Polish declension for "posiłki/posiłków" in titles
 * 3, 4 → posiłki
 * 5+ → posiłków
 */
export function mealCountLabel(count: number): string {
  if (count === 3 || count === 4) return `${count} posiłki`;
  return `${count} posiłków`;
}

/**
 * Tworzy slug dla strony diety.
 * Masa: "dieta-na-mase-2300-kcal-jadlospis-4-posilki"
 * Redukcja: "dieta-redukcyjna-2000-kcal-jadlospis-4-posilki"
 * Utrzymanie: "dieta-2000-kcal-utrzymanie-wagi-jadlospis-5-posilkow"
 */
export function dietParamsToSlug(params: DietPageParams): string {
  const { calorie, goal, mealCount } = params;
  const mealSlug = mealCountSlug(mealCount);

  if (goal === "mass") {
    return `dieta-na-mase-${calorie}-kcal-jadlospis-${mealSlug}`;
  }
  if (goal === "reduction") {
    return `dieta-redukcyjna-${calorie}-kcal-jadlospis-${mealSlug}`;
  }
  // maintenance
  return `dieta-${calorie}-kcal-utrzymanie-wagi-jadlospis-${mealSlug}`;
}

/** Parsuje slug z powrotem do parametrów (do getStaticProps / page) */
export function slugToDietParams(slug: string): DietPageParams | null {
  // Mass: dieta-na-mase-2300-kcal-jadlospis-4-posilki or 5-posilkow
  const massMatch = slug.match(
    /^dieta-na-mase-(\d+)-kcal-jadlospis-(\d+)-posil(?:ki|kow)$/
  );
  if (massMatch) {
    return {
      calorie: parseInt(massMatch[1], 10),
      goal: "mass",
      mealCount: parseInt(massMatch[2], 10),
    };
  }

  // Reduction: dieta-redukcyjna-2000-kcal-jadlospis-4-posilki or 5-posilkow
  const reductionMatch = slug.match(
    /^dieta-redukcyjna-(\d+)-kcal-jadlospis-(\d+)-posil(?:ki|kow)$/
  );
  if (reductionMatch) {
    return {
      calorie: parseInt(reductionMatch[1], 10),
      goal: "reduction",
      mealCount: parseInt(reductionMatch[2], 10),
    };
  }

  // Maintenance: dieta-2000-kcal-utrzymanie-wagi-jadlospis-4-posilki or 5-posilkow
  const maintenanceMatch = slug.match(
    /^dieta-(\d+)-kcal-utrzymanie-wagi-jadlospis-(\d+)-posil(?:ki|kow)$/
  );
  if (maintenanceMatch) {
    return {
      calorie: parseInt(maintenanceMatch[1], 10),
      goal: "maintenance",
      mealCount: parseInt(maintenanceMatch[2], 10),
    };
  }

  return null;
}

/** Generuje listę wszystkich kombinacji stron diet */
export function generateDietPages(): { slug: string; params: DietPageParams }[] {
  const pages: { slug: string; params: DietPageParams }[] = [];
  for (const calorie of calories) {
    for (const goal of goals) {
      for (const mealCount of meals) {
        const params: DietPageParams = { calorie, goal, mealCount };
        pages.push({ slug: dietParamsToSlug(params), params });
      }
    }
  }
  return pages;
}

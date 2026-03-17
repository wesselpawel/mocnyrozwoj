/**
 * Zmienne programmatic SEO dla diet.
 * Kombinacje: calories × goals × meals (× days opcjonalnie)
 */

export const calories = [
  1500, 1600, 1700, 1800, 1900,
  2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900,
  3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900,
  4000,
] as const;

export const goals = ["reduction", "mass", "maintenance"] as const;
export type Goal = (typeof goals)[number];

export const meals = [3, 4, 5] as const;
export type MealCount = (typeof meals)[number];

/**
 * Typy diet jako 4. wymiar URL:
 * /dieta/{cel}/{kcal}/{posilki}/{typ}
 *
 * Trzymamy je jako obiekty (slug + label), żeby:
 * - slug był stabilny w URL
 * - label był naturalny w title/H1
 */
export const dietTypes = [
  { slug: "standardowa", label: "standardowa" },
  { slug: "wegetarianska", label: "wegetariańska" },
  { slug: "weganska", label: "wegańska" },
  { slug: "bezglutenowa", label: "bezglutenowa" },
  { slug: "bezlaktozowa", label: "bezlaktozowa" },
  { slug: "tania", label: "tania" },
] as const;

export type DietTypeSlug = (typeof dietTypes)[number]["slug"];

/** Opcjonalnie: dni jadłospisu (rozszerzenie) */
export const days = [7, 14, 28] as const;

export type MealType = 
  | "Śniadanie"
  | "Drugie śniadanie"
  | "Obiad"
  | "Podwieczorek"
  | "Kolacja"
  | "Przekąska";

export type DietGoal = "mass" | "reduction" | "maintenance";

export type RecipeIngredient = {
  name: string;
  quantity: string;
  calories: number;
  category: string;
};

/** Polish grammatical forms for recipe name */
export type RecipeNameForms = {
  /** Base form (nominative): "Jajecznica z pomidorem" */
  base: string;
  /** Genitive case: "Jajecznicy z pomidorem" (used after: "przepis na", "porcja") */
  genitive: string;
  /** Accusative case: "Jajecznicę z pomidorem" (used after: "zjeść", "przygotować") */
  accusative: string;
  /** Short form for titles: "Jajecznica z pomidorem" */
  short: string;
};

export type RecipeEntry = {
  slug: string;
  mealType: MealType;
  mealNumber: number;
  name: string;
  /** Polish grammatical forms for proper sentence construction */
  nameForms?: RecipeNameForms;
  time: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  goal: DietGoal;
  goalLabel: string;
  ingredients: RecipeIngredient[];
  preparationSteps: string[];
  shoppingList: RecipeIngredient[];
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  sourceSlug: string;
  generatedAt: string;
  /** AI-generated image URL showing serving suggestion */
  imageUrl?: string;
};

export const GOAL_LABELS: Record<DietGoal, string> = {
  mass: "na masę",
  reduction: "na redukcję",
  maintenance: "na utrzymanie wagi",
};

export const MEAL_TYPE_SLUGS: Record<MealType, string> = {
  "Śniadanie": "sniadanie",
  "Drugie śniadanie": "drugie-sniadanie",
  "Obiad": "obiad",
  "Podwieczorek": "podwieczorek",
  "Kolacja": "kolacja",
  "Przekąska": "przekaska",
};

/**
 * Short recipe URL slug: {name}-{calories}-kcal
 * e.g. jogurt-naturalny-z-platkami-owsianymi-i-borowkami-246-kcal
 * Category (na-mase, na-redukcje, na-utrzymanie-wagi) is in the path /przepisy/[category]/[slug].
 */
export function generateRecipeSlug(
  _mealType: MealType,
  calories: number,
  _goal: DietGoal,
  name: string
): string {
  const nameSlug = name
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return `${nameSlug}-${calories}-kcal`;
}

export function generateRecipeSEO(
  mealType: MealType,
  calories: number,
  goal: DietGoal,
  name: string
): { title: string; description: string; h1: string } {
  const goalLabel = GOAL_LABELS[goal];
  const mealTypeLower = mealType.toLowerCase();
  
  return {
    title: `${name} – ${mealTypeLower} ${calories} kcal ${goalLabel} | Przepis`,
    description: `${name} (${calories} kcal) ${goalLabel}. Sprawdź składniki, makroskładniki, przygotowanie krok po kroku oraz listę zakupów. Idealna ${mealTypeLower} ${goalLabel}.`,
    h1: `${mealType} ${calories} kcal ${goalLabel}: ${name}`,
  };
}

/**
 * Pobiera podgląd jadłospisów na redukcję (tylko nazwy posiłków i produktów) dla 3, 4 i 5 posiłków.
 * Używane na stronie hub /dieta/na-redukcje/[calorie] do tabel z produktami.
 */

import { getDocument } from "@/firebase";
import { dietParamsToSlug, mealCountToSegment } from "@/programmatic/diet/generator";
import type { ProgrammaticDietContent } from "@/types/programmaticDiet";

export type MealPreview = {
  mealName: string;
  productNames: string[];
};

export type ReductionDietPreviews = {
  3: MealPreview[] | null;
  4: MealPreview[] | null;
  5: MealPreview[] | null;
};

function toMealPreviews(content: ProgrammaticDietContent): MealPreview[] {
  return content.dietDay.meals.map((meal) => ({
    mealName: meal.mealName,
    productNames: meal.ingredients.map((ing) => ing.name),
  }));
}

export async function getReductionDietPreviews(calorie: number): Promise<ReductionDietPreviews> {
  const result: ReductionDietPreviews = { 3: null, 4: null, 5: null };

  for (const mealCount of [3, 4, 5] as const) {
    const newSlug = `na-redukcje/${calorie}-kcal/${mealCountToSegment(mealCount)}`;
    const legacySlug = dietParamsToSlug({ calorie, goal: "reduction", mealCount });
    const content =
      (await getDocument("programmaticDiets", newSlug)) ??
      (await getDocument("programmaticDiets", legacySlug));
    if (content && typeof content === "object" && "dietDay" in content) {
      result[mealCount] = toMealPreviews(content as ProgrammaticDietContent);
    }
  }

  return result;
}

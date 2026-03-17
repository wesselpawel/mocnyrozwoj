/**
 * Pobiera podgląd jadłospisów na masę (tylko nazwy posiłków i produktów) dla 3, 4 i 5 posiłków.
 * Używane na stronie hub /dieta/na-mase/[calorie] do tabel z produktami.
 */

import { getDocument } from "@/firebase";
import { dietParamsToSlug, mealCountToSegment } from "@/programmatic/diet/generator";
import type { ProgrammaticDietContent } from "@/types/programmaticDiet";

export type MealPreview = {
  mealName: string;
  productNames: string[];
};

export type MassDietPreviews = {
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

export async function getMassDietPreviews(calorie: number): Promise<MassDietPreviews> {
  const result: MassDietPreviews = { 3: null, 4: null, 5: null };

  for (const mealCount of [3, 4, 5] as const) {
    const newSlug = `na-mase/${calorie}-kcal/${mealCountToSegment(mealCount)}`;
    const legacySlug = dietParamsToSlug({ calorie, goal: "mass", mealCount });
    const content =
      (await getDocument("programmaticDiets", newSlug)) ??
      (await getDocument("programmaticDiets", legacySlug));
    if (content && typeof content === "object" && "dietDay" in content) {
      result[mealCount] = toMealPreviews(content as ProgrammaticDietContent);
    }
  }

  return result;
}

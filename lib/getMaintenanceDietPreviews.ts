/**
 * Pobiera podgląd jadłospisów na utrzymanie wagi (nazwy posiłków + kcal + link do przepisu)
 * dla 3, 4 i 5 posiłków.
 * Używane na stronie hub /dieta/na-utrzymanie-wagi/[calorie].
 */

import { getDocument } from "@/firebase";
import { dietParamsToSlug, mealCountToSegment } from "@/programmatic/diet/generator";
import type { ProgrammaticDietContent } from "@/types/programmaticDiet";
import type { DietGoal, MealType } from "@/types/recipe";
import { generateRecipeSlug } from "@/types/recipe";

export type MealPreview = {
  mealName: string;
  calories: number;
  recipePath: string;
};

export type MaintenanceDietPreviews = {
  3: MealPreview[] | null;
  4: MealPreview[] | null;
  5: MealPreview[] | null;
};

const GOAL_TO_CATEGORY: Record<DietGoal, string> = {
  mass: "na-mase",
  reduction: "na-redukcje",
  maintenance: "na-utrzymanie-wagi",
};

const MEAL_TYPE_MAP: Record<number, Record<number, MealType>> = {
  3: { 1: "Śniadanie", 2: "Obiad", 3: "Kolacja" },
  4: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Kolacja" },
  5: {
    1: "Śniadanie",
    2: "Drugie śniadanie",
    3: "Obiad",
    4: "Podwieczorek",
    5: "Kolacja",
  },
};

function toMealPreviews(content: ProgrammaticDietContent): MealPreview[] {
  const goal = content.goal;
  const mealTypeMap = MEAL_TYPE_MAP[content.mealCount] || MEAL_TYPE_MAP[4];
  const category = GOAL_TO_CATEGORY[goal];

  return content.dietDay.meals.map((meal) => ({
    mealName: meal.mealName,
    calories: meal.calories,
    recipePath: `/przepisy/${category}/${
      meal.recipeSlug ??
      generateRecipeSlug(
        mealTypeMap[meal.mealNumber] || "Przekąska",
        meal.calories,
        goal,
        meal.mealName,
      )
    }`,
  }));
}

export async function getMaintenanceDietPreviews(
  calorie: number,
): Promise<MaintenanceDietPreviews> {
  const result: MaintenanceDietPreviews = { 3: null, 4: null, 5: null };

  for (const mealCount of [3, 4, 5] as const) {
    const newSlug = `na-utrzymanie-wagi/${calorie}-kcal/${mealCountToSegment(mealCount)}`;
    const legacySlug = dietParamsToSlug({ calorie, goal: "maintenance", mealCount });
    const content =
      (await getDocument("programmaticDiets", newSlug)) ??
      (await getDocument("programmaticDiets", legacySlug));
    if (content && typeof content === "object" && "dietDay" in content) {
      result[mealCount] = toMealPreviews(content as ProgrammaticDietContent);
    }
  }

  return result;
}


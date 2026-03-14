import { getDocuments, getDocument } from "@/firebase";
import type { RecipeEntry, DietGoal } from "@/types/recipe";

export type RecipeCategory = {
  slug: string;
  name: string;
  goal: DietGoal;
  description: string;
  seoTitle: string;
  seoDescription: string;
};

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  {
    slug: "na-mase",
    name: "Przepisy na masę",
    goal: "mass",
    description: "Przepisy wysokokaloryczne wspierające budowanie masy mięśniowej. Posiłki bogate w białko i węglowodany złożone.",
    seoTitle: "Przepisy na masę mięśniową - jadłospis i przepisy dietetyczne",
    seoDescription: "Przepisy na masę mięśniową z dokładną kalorycznością i makroskładnikami. Śniadania, obiady i kolacje wspierające budowanie mięśni.",
  },
  {
    slug: "na-redukcje",
    name: "Przepisy na redukcję",
    goal: "reduction",
    description: "Przepisy niskokaloryczne wspierające redukcję tkanki tłuszczowej. Sycące posiłki przy niskiej kaloryczności.",
    seoTitle: "Przepisy na redukcję - dieta odchudzająca i przepisy fit",
    seoDescription: "Przepisy na redukcję z dokładną kalorycznością. Niskokaloryczne śniadania, obiady i kolacje wspierające odchudzanie.",
  },
  {
    slug: "na-utrzymanie-wagi",
    name: "Przepisy na utrzymanie wagi",
    goal: "maintenance",
    description: "Przepisy zbilansowane pod kątem utrzymania obecnej masy ciała. Zdrowe posiłki o odpowiedniej kaloryczności.",
    seoTitle: "Przepisy na utrzymanie wagi - zbilansowana dieta",
    seoDescription: "Przepisy na utrzymanie wagi z dokładną kalorycznością. Zbilansowane posiłki dla zdrowego stylu życia.",
  },
];

export function getCategoryBySlug(slug: string): RecipeCategory | undefined {
  return RECIPE_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByGoal(goal: DietGoal): RecipeCategory | undefined {
  return RECIPE_CATEGORIES.find((c) => c.goal === goal);
}

export async function getAllRecipes(): Promise<RecipeEntry[]> {
  try {
    const docs = await getDocuments("recipes");
    return docs as RecipeEntry[];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getRecipesByGoal(goal: DietGoal): Promise<RecipeEntry[]> {
  const allRecipes = await getAllRecipes();
  return allRecipes.filter((r) => r.goal === goal);
}

export async function getRecipeBySlug(slug: string): Promise<RecipeEntry | null> {
  try {
    const doc = await getDocument("recipes", slug);
    return doc as RecipeEntry | null;
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return null;
  }
}

export async function getRecipesByCategory(categorySlug: string): Promise<RecipeEntry[]> {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return [];
  return getRecipesByGoal(category.goal);
}

/** Get other recipes from the same diet day (same sourceSlug) */
export async function getRelatedRecipesFromSameDiet(
  sourceSlug: string,
  excludeSlug: string
): Promise<RecipeEntry[]> {
  const allRecipes = await getAllRecipes();
  return allRecipes
    .filter((r) => r.sourceSlug === sourceSlug && r.slug !== excludeSlug)
    .sort((a, b) => a.mealNumber - b.mealNumber);
}

/** Get similar recipes (same mealType and goal, similar calories) */
export async function getSimilarRecipes(
  mealType: string,
  goal: DietGoal,
  calories: number,
  excludeSlug: string,
  limit: number = 4
): Promise<RecipeEntry[]> {
  const allRecipes = await getAllRecipes();
  return allRecipes
    .filter((r) => 
      r.mealType === mealType && 
      r.goal === goal && 
      r.slug !== excludeSlug
    )
    .sort((a, b) => Math.abs(a.calories - calories) - Math.abs(b.calories - calories))
    .slice(0, limit);
}

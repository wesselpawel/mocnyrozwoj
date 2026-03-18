export type MealIngredient = {
  name: string;
  quantity: string;
  calories: number;
  category: string;
};

/** Polish grammatical forms for meal name */
export type MealNameForms = {
  /** Base form (nominative): "Jajecznica z pomidorem" */
  base: string;
  /** Genitive case: "Jajecznicy z pomidorem" (used after: "przepis na", "porcja") */
  genitive: string;
  /** Accusative case: "Jajecznicę z pomidorem" (used after: "zjeść", "przygotować") */
  accusative: string;
  /** Short form for titles: "Jajecznica z pomidorem" */
  short: string;
};

export type ProgrammaticMeal = {
  mealNumber: number;
  mealName: string;
  /** Polish grammatical forms for proper sentence construction */
  mealNameForms?: MealNameForms;
  time: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  ingredients: MealIngredient[];
  preparationSteps: string[];
  /** AI-generated image URL showing serving suggestion */
  imageUrl?: string;
  /** Recipe slug saved in /recipes (e.g. "...-392-kcal") */
  recipeSlug?: string;
};

export type ProgrammaticDietDay = {
  dayLabel: string;
  mealsPerDay: number;
  totalCalories: number;
  meals: ProgrammaticMeal[];
  notes: string[];
};

export type ShoppingListItem = {
  name: string;
  quantity: string;
  category: string;
};

export type ProgrammaticDietContent = {
  slug: string;
  calories: number;
  goal: "mass" | "reduction" | "maintenance";
  mealCount: number;
  dietDay: ProgrammaticDietDay;
  shoppingList: ShoppingListItem[];
  generatedAt: string;
  generatedBy: string;
};

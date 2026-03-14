import Link from "next/link";
import type { RecipeEntry, DietGoal } from "@/types/recipe";
import { getCategoryByGoal } from "@/lib/recipeService";

type RelatedRecipesProps = {
  recipesFromSameDiet: RecipeEntry[];
  similarRecipes: RecipeEntry[];
  sourceSlug: string;
  currentMealType: string;
  goal: DietGoal;
};

const mealTypeIcons: Record<string, string> = {
  "Śniadanie": "🌅",
  "Drugie śniadanie": "🥪",
  "Obiad": "🍝",
  "Podwieczorek": "🍎",
  "Kolacja": "🌙",
  "Przekąska": "🥜",
};

function RecipeCard({ recipe, goal }: { recipe: RecipeEntry; goal: DietGoal }) {
  const category = getCategoryByGoal(goal);
  const href = `/przepisy/${category?.slug || "na-mase"}/${recipe.slug}`;

  return (
    <Link
      href={href}
      className="block bg-white rounded-xl border border-zinc-200 p-4 hover:border-[#e77503] hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{mealTypeIcons[recipe.mealType] || "🍽️"}</span>
        <span className="text-xs text-zinc-500">{recipe.mealType}</span>
        <span className="ml-auto text-xs font-semibold text-[#e77503]">{recipe.calories} kcal</span>
      </div>
      <h4 className="font-medium text-zinc-800 text-sm leading-snug line-clamp-2">
        {recipe.name}
      </h4>
      <div className="flex gap-3 mt-2 text-xs text-zinc-500">
        <span>B: {recipe.proteinG}g</span>
        <span>T: {recipe.fatG}g</span>
        <span>W: {recipe.carbsG}g</span>
      </div>
    </Link>
  );
}

export default function RelatedRecipes({
  recipesFromSameDiet,
  similarRecipes,
  sourceSlug,
  currentMealType,
  goal,
}: RelatedRecipesProps) {
  const hasRelated = recipesFromSameDiet.length > 0;
  const hasSimilar = similarRecipes.length > 0;

  if (!hasRelated && !hasSimilar) return null;

  return (
    <div className="space-y-8">
      {hasRelated && (
        <div>
          <h3 className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Inne posiłki z tego jadłospisu
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipesFromSameDiet.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} goal={goal} />
            ))}
          </div>
        </div>
      )}

      {hasSimilar && (
        <div>
          <h3 className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Podobne {currentMealType.toLowerCase()}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similarRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

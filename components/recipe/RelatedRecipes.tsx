import Link from "next/link";
import Image from "next/image";
import type { RecipeEntry, DietGoal } from "@/types/recipe";
import { getCategoryByGoal } from "@/lib/recipeService";

type RelatedRecipesProps = {
  recipesFromSameDiet: RecipeEntry[];
  similarRecipes: RecipeEntry[];
  sourceSlug: string;
  currentMealType: string;
  goal: DietGoal;
};

function RecipeCard({ recipe, goal }: { recipe: RecipeEntry; goal: DietGoal }) {
  const category = getCategoryByGoal(goal);
  const href = `/przepisy/${category?.slug || "na-mase"}/${recipe.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-[#e77503]/30 transition-all"
    >
      <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-zinc-600 font-medium">{recipe.mealType}</span>
          <span className="bg-[#e77503] text-white text-xs font-bold px-2 py-1 rounded-md">
            {recipe.calories} kcal
          </span>
        </div>
      </div>
      <div className="p-5 flex gap-4">
        {recipe.imageUrl && (
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100 aspect-square">
            <Image
              src={recipe.imageUrl}
              alt={recipe.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-zinc-900 text-lg mb-2 group-hover:text-[#e77503] transition-colors line-clamp-2">
            {recipe.name}
          </h3>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-4">
            <span>B: {recipe.proteinG}g</span>
            <span>T: {recipe.fatG}g</span>
            <span>W: {recipe.carbsG}g</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {recipe.ingredients.length} składników
            </span>
            <span className="text-[#e77503] font-semibold text-sm flex items-center gap-1">
              Zobacz przepis
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </div>
        </div>
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

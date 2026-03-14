import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  RECIPE_CATEGORIES,
  getCategoryBySlug,
  getRecipesByCategory,
} from "@/lib/recipeService";
import type { RecipeEntry } from "@/types/recipe";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return RECIPE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return { title: "Przepisy | DzienDiety" };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    openGraph: {
      title: category.seoTitle,
      description: category.seoDescription,
    },
  };
}

const mealTypeIcons: Record<string, string> = {
  "Śniadanie": "🌅",
  "Drugie śniadanie": "🥪",
  "Obiad": "🍝",
  "Podwieczorek": "🍎",
  "Kolacja": "🌙",
  "Przekąska": "🥜",
};

function RecipeCard({ recipe }: { recipe: RecipeEntry }) {
  const category = getCategoryBySlug(
    recipe.goal === "mass"
      ? "na-mase"
      : recipe.goal === "reduction"
      ? "na-redukcje"
      : "na-utrzymanie-wagi"
  );

  return (
    <Link
      href={`/przepisy/${category?.slug}/${recipe.slug}`}
      className="group block rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-[#e77503]/30 transition-all"
    >
      <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 px-5 py-4 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            {mealTypeIcons[recipe.mealType] || "🍽️"} {recipe.mealType}
          </span>
          <span className="bg-[#e77503] text-white text-xs font-bold px-2 py-1 rounded-md">
            {recipe.calories} kcal
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-zinc-900 text-lg mb-2 group-hover:text-[#e77503] transition-colors line-clamp-2">
          {recipe.name}
        </h3>
        <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-4">
          <span>🥩 {recipe.proteinG}g białka</span>
          <span>🧈 {recipe.fatG}g tłuszczu</span>
          <span>🍞 {recipe.carbsG}g węgl.</span>
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
    </Link>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const recipes = await getRecipesByCategory(categorySlug);

  const groupedByMealType = recipes.reduce(
    (acc, recipe) => {
      if (!acc[recipe.mealType]) {
        acc[recipe.mealType] = [];
      }
      acc[recipe.mealType].push(recipe);
      return acc;
    },
    {} as Record<string, RecipeEntry[]>
  );

  const mealTypeOrder = [
    "Śniadanie",
    "Drugie śniadanie",
    "Obiad",
    "Podwieczorek",
    "Kolacja",
    "Przekąska",
  ];

  return (
    <main className="min-h-screen bg-white pt-28 pb-16 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-zinc-500 font-montserrat"
        >
          <Link href="/" className="hover:text-[#e77503] transition-colors">
            Strona główna
          </Link>{" "}
          /{" "}
          <Link
            href="/przepisy"
            className="hover:text-[#e77503] transition-colors"
          >
            Przepisy
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{category.name}</span>
        </nav>

        <header className="mb-12">
          <h1 className="font-montserrat font-extrabold tracking-[0.05rem] text-3xl sm:text-4xl text-[#1f1d1d] mb-4">
            {category.name}
          </h1>
          <p className="text-lg text-zinc-600 max-w-3xl">{category.description}</p>
        </header>

        {recipes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">
              Przepisy wkrótce!
            </h2>
            <p className="text-zinc-600 mb-6">
              Pracujemy nad dodaniem przepisów do tej kategorii. Wróć wkrótce!
            </p>
            <Link
              href="/generator-diety-ai"
              className="inline-flex items-center px-5 py-2.5 bg-[#e77503] text-white rounded-xl font-semibold hover:bg-[#d66a02] transition-colors"
            >
              Wygeneruj własną dietę
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {mealTypeOrder.map((mealType) => {
              const mealRecipes = groupedByMealType[mealType];
              if (!mealRecipes || mealRecipes.length === 0) return null;

              return (
                <section key={mealType}>
                  <h2 className="font-montserrat font-bold text-xl text-zinc-900 mb-6 flex items-center gap-3">
                    <span className="text-2xl">
                      {mealTypeIcons[mealType] || "🍽️"}
                    </span>
                    {mealType}
                    <span className="text-sm font-normal text-zinc-500">
                      ({mealRecipes.length} przepisów)
                    </span>
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mealRecipes.map((recipe) => (
                      <RecipeCard key={recipe.slug} recipe={recipe} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <section className="mt-16 bg-gradient-to-r from-[#e77503]/5 to-[#ff9a3c]/5 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-4">
              Chcesz więcej przepisów?
            </h2>
            <p className="text-zinc-600 mb-6 max-w-2xl mx-auto">
              Skorzystaj z naszego generatora diety AI, który stworzy
              spersonalizowany jadłospis dopasowany do Twoich potrzeb.
            </p>
            <Link
              href="/generator-diety-ai"
              className="inline-flex items-center px-6 py-3 bg-[#e77503] text-white rounded-xl font-semibold hover:bg-[#d66a02] transition-colors shadow-lg"
            >
              Stwórz swoją dietę
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

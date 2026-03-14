import { Fragment } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageWithPreview from "@/components/ImageWithPreview";
import DietOnlineCTA from "@/components/DietOnlineCTA";
import AuthorCard from "@/components/AuthorCard";
import {
  MacroChart,
  MealTips,
  RecipeFAQ,
  PortionCalculator,
  RelatedRecipes,
  PrintButton,
} from "@/components/recipe";
import {
  RECIPE_CATEGORIES,
  getCategoryBySlug,
  getAllRecipes,
  getRecipeBySlug,
  getRelatedRecipesFromSameDiet,
  getSimilarRecipes,
} from "@/lib/recipeService";
import { generateRecipeSEO } from "@/types/recipe";
import type { RecipeEntry, RecipeIngredient } from "@/types/recipe";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateStaticParams() {
  const recipes = await getAllRecipes();
  return recipes.map((recipe) => {
    const categorySlug =
      recipe.goal === "mass"
        ? "na-mase"
        : recipe.goal === "reduction"
        ? "na-redukcje"
        : "na-utrzymanie-wagi";
    return {
      category: categorySlug,
      slug: recipe.slug,
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipeBySlug(slug);

  if (!recipe) {
    return { title: "Przepis | DzienDiety" };
  }

  const seo = generateRecipeSEO(recipe.mealType, recipe.calories, recipe.goal, recipe.name);

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
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

function formatSourceSlug(slug: string): string {
  const match = slug.match(/dieta-na-(mase|redukcje|utrzymanie-wagi)-(\d+)-kcal-jadlospis-(\d+)-posil/);
  if (match) {
    const goalMap: Record<string, string> = {
      "mase": "masę",
      "redukcje": "redukcję",
      "utrzymanie-wagi": "utrzymanie wagi",
    };
    const goal = goalMap[match[1]] || match[1];
    const kcal = match[2];
    const meals = match[3];
    return `Dieta na ${goal} ${kcal} kcal – ${meals} posiłków`;
  }
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function IngredientsTable({ ingredients }: { ingredients: RecipeIngredient[] }) {
  const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);

  const groupedByCategory = ingredients.reduce(
    (acc, ing) => {
      if (!acc[ing.category]) {
        acc[ing.category] = [];
      }
      acc[ing.category].push(ing);
      return acc;
    },
    {} as Record<string, RecipeIngredient[]>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-zinc-200 bg-zinc-50">
            <th className="text-left py-3 px-4 text-zinc-700 font-semibold">
              Składnik
            </th>
            <th className="text-right py-3 px-4 text-zinc-700 font-semibold">
              Ilość
            </th>
            <th className="text-right py-3 px-4 text-zinc-700 font-semibold">
              kcal
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <Fragment key={category}>
              <tr className="bg-zinc-50/50">
                <td
                  colSpan={3}
                  className="py-2 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide"
                >
                  {category}
                </td>
              </tr>
              {items.map((ing, i) => (
                <tr
                  key={`${category}-${i}`}
                  className="border-b border-zinc-100 hover:bg-orange-50/30 transition-colors"
                >
                  <td className="py-3 px-4 text-zinc-800">{ing.name}</td>
                  <td className="py-3 px-4 text-zinc-500 text-right">
                    {ing.quantity}
                  </td>
                  <td className="py-3 px-4 text-[#e77503] font-semibold text-right">
                    {ing.calories}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-zinc-200 bg-gradient-to-r from-[#e77503]/5 to-[#ff9a3c]/5">
            <td
              colSpan={2}
              className="py-3 px-4 text-zinc-900 font-bold text-right"
            >
              Suma kalorii:
            </td>
            <td className="py-3 px-4 text-[#e77503] font-bold text-right text-lg">
              {totalCalories} kcal
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ShoppingList({ ingredients }: { ingredients: RecipeIngredient[] }) {
  const groupedByCategory = ingredients.reduce(
    (acc, ing) => {
      if (!acc[ing.category]) {
        acc[ing.category] = [];
      }
      acc[ing.category].push(ing);
      return acc;
    },
    {} as Record<string, RecipeIngredient[]>
  );

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category}>
          <h4 className="font-semibold text-zinc-800 mb-3 pb-2 border-b border-zinc-100">
            {category}
          </h4>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-zinc-700 flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-300 text-[#e77503] focus:ring-[#e77503]"
                  />
                  {item.name}
                </span>
                <span className="text-zinc-500 font-medium">{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default async function RecipePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const recipe = await getRecipeBySlug(slug);

  if (!category || !recipe) {
    notFound();
  }

  const seo = generateRecipeSEO(recipe.mealType, recipe.calories, recipe.goal, recipe.name);
  
  const [recipesFromSameDiet, similarRecipes] = await Promise.all([
    getRelatedRecipesFromSameDiet(recipe.sourceSlug, recipe.slug),
    getSimilarRecipes(recipe.mealType, recipe.goal, recipe.calories, recipe.slug, 4),
  ]);

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: seo.description,
    ...(recipe.imageUrl && { image: recipe.imageUrl }),
    recipeCategory: recipe.mealType,
    recipeCuisine: "Polish",
    prepTime: "PT15M",
    cookTime: "PT10M",
    totalTime: "PT25M",
    recipeYield: "1 porcja",
    author: {
      "@type": "Organization",
      name: "DzienDiety.pl",
      url: "https://dziendiety.pl",
    },
    datePublished: recipe.generatedAt,
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.calories} calories`,
      proteinContent: `${recipe.proteinG} g`,
      fatContent: `${recipe.fatG} g`,
      carbohydrateContent: `${recipe.carbsG} g`,
    },
    recipeIngredient: recipe.ingredients.map(
      (ing) => `${ing.quantity} ${ing.name}`
    ),
    recipeInstructions: recipe.preparationSteps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Strona główna",
        item: "https://dziendiety.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Przepisy",
        item: "https://dziendiety.pl/przepisy",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `https://dziendiety.pl/przepisy/${category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: recipe.name,
      },
    ],
  };

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
          <Link
            href={`/przepisy/${categorySlug}`}
            className="hover:text-[#e77503] transition-colors"
          >
            {category.name}
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700 line-clamp-1">{recipe.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Main Content */}
          <article>
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 bg-zinc-100 text-zinc-700 px-3 py-1.5 rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg text-sm font-medium">
                  {mealTypeIcons[recipe.mealType]} {recipe.mealType}
                </span>
                <span className="inline-flex items-center bg-[#e77503] text-white px-4 py-1.5 rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg text-sm font-bold shadow-sm">
                  {recipe.calories} kcal
                </span>
                <span className="inline-flex items-center bg-gradient-to-r from-zinc-800 to-zinc-700 text-white px-3 py-1.5 rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg text-sm font-medium">
                  {recipe.goalLabel}
                </span>
              </div>
              <div className="flex items-start gap-5">
                {recipe.imageUrl && (
                  <ImageWithPreview
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="flex-shrink-0 shadow-lg ring-2 ring-[#e77503]/20"
                    size={96}
                    previewSize={256}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h1 className="font-montserrat font-extrabold tracking-[0.05rem] text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-3 leading-tight">
                    {seo.h1}
                  </h1>
                  <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">{seo.description}</p>
                </div>
              </div>
            </header>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {recipe.sourceSlug && (
                <Link
                  href={`/blog/post/${recipe.sourceSlug}`}
                  className="flex-1 min-w-[280px] bg-gradient-to-r from-[#e77503]/10 to-[#ff9a3c]/5 border border-[#e77503]/30 rounded-xl p-4 hover:border-[#e77503] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#e77503] rounded-lg flex items-center justify-center text-white shadow-sm">
                      📋
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 uppercase tracking-wide font-medium">Część jadłospisu</p>
                      <p className="text-[#e77503] group-hover:text-[#d66a02] font-semibold flex items-center gap-2">
                        <span>{formatSourceSlug(recipe.sourceSlug)}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </p>
                    </div>
                  </div>
                </Link>
              )}
              <PrintButton />
            </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            <MacroChart
              proteinG={recipe.proteinG}
              fatG={recipe.fatG}
              carbsG={recipe.carbsG}
              calories={recipe.calories}
            />
            <PortionCalculator
              ingredients={recipe.ingredients}
              baseCalories={recipe.calories}
              baseProtein={recipe.proteinG}
              baseFat={recipe.fatG}
              baseCarbs={recipe.carbsG}
            />
          </div>

          <section className="mb-10">
            <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
              Składniki z kalorycznością
            </h2>
            <div className="rounded-xl border border-zinc-200 overflow-hidden">
              <IngredientsTable ingredients={recipe.ingredients} />
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
              Przygotowanie krok po kroku
            </h2>
            <ol className="space-y-4">
              {recipe.preparationSteps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 bg-zinc-50 rounded-xl p-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-[#e77503] text-white rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-zinc-700 leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <DietOnlineCTA goal={recipe.goal} variant="compact" />

          <section className="mb-10 mt-10">
            <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
              Lista zakupów
            </h2>
            <div className="rounded-xl border border-zinc-200 p-6 bg-white">
              <ShoppingList ingredients={recipe.shoppingList} />
            </div>
          </section>

          <section className="mb-10">
            <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
              Wskazówki
            </h2>
            <MealTips
              mealType={recipe.mealType}
              goal={recipe.goal}
              calories={recipe.calories}
            />
          </section>

          <section className="mb-10">
            <RecipeFAQ
              mealType={recipe.mealType}
              goal={recipe.goal}
              calories={recipe.calories}
              name={recipe.name}
              nameForms={recipe.nameForms}
            />
          </section>

          <section className="mb-10">
            <RelatedRecipes
              recipesFromSameDiet={recipesFromSameDiet}
              similarRecipes={similarRecipes}
              sourceSlug={recipe.sourceSlug}
              currentMealType={recipe.mealType}
              goal={recipe.goal}
            />
          </section>

          <DietOnlineCTA goal={recipe.goal} />
        </article>

          {/* Sidebar */}
          <aside className="lg:block">
            <div className="lg:sticky lg:top-28 space-y-6">
              <AuthorCard ctaText="Stwórz swoją dietę" />
              
              <div className="hidden lg:block bg-gradient-to-br from-zinc-50 to-orange-50/30 rounded-2xl border border-zinc-200 p-5">
                <h3 className="font-montserrat font-bold text-sm text-zinc-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#e77503] rounded-full" />
                  Informacje o przepisie
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Kalorie</span>
                    <span className="font-semibold text-[#e77503]">{recipe.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Białko</span>
                    <span className="font-medium text-zinc-700">{recipe.proteinG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Tłuszcze</span>
                    <span className="font-medium text-zinc-700">{recipe.fatG}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Węglowodany</span>
                    <span className="font-medium text-zinc-700">{recipe.carbsG}g</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-200">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Typ posiłku</span>
                      <span className="font-medium text-zinc-700">{recipe.mealType}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Cel diety</span>
                    <span className="font-medium text-zinc-700">{recipe.goalLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}

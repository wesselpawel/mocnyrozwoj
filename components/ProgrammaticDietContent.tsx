"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import ImageWithPreview from "./ImageWithPreview";
import StaticTest from "@/components/Products/StaticTest";
import type { ProgrammaticDietContent as DietContent, MealIngredient, ProgrammaticMeal } from "@/types/programmaticDiet";
import type { MealType, DietGoal } from "@/types/recipe";
import type { IProduct } from "@/types";

type Props = {
  content: DietContent;
};

type IngredientItem = string | MealIngredient;

function isIngredientObject(item: IngredientItem): item is MealIngredient {
  return typeof item === "object" && item !== null && "name" in item;
}

const MEAL_TYPE_MAP: Record<number, Record<number, MealType>> = {
  3: { 1: "Śniadanie", 2: "Obiad", 3: "Kolacja" },
  4: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Kolacja" },
  5: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Podwieczorek", 5: "Kolacja" },
  6: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Podwieczorek", 5: "Kolacja", 6: "Przekąska" },
};

const MEAL_TYPE_SLUGS: Record<MealType, string> = {
  "Śniadanie": "sniadanie",
  "Drugie śniadanie": "drugie-sniadanie",
  "Obiad": "obiad",
  "Podwieczorek": "podwieczorek",
  "Kolacja": "kolacja",
  "Przekąska": "przekaska",
};

const GOAL_CATEGORY_SLUGS: Record<DietGoal, string> = {
  mass: "na-mase",
  reduction: "na-redukcje",
  maintenance: "na-utrzymanie-wagi",
};

const GOAL_ALT_LABELS: Record<DietGoal, string> = {
  mass: "dieta na masę",
  reduction: "dieta na redukcję",
  maintenance: "dieta na utrzymanie wagi",
};

function getMealImageAlt(mealName: string, goal: DietGoal, totalCalories: number): string {
  const goalLabel = GOAL_ALT_LABELS[goal];
  return `${mealName}, ${goalLabel} ${totalCalories} kcal`;
}

function generateRecipeUrl(meal: ProgrammaticMeal, _mealCount: number, goal: DietGoal): string {
  const nameSlug = meal.mealName
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

  const recipeSlug = `${nameSlug}-${meal.calories}-kcal`;
  const categorySlug = GOAL_CATEGORY_SLUGS[goal];

  return `/przepisy/${categorySlug}/${recipeSlug}`;
}

const UNLOCK_CTA_BY_GOAL: Record<
  "mass" | "reduction" | "maintenance",
  { title: string; body: string }
> = {
  reduction:
    {
      title: "Pełny jadłospis na redukcję — nie tylko jeden dzień",
      body: "W tym artykule widzisz jeden przykładowy dzień diety redukcyjnej. Wielu osób szuka odpowiedzi na pytania: ile kalorii żeby schudnąć, jak schudnąć 5 kg czy co jeść żeby schudnąć — pełny plan na 7, 14 lub 30 dni z przepisami i listą zakupów możesz kupić poniżej i od razu zacząć redukcję.",
    },
  mass:
    {
      title: "Pełny jadłospis na masę — nie tylko jeden dzień",
      body: "Tutaj masz jeden przykładowy dzień diety na masę. Jeśli szukasz gotowego planu pod budowę mięśni, ile kalorii na masę jeść albo jak rozłożyć posiłki — poniżej znajdziesz jadłospisy na 7, 14 lub 30 dni z przepisami i listą zakupów, dopasowane do Twojej kaloryczności.",
    },
  maintenance:
    {
      title: "Pełny jadłospis na utrzymanie wagi — nie tylko jeden dzień",
      body: "W tym artykule widzisz jeden przykładowy dzień diety na utrzymanie wagi. Pełny plan na 7, 14 lub 30 dni z przepisami i listą zakupów możesz kupić poniżej i utrzymać formę bez liczenia kalorii na własną rękę.",
    },
};

const PRICING_OPTIONS = [
  { days: 7, price: 9, label: "7-dniowy jadłospis z przepisami za 9 zł" },
  { days: 14, price: 19, label: "14-dniowy jadłospis z przepisami za 19 zł" },
  { days: 30, price: 29, label: "30-dniowy jadłospis z przepisami za 29 zł" },
] as const;

export default function ProgrammaticDietContent({ content }: Props) {
  const [activeTab, setActiveTab] = useState<"meals" | "shopping">("meals");
  const [showTest, setShowTest] = useState(false);
  const { dietDay, shoppingList, goal } = content;
  const ctaCopy = UNLOCK_CTA_BY_GOAL[goal] ?? UNLOCK_CTA_BY_GOAL.reduction;

  const landingTest: IProduct = {
    id: "landing-static-test",
    // Ważne: dashboard rozpoznaje dzień po fragmencie "Dzień 1" w nazwie testu
    title:
      goal === "mass"
        ? "Dzień 1 — dieta na masę"
        : goal === "reduction"
        ? "Dzień 1 — dieta na redukcję"
        : "Dzień 1 — dieta na utrzymanie wagi",
    description: "Szybki test dietetyczny",
    images: [],
    mainImage: "",
    price: 0,
    tags: [], 
    questions: [],
  };

  useEffect(() => {
    if (!showTest) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showTest]);

  const groupedShopping = shoppingList.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof shoppingList>
  );

  return (
    <section id="jadlospis" className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
        Przykładowy jadłospis z przepisami
      </h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("meals")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "meals"
              ? "bg-[#e77503] text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          🍽️ Posiłki i przepisy
        </button>
        <button
          onClick={() => setActiveTab("shopping")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "shopping"
              ? "bg-[#e77503] text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          🛒 Lista zakupów
        </button>
      </div>

      {activeTab === "meals" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#e77503]/10 to-[#ff9a3c]/10 rounded-xl p-4 mb-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="font-semibold text-zinc-900">
                📊 Łączne kalorie: {dietDay.totalCalories} kcal
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-700">
                🍴 Liczba posiłków: {dietDay.mealsPerDay}
              </span>
            </div>
          </div>

          {dietDay.meals.map((meal, idx) => {
            const recipeUrl = generateRecipeUrl(meal, content.mealCount, content.goal);
            return (
            <div
              key={idx}
              className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 px-5 py-4 border-b border-zinc-200">
                <div className="flex items-start gap-4">
                  {meal.imageUrl && (
                    <ImageWithPreview
                      src={meal.imageUrl}
                      alt={getMealImageAlt(meal.mealName, content.goal, content.dietDay.totalCalories)}
                      className="flex-shrink-0 shadow-md"
                      size={64}
                      previewSize={256}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-zinc-900 text-lg">
                        {meal.mealNumber}. {meal.mealName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-zinc-500">⏰ {meal.time}</span>
                        <span className="bg-[#e77503]/10 text-[#e77503] px-2 py-1 rounded-md font-semibold">
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-zinc-600">
                      <span>🥩 Białko: {meal.proteinG}g</span>
                      <span>🧈 Tłuszcze: {meal.fatG}g</span>
                      <span>🍞 Węglowodany: {meal.carbsG}g</span>
                      <Link
                        href={recipeUrl}
                        className="ml-auto text-[#e77503] hover:text-[#d66a02] font-semibold flex items-center gap-1"
                      >
                        Zobacz pełny przepis →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">🥗</span> Składniki
                    </h4>
                    {meal.ingredients.length > 0 && isIngredientObject(meal.ingredients[0]) ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-zinc-200">
                              <th className="text-left py-2 pr-2 text-zinc-600 font-medium">Produkt</th>
                              <th className="text-right py-2 px-2 text-zinc-600 font-medium">Ilość</th>
                              <th className="text-right py-2 pl-2 text-zinc-600 font-medium">kcal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(meal.ingredients as MealIngredient[]).map((ing, i) => (
                              <tr key={i} className="border-b border-zinc-100 last:border-0">
                                <td className="py-2 pr-2 text-zinc-700">{ing.name}</td>
                                <td className="py-2 px-2 text-zinc-500 text-right">{ing.quantity}</td>
                                <td className="py-2 pl-2 text-[#e77503] font-semibold text-right">{ing.calories}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {meal.ingredients.map((ingredient, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-zinc-700 text-sm"
                          >
                            <span className="text-[#e77503] mt-0.5">•</span>
                            {typeof ingredient === "string" ? ingredient : ingredient.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">👨‍🍳</span> Przygotowanie
                    </h4>
                    <ol className="space-y-2">
                      {meal.preparationSteps.map((step, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-zinc-700 text-sm"
                        >
                          <span className="flex-shrink-0 w-5 h-5 bg-[#e77503] text-white rounded-full text-xs flex items-center justify-center font-semibold">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

              </div>
            </div>
            );
          })}

          {dietDay.notes && dietDay.notes.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span> Wskazówki
              </h4>
              <ul className="space-y-2">
                {dietDay.notes.map((note, idx) => (
                  <li key={idx} className="text-amber-800 text-sm flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 bg-zinc-50 border border-dashed border-zinc-300 rounded-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: 7 / 14 / 30 dni visual (responsive) */}
              <div className="flex lg:flex-col lg:w-32 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-white/60">
                <div className="flex flex-1 lg:flex-col">
                  {PRICING_OPTIONS.map(({ days }, i) => (
                    <div
                      key={days}
                      className={`flex-1 min-w-[4rem] lg:min-w-0 flex flex-col items-center justify-center py-4 px-3 border-zinc-200 ${i < PRICING_OPTIONS.length - 1 ? "border-r lg:border-r-0 lg:border-b" : ""}`}
                    >
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#e77503] tabular-nums">
                        {days}
                      </span>
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide mt-0.5">
                        dni
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right: copy + pricing CTAs */}
              <div className="flex-1 p-4 sm:p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  {ctaCopy.title}
                </p>
                <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                  {ctaCopy.body}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {PRICING_OPTIONS.map(({ days, price, label }) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setShowTest(true)}
                      className="inline-flex items-center justify-center px-4 py-2.5 bg-[#e77503] text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-[#d66a02] transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "shopping" && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-zinc-50 to-zinc-100 px-5 py-4 border-b border-zinc-200">
            <h3 className="font-bold text-zinc-900 text-lg">
              Lista zakupów na cały dzień
            </h3>
            <p className="text-sm text-zinc-600 mt-1">
              Wszystkie składniki potrzebne do przygotowania {dietDay.mealsPerDay} posiłków
            </p>
          </div>

          <div className="p-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(groupedShopping).map(([category, items]) => (
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
                        <span className="text-zinc-700">{item.name}</span>
                        <span className="text-zinc-500 font-medium">
                          {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTest &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowTest(false)}
            />
            <div className="relative w-full h-[calc(100dvh-1rem)] sm:h-[90vh] sm:max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl bg-white">
              <StaticTest
                setTest={() => setShowTest(false)}
                test={landingTest}
                hideCloseButton={false}
                embeddedMode={false}
                autoSaveOnResult={false}
                redirectOnSaveSuccess={true}
              />
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}

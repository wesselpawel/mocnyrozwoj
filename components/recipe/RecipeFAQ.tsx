"use client";

import { useState } from "react";
import type { MealType, DietGoal, RecipeNameForms } from "@/types/recipe";
import { GOAL_LABELS } from "@/types/recipe";

type RecipeFAQProps = {
  mealType: MealType;
  goal: DietGoal;
  calories: number;
  name: string;
  nameForms?: RecipeNameForms;
};

/** Lowercase the first letter of a string (for use in middle of sentences) */
function toLowerFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function generateFAQ(
  mealType: MealType,
  goal: DietGoal,
  calories: number,
  name: string,
  nameForms?: RecipeNameForms
) {
  const goalLabel = GOAL_LABELS[goal];
  const mealTypeLower = mealType.toLowerCase();
  
  // Use proper grammatical forms if available, otherwise fallback to base name
  // Use lowercase versions for mid-sentence usage
  const nameBase = toLowerFirst(nameForms?.base || name);
  const nameGenitive = toLowerFirst(nameForms?.genitive || name);
  const nameAccusative = toLowerFirst(nameForms?.accusative || name);
  
  const faqs = [
    {
      question: `Czy ${nameBase} to dobre ${mealTypeLower} ${goalLabel}?`,
      answer: `Tak, ${nameBase} z ${calories} kcal jest odpowiednim ${mealTypeLower}em ${goalLabel}. Posiłek zawiera zbilansowane proporcje makroskładników dostosowane do tego celu dietetycznego.`,
    },
    {
      question: `Ile kalorii ma ${nameBase}?`,
      answer: `${nameBase.charAt(0).toUpperCase() + nameBase.slice(1)} dostarcza ${calories} kcal. Kaloryczność została obliczona na podstawie dokładnych gramatur wszystkich składników podanych w przepisie.`,
    },
    {
      question: `Czy mogę przygotować ${nameAccusative} dzień wcześniej?`,
      answer: mealType === "Śniadanie" || mealType === "Drugie śniadanie"
        ? `Tak, większość składników możesz przygotować wieczorem. Niektóre elementy (jak jajka czy tosty) lepiej przygotować rano dla lepszego smaku i tekstury.`
        : `Tak, ${nameAccusative} możesz przygotować dzień wcześniej i przechowywać w lodówce. Przed spożyciem podgrzej posiłek.`,
    },
    {
      question: `Jaki jest przepis na ${nameAccusative}?`,
      answer: `Przepis na ${nameAccusative} znajdziesz powyżej - zawiera dokładne ilości składników z kalorycznością oraz szczegółowe kroki przygotowania. Całość dostarcza ${calories} kcal.`,
    },
    {
      question: `Czym mogę zastąpić składniki w przepisie na ${nameAccusative}?`,
      answer: `Możesz modyfikować przepis według własnych preferencji. Zachowaj podobne proporcje makroskładników - zamień białko na białko (np. kurczak na indyka), węglowodany na węglowodany (ryż na kaszę).`,
    },
    {
      question: `Jak często mogę jeść ${nameAccusative}?`,
      answer: `Możesz jeść ${nameAccusative} nawet codziennie, jeśli Ci smakuje. Dla urozmaicenia diety zalecamy jednak rotację przepisów - znajdziesz więcej podobnych ${mealTypeLower} ${goalLabel} na naszej stronie.`,
    },
  ];

  if (goal === "mass") {
    faqs.push({
      question: `Jak zwiększyć kaloryczność ${nameGenitive}?`,
      answer: `Aby zwiększyć kalorie ${nameGenitive}, możesz: dodać więcej tłuszczów (oliwa, masło orzechowe), zwiększyć porcję węglowodanów, dodać garść orzechów lub awokado. Każda łyżka oliwy to dodatkowe ~120 kcal.`,
    });
  }

  if (goal === "reduction") {
    faqs.push({
      question: `Jak zmniejszyć kaloryczność ${nameGenitive}?`,
      answer: `Aby obniżyć kalorie ${nameGenitive}, możesz: zmniejszyć ilość tłuszczów, zastąpić część węglowodanów warzywami, użyć chudszych wariantów białka. Unikaj jednak zbyt drastycznego cięcia - posiłek powinien być sycący.`,
    });
  }

  return faqs;
}

export default function RecipeFAQ({ mealType, goal, calories, name, nameForms }: RecipeFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = generateFAQ(mealType, goal, calories, name, nameForms);

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <h3 className="font-semibold text-zinc-900 p-4 bg-zinc-50 border-b border-zinc-200 flex items-center gap-2">
        <span className="text-xl">❓</span>
        Często zadawane pytania
      </h3>
      <div className="divide-y divide-zinc-100">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-zinc-50 transition-colors"
            >
              <span className="font-medium text-zinc-800 pr-4">{faq.question}</span>
              <span className={`text-zinc-400 transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-sm text-zinc-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import type { MealType, DietGoal } from "@/types/recipe";

type MealTipsProps = {
  mealType: MealType;
  goal: DietGoal;
  calories: number;
};

const MEAL_TIMING_TIPS: Record<MealType, string> = {
  "Śniadanie": "Śniadanie najlepiej zjeść w ciągu 1-2 godzin po przebudzeniu, aby uruchomić metabolizm i dostarczyć energię na początek dnia.",
  "Drugie śniadanie": "Drugie śniadanie idealnie spożyć 2-3 godziny po pierwszym posiłku, aby utrzymać stabilny poziom energii.",
  "Obiad": "Obiad powinien być najbardziej sycącym posiłkiem dnia. Najlepiej zjeść go między 12:00 a 14:00.",
  "Podwieczorek": "Podwieczorek pomoże utrzymać energię między obiadem a kolacją. Zjedz go około 3-4 godziny przed kolacją.",
  "Kolacja": "Kolację najlepiej zjeść minimum 2-3 godziny przed snem, aby organizm zdążył strawić posiłek.",
  "Przekąska": "Przekąskę możesz zjeść między głównymi posiłkami, gdy poczujesz głód. Unikaj jedzenia z nudów.",
};

const GOAL_TIPS: Record<DietGoal, { title: string; tips: string[] }> = {
  mass: {
    title: "Wskazówki na masę",
    tips: [
      "Aby zwiększyć kaloryczność, dodaj łyżkę masła orzechowego lub oliwy z oliwek",
      "Zwiększ porcję węglowodanów (ryż, makaron, chleb) o 20-30%",
      "Dodaj garść orzechów lub nasion jako dodatek",
      "Rozważ dodanie awokado dla zdrowych tłuszczów",
    ],
  },
  reduction: {
    title: "Wskazówki na redukcję",
    tips: [
      "Zwiększ ilość warzyw, aby posiłek był bardziej sycący",
      "Zamień tłuste sosy na jogurt naturalny lub musztardę",
      "Pij wodę przed posiłkiem, aby zmniejszyć apetyt",
      "Jedz powoli - sytość pojawia się po około 20 minutach",
    ],
  },
  maintenance: {
    title: "Wskazówki na utrzymanie wagi",
    tips: [
      "Utrzymuj stałe pory posiłków każdego dnia",
      "Kontroluj wielkość porcji - używaj mniejszych talerzy",
      "Balansuj każdy posiłek: białko + węglowodany + warzywa",
      "Słuchaj sygnałów głodu i sytości swojego ciała",
    ],
  },
};

export default function MealTips({ mealType, goal, calories }: MealTipsProps) {
  const timingTip = MEAL_TIMING_TIPS[mealType];
  const goalTips = GOAL_TIPS[goal];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Kiedy jeść {mealType.toLowerCase()}?</h4>
            <p className="text-sm text-blue-800">{timingTip}</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-semibold text-amber-900 mb-2">{goalTips.title}</h4>
            <ul className="space-y-1">
              {goalTips.tips.map((tip, i) => (
                <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

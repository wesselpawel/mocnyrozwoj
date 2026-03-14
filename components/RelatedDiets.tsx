import Link from "next/link";

type RelatedDietsProps = {
  currentCalories: number;
  goal: "mass" | "reduction" | "maintenance";
  currentMealCount: number;
};

const GOAL_LABELS: Record<string, string> = {
  mass: "na masę",
  reduction: "na redukcję",
  maintenance: "na utrzymanie wagi",
};

const GOAL_SLUGS: Record<string, string> = {
  mass: "na-mase",
  reduction: "na-redukcje",
  maintenance: "na-utrzymanie-wagi",
};

const MEAL_LABELS: Record<number, string> = {
  3: "3 posiłki",
  4: "4 posiłki",
  5: "5 posiłków",
};

function generateDietSlug(goal: string, calories: number, mealCount: number): string {
  const goalSlug = GOAL_SLUGS[goal];
  const mealWord = mealCount === 5 ? "posilkow" : "posilki";
  return `dieta-${goalSlug}-${calories}-kcal-jadlospis-${mealCount}-${mealWord}`;
}

function getClosestCalories(current: number, count: number = 5): number[] {
  const allCalories: number[] = [];
  for (let kcal = 1500; kcal <= 4000; kcal += 100) {
    if (kcal !== current) {
      allCalories.push(kcal);
    }
  }
  
  // Sort by distance from current
  allCalories.sort((a, b) => Math.abs(a - current) - Math.abs(b - current));
  
  // Take closest ones and sort them numerically
  return allCalories.slice(0, count).sort((a, b) => a - b);
}

export default function RelatedDiets({ currentCalories, goal, currentMealCount }: RelatedDietsProps) {
  const closestCalories = getClosestCalories(currentCalories, 5);
  const goalLabel = GOAL_LABELS[goal];
  const mealCounts = [3, 4, 5];

  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3 font-montserrat">
        <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
        Podobne diety {goalLabel}
      </h2>

      <div className="space-y-6">
        {closestCalories.map((kcal) => (
          <div key={kcal} className="bg-white border border-zinc-200 rounded-xl p-5">
            <h3 className="font-semibold text-zinc-900 mb-3 flex items-center gap-2">
              <span className="bg-[#e77503] text-white px-3 py-1 rounded-lg text-sm font-bold">
                {kcal} kcal
              </span>
              <span className="text-zinc-600">Dieta {goalLabel}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {mealCounts.map((meals) => {
                const slug = generateDietSlug(goal, kcal, meals);
                const isCurrentVariant = kcal === currentCalories && meals === currentMealCount;
                
                return (
                  <Link
                    key={meals}
                    href={`/blog/post/${slug}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isCurrentVariant
                        ? "bg-zinc-200 text-zinc-500 cursor-default"
                        : "bg-zinc-100 text-zinc-700 hover:bg-[#e77503] hover:text-white"
                    }`}
                  >
                    {MEAL_LABELS[meals]}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-[#e77503]/5 to-[#ff9a3c]/5 border border-[#e77503]/20 rounded-xl">
        <p className="text-sm text-zinc-600">
          <strong className="text-zinc-800">Aktualna dieta:</strong>{" "}
          {currentCalories} kcal {goalLabel} ({MEAL_LABELS[currentMealCount]})
        </p>
      </div>
    </section>
  );
}

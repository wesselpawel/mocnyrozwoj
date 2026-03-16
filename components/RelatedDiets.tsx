import Link from "next/link";
import { getDietPagePath, mealCountLabel } from "@/programmatic/diet/generator";

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

/** SEO-friendly link text: full phrase per meal variant */
function getMealLinkLabel(
  goal: "mass" | "reduction" | "maintenance",
  kcal: number,
  mealCount: number
): string {
  const meals = mealCountLabel(mealCount);
  if (goal === "mass") return `Dieta na masę ${kcal} kcal jadłospis na ${meals}`;
  if (goal === "reduction") return `Dieta na redukcję ${kcal} kcal jadłospis na ${meals}`;
  return `Dieta ${kcal} kcal na utrzymanie wagi jadłospis na ${meals}`;
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
            <h3 className="font-semibold text-zinc-900 mb-3">
              <span className="bg-[#e77503] text-white px-3 py-1 rounded-lg text-sm font-bold mr-2">
                {kcal} kcal
              </span>
              <span className="text-zinc-800">
                {goal === "mass" && `Dieta na masę ${kcal} kcal`}
                {goal === "reduction" && `Dieta na redukcję ${kcal} kcal`}
                {goal === "maintenance" && `Dieta ${kcal} kcal na utrzymanie wagi`}
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {mealCounts.map((meals) => {
                const params = { calorie: kcal, goal, mealCount: meals };
                const path = getDietPagePath(params);
                const isCurrentVariant = kcal === currentCalories && meals === currentMealCount;
                const linkLabel = getMealLinkLabel(goal, kcal, meals);

                return (
                  <Link
                    key={meals}
                    href={`/dieta/${path}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isCurrentVariant
                        ? "bg-zinc-200 text-zinc-500 cursor-default"
                        : "bg-zinc-100 text-zinc-700 hover:bg-[#e77503] hover:text-white"
                    }`}
                  >
                    {linkLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

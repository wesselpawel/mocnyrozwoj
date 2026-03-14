"use client";

import { useState } from "react";
import type { RecipeIngredient } from "@/types/recipe";

type PortionCalculatorProps = {
  ingredients: RecipeIngredient[];
  baseCalories: number;
  baseProtein: number;
  baseFat: number;
  baseCarbs: number;
};

export default function PortionCalculator({
  ingredients,
  baseCalories,
  baseProtein,
  baseFat,
  baseCarbs,
}: PortionCalculatorProps) {
  const [portions, setPortions] = useState(1);

  const scaleValue = (value: number) => Math.round(value * portions);
  
  const scaleQuantity = (quantity: string): string => {
    const match = quantity.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
    if (match) {
      const num = parseFloat(match[1].replace(",", "."));
      const unit = match[2];
      const scaled = (num * portions).toFixed(1).replace(/\.0$/, "").replace(".", ",");
      return `${scaled}${unit ? " " + unit : ""}`;
    }
    return quantity;
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6">
      <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
        <span className="text-xl">⚖️</span>
        Kalkulator porcji
      </h3>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-zinc-600">Liczba porcji:</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setPortions(num)}
              className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                portions === num
                  ? "bg-[#e77503] text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-zinc-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-zinc-900">{scaleValue(baseCalories)}</div>
          <div className="text-xs text-zinc-500">kcal</div>
        </div>
        <div className="bg-red-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-red-600">{scaleValue(baseProtein)}g</div>
          <div className="text-xs text-red-500">białko</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-yellow-600">{scaleValue(baseFat)}g</div>
          <div className="text-xs text-yellow-500">tłuszcze</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-600">{scaleValue(baseCarbs)}g</div>
          <div className="text-xs text-blue-500">węglowodany</div>
        </div>
      </div>

      {portions > 1 && (
        <div className="border-t border-zinc-100 pt-4">
          <h4 className="text-sm font-medium text-zinc-700 mb-3">
            Składniki na {portions} {portions < 5 ? "porcje" : "porcji"}:
          </h4>
          <ul className="space-y-1 text-sm">
            {ingredients.map((ing, i) => (
              <li key={i} className="flex justify-between text-zinc-600">
                <span>{ing.name}</span>
                <span className="font-medium">{scaleQuantity(ing.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

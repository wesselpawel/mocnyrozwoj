"use client";

import { DietDayPlan, DietGenerationInput } from "@/lib/blogService";
import { FaMagic } from "react-icons/fa";

interface DietDayGeneratorSectionProps {
  value: DietGenerationInput;
  days: DietDayPlan[];
  loading: boolean;
  onChange: (updates: Partial<DietGenerationInput>) => void;
  onGenerate: () => void;
}

export default function DietDayGeneratorSection({
  value,
  days,
  loading,
  onChange,
  onGenerate,
}: DietDayGeneratorSectionProps) {
  const mealVariantOptions = [3, 4, 5];
  const selectedMealVariants =
    value.mealVariants && value.mealVariants.length > 0
      ? value.mealVariants
      : [value.mealsPerDay];

  const toggleMealVariant = (variant: number) => {
    const nextSet = new Set(selectedMealVariants);
    if (nextSet.has(variant)) {
      nextSet.delete(variant);
    } else {
      nextSet.add(variant);
    }

    const nextVariants = Array.from(nextSet).sort((a, b) => a - b);
    if (nextVariants.length === 0) {
      return;
    }

    onChange({
      mealVariants: nextVariants,
      mealsPerDay: nextVariants[0],
    });
  };

  return (
    <section className="bg-amber-50 rounded-xl p-6 border border-amber-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FaMagic className="mr-2 text-amber-600" />
        Generator dni diety (dla bloga)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ilość kalorii
          </label>
          <input
            type="number"
            min={1000}
            max={6000}
            value={value.calories}
            onChange={(event) =>
              onChange({ calories: Number(event.target.value) || 0 })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warianty ilości posiłków
          </label>
          <div className="flex items-center gap-4 h-[50px]">
            {mealVariantOptions.map((variant) => (
              <label
                key={variant}
                className="inline-flex items-center gap-2 text-sm text-gray-800"
              >
                <input
                  type="checkbox"
                  checked={selectedMealVariants.includes(variant)}
                  onChange={() => toggleMealVariant(variant)}
                  className="h-4 w-4"
                />
                {variant} posiłki
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Płeć
          </label>
          <select
            value={value.gender}
            onChange={(event) =>
              onChange({
                gender: event.target.value as DietGenerationInput["gender"],
              })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            <option value="kobieta">Kobieta</option>
            <option value="mezczyzna">Mężczyzna</option>
            <option value="inna">Inna</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nazwa diety
          </label>
          <input
            type="text"
            value={value.dietName}
            onChange={(event) => onChange({ dietName: event.target.value })}
            placeholder="np. Dieta redukcyjna"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cel diety
          </label>
          <input
            type="text"
            value={value.dietGoal}
            onChange={(event) => onChange({ dietGoal: event.target.value })}
            placeholder="np. redukcja tkanki tłuszczowej"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niechciane produkty
        </label>
        <input
          type="text"
          value={value.unwantedProducts}
          onChange={(event) => onChange({ unwantedProducts: event.target.value })}
          placeholder="np. mleko, orzechy, tuńczyk"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        />
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="bg-amber-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generowanie..." : "Wygeneruj dni diety"}
        </button>
      </div>

      {days.length > 0 && (
        <div className="mt-6 space-y-3">
          {days.map((day, dayIndex) => (
            <div key={`${day.dayLabel}-${dayIndex}`} className="rounded-lg bg-white border border-amber-200 p-4">
              <p className="font-semibold text-gray-800">{day.dayLabel}</p>
              <p className="text-sm text-gray-600">
                Posiłki: {day.mealsPerDay} | Kalorie: {day.totalCalories}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

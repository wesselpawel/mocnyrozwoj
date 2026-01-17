"use client";

import { useState, ChangeEvent } from "react";
import {
  FaCalculator,
  FaUser,
  FaRulerVertical,
  FaWeight,
  FaBolt,
  FaThLarge,
  FaFireAlt,
} from "react-icons/fa";

interface FormData {
  age: string;
  gender: "male" | "female";
  height: string;
  weight: string;
  activityLevel: string;
  goal: string;
}

interface ActivityLevel {
  value: string;
  label: string;
}

interface Goal {
  value: string;
  label: string;
  modifier: number;
}

interface Results {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fats: number;
  goal: string;
}

export default function KcalCalculator() {
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    activityLevel: "1.2",
    goal: "maintain",
  });

  const [results, setResults] = useState<Results | null>(null);

  const activityLevels: ActivityLevel[] = [
    { value: "1.2", label: "Siedzący tryb życia (brak ćwiczeń)" },
    {
      value: "1.375",
      label: "Lekka aktywność (lekkie ćwiczenia 1-3 dni/tydzień)",
    },
    {
      value: "1.55",
      label: "Umiarkowana aktywność (umiarkowane ćwiczenia 3-5 dni/tydzień)",
    },
    {
      value: "1.725",
      label: "Wysoka aktywność (intensywne ćwiczenia 6-7 dni/tydzień)",
    },
    {
      value: "1.9",
      label:
        "Bardzo wysoka aktywność (bardzo intensywne ćwiczenia, praca fizyczna)",
    },
  ];

  const goals: Goal[] = [
    { value: "lose", label: "Strata wagi (-500 kcal/dzień)", modifier: -500 },
    {
      value: "lose_slow",
      label: "Powolna strata wagi (-250 kcal/dzień)",
      modifier: -250,
    },
    { value: "maintain", label: "Utrzymanie wagi", modifier: 0 },
    {
      value: "gain_slow",
      label: "Powolny przyrost wagi (+250 kcal/dzień)",
      modifier: 250,
    },
    { value: "gain", label: "Przyrost wagi (+500 kcal/dzień)", modifier: 500 },
  ];

  const calculateBMR = (): number => {
    const { age, gender, height, weight } = formData;

    if (gender === "male") {
      return (
        88.362 +
        13.397 * parseFloat(weight) +
        4.799 * parseFloat(height) -
        5.677 * parseFloat(age)
      );
    } else {
      return (
        447.593 +
        9.247 * parseFloat(weight) +
        3.098 * parseFloat(height) -
        4.33 * parseFloat(age)
      );
    }
  };

  const calculateTDEE = (bmr: number): number => {
    return bmr * parseFloat(formData.activityLevel);
  };

  const calculateCalories = (): void => {
    if (!formData.age || !formData.height || !formData.weight) {
      alert("Proszę wypełnić wszystkie pola");
      return;
    }

    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);
    const selectedGoal = goals.find((goal) => goal.value === formData.goal);

    if (!selectedGoal) {
      return;
    }

    const targetCalories = tdee + selectedGoal.modifier;

    // Calculate macronutrients (balanced approach)
    const protein = (targetCalories * 0.25) / 4; // 25% protein (4 kcal/g)
    const carbs = (targetCalories * 0.45) / 4; // 45% carbs (4 kcal/g)
    const fats = (targetCalories * 0.3) / 9; // 30% fats (9 kcal/g)

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      goal: selectedGoal.label,
    });
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = (): void => {
    setFormData({
      age: "",
      gender: "male",
      height: "",
      weight: "",
      activityLevel: "1.2",
      goal: "maintain",
    });
    setResults(null);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <FaCalculator className="text-3xl text-purple-600 mr-4" />
        <h2 className="text-3xl font-bold text-gray-800">Kalkulator KCAL</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2 text-purple-600" />
              Dane osobowe
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Wiek (lata)
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="np. 25"
                  min="15"
                  max="100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Płeć
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="male">Mężczyzna</option>
                  <option value="female">Kobieta</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaRulerVertical className="mr-1 text-purple-600" />
                  Wzrost (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="np. 175"
                  min="120"
                  max="250"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaWeight className="mr-1 text-purple-600" />
                  Waga (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="np. 70"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaBolt className="mr-2 text-blue-600" />
              Poziom aktywności
            </h3>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {activityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaThLarge className="mr-2 text-green-600" />
              Cel dietetyczny
            </h3>
            <select
              name="goal"
              value={formData.goal}
              onChange={handleInputChange}
              className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {goals.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={calculateCalories}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center"
            >
              <FaCalculator className="mr-2" />
              Oblicz
            </button>
            <button
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Wyczyść
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {results ? (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaFireAlt className="mr-2 text-orange-600" />
                Wyniki kalkulacji
              </h3>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      BMR (Podstawowa Przemiana Materii):
                    </span>
                    <span className="text-lg font-bold text-gray-800">
                      {results.bmr} kcal
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Kalorie potrzebne do podstawowych funkcji życiowych
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      TDEE (Całkowite Zapotrzebowanie):
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {results.tdee} kcal
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Kalorie potrzebne do utrzymania obecnej wagi
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Docelowe kalorie:
                    </span>
                    <span className="text-xl font-bold text-purple-600">
                      {results.targetCalories} kcal
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{results.goal}</p>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Rozkład makroskładników:
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-red-50 p-3 rounded-lg text-center border border-red-200">
                      <div className="text-red-600 font-bold text-lg">
                        {results.protein}g
                      </div>
                      <div className="text-red-700 text-sm font-medium">
                        Białko
                      </div>
                      <div className="text-red-500 text-xs">25%</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center border border-yellow-200">
                      <div className="text-yellow-600 font-bold text-lg">
                        {results.carbs}g
                      </div>
                      <div className="text-yellow-700 text-sm font-medium">
                        Węglowodany
                      </div>
                      <div className="text-yellow-500 text-xs">45%</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
                      <div className="text-green-600 font-bold text-lg">
                        {results.fats}g
                      </div>
                      <div className="text-green-700 text-sm font-medium">
                        Tłuszcze
                      </div>
                      <div className="text-green-500 text-xs">30%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-12 rounded-xl text-center">
              <FaCalculator className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Kalkulator KCAL
              </h3>
              <p className="text-gray-500">
                Wypełnij formularz po lewej stronie, aby obliczyć swoje dzienne
                zapotrzebowanie kaloryczne i docelowe kalorie według wybranego
                celu.
              </p>
              <div className="mt-6 text-sm text-gray-400">
                <p>📊 Kalkulator wykorzystuje wzór Mifflin-St Jeor</p>
                <p>🎯 Precyzyjne obliczenie BMR i TDEE</p>
                <p>🥗 Automatyczny rozkład makroskładników</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {results && (
        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">
            💡 Dodatkowe informacje:
          </h4>
          <div className="text-sm text-blue-700 space-y-2">
            <p>
              • <strong>BMR</strong> to minimalna ilość kalorii potrzebna do
              funkcjonowania organizmu w spoczynku
            </p>
            <p>
              • <strong>TDEE</strong> uwzględnia twój poziom aktywności
              fizycznej
            </p>
            <p>
              • Bezpieczna utrata wagi to 0,5-1 kg tygodniowo (deficyt 500-1000
              kcal dziennie)
            </p>
            <p>
              • Zdrowy przyrost wagi to 0,25-0,5 kg tygodniowo (nadwyżka 250-500
              kcal dziennie)
            </p>
            <p>
              • Rozkład makroskładników może być dostosowany do indywidualnych
              potrzeb
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import type { ProgrammaticDietContent } from "@/types/programmaticDiet";

type Props = {
  slug: string;
  calories: number;
  goal: "mass" | "reduction" | "maintenance";
  mealCount: number;
  onGenerated?: (content: ProgrammaticDietContent) => void;
};

export default function AdminGenerateDietButton({
  slug,
  calories,
  goal,
  mealCount,
  onGenerated,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/admin/generate-programmatic-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, calories, goal, mealCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd podczas generowania");
      }

      setSuccess(true);
      if (onGenerated && data.content) {
        onGenerated(data.content);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-dashed border-[#e77503] rounded-xl p-6 mb-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <span className="text-xl">🔧</span>
            Panel Administratora
          </h3>
          <p className="text-sm text-zinc-600 mt-1">
            Wygeneruj przepisy i listę zakupów dla tej diety ({calories} kcal, {mealCount} posiłków)
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || success}
          className={`px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-md ${
            isGenerating
              ? "bg-zinc-400 cursor-wait"
              : success
              ? "bg-green-500"
              : "bg-[#e77503] hover:bg-[#d66a02] hover:shadow-lg"
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generowanie...
            </span>
          ) : success ? (
            <span className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Wygenerowano!
            </span>
          ) : (
            "Generuj przepisy i listę zakupów"
          )}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Zawartość została wygenerowana i zapisana. Strona zostanie odświeżona...
        </div>
      )}
    </div>
  );
}

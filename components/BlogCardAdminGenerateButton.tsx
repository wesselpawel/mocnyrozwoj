"use client";

import { useState } from "react";

type Props = {
  slug: string;
  calories: number;
  goal: "mass" | "reduction" | "maintenance";
  mealCount: number;
  /** When true, show as a compact inline button (e.g. on blog listing cards) */
  compact?: boolean;
};

export default function BlogCardAdminGenerateButton({
  slug,
  calories,
  goal,
  mealCount,
  compact = true,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      // Nie robimy auto-reload, żeby nie przerywać innych requestów (gdy admin klika wiele przycisków).
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setIsGenerating(false);
    }
  };

  if (success) {
    return (
      <span className="inline-flex items-center gap-1.5 text-green-600 text-xs font-medium">
        <span>✓</span> Wygenerowano
      </span>
    );
  }

  if (compact) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 disabled:opacity-60 disabled:cursor-wait"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generowanie...
            </>
          ) : (
            "Generuj jadłospis"
          )}
        </button>
        {error && <span className="text-red-600 text-xs">{error}</span>}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#e77503] text-white hover:bg-[#d66a02] disabled:opacity-60 disabled:cursor-wait"
      >
        {isGenerating ? "Generowanie..." : "Generuj jadłospis"}
      </button>
      {error && <p className="mt-1 text-red-600 text-xs">{error}</p>}
    </div>
  );
}

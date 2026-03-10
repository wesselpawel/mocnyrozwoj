"use client";

import React, { useEffect, useState } from "react";
import DayPlanSection from "./results/DayPlanSection";
import ShoppingListSection from "./results/ShoppingListSection";
import RecipesSection from "./results/RecipesSection";
import { DietPlanData } from "./results/types";

interface Props {
  data: DietPlanData;
}

type ReportTab = "plan" | "shopping" | "recipes";

const DashboardPersonalReport: React.FC<Props> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<ReportTab>("plan");
  const [isTabContentVisible, setIsTabContentVisible] = useState(false);

  useEffect(() => {
    setIsTabContentVisible(false);
    const frame = window.requestAnimationFrame(() => {
      setIsTabContentVisible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeTab]);

  if (!data) return <p>Brak danych</p>;

  return (
    <div className="text-left pb-6">
      <div className="sticky top-[65px] z-40 bg-white border-b border-zinc-100 flex flex-wrap gap-2 px-4 py-3">
        <button
          onClick={() => setActiveTab("plan")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
            activeTab === "plan"
              ? "bg-[#e77503] text-white"
              : "bg-orange-100 text-[#b45b00] hover:bg-orange-200"
          }`}
        >
          Plan dnia
        </button>
        <button
          onClick={() => setActiveTab("shopping")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
            activeTab === "shopping"
              ? "bg-[#e77503] text-white"
              : "bg-orange-100 text-[#b45b00] hover:bg-orange-200"
          }`}
        >
          Lista zakupów
        </button>
        <button
          onClick={() => setActiveTab("recipes")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
            activeTab === "recipes"
              ? "bg-[#e77503] text-white"
              : "bg-orange-100 text-[#b45b00] hover:bg-orange-200"
          }`}
        >
          Przepisy
        </button>
      </div>

      <div
        className={`transition-all duration-300 ${
          isTabContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        {activeTab === "plan" &&
          (data.plan_dnia && data.plan_dnia.length > 0 ? (
            <DayPlanSection meals={data.plan_dnia} />
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-zinc-600">
              Brak danych dla sekcji Plan dnia.
            </div>
          ))}

        {activeTab === "shopping" &&
          (data.lista_zakupow && data.lista_zakupow.length > 0 ? (
            <ShoppingListSection items={data.lista_zakupow} />
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-zinc-600">
              Brak danych dla sekcji Lista zakupów.
            </div>
          ))}

        {activeTab === "recipes" &&
          (data.przepisy && data.przepisy.length > 0 ? (
            <RecipesSection recipes={data.przepisy} />
          ) : (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-zinc-600">
              Brak danych dla sekcji Przepisy.
            </div>
          ))}
      </div>
    </div>
  );
};

export default DashboardPersonalReport;

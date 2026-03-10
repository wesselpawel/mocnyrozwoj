"use client";

import React from "react";
import ResultsHero from "./results/ResultsHero";
import DayPlanSection from "./results/DayPlanSection";
import ShoppingListSection from "./results/ShoppingListSection";
import RecipesSection from "./results/RecipesSection";
import { DietPlanData } from "./results/types";

interface Props {
  data: DietPlanData;
  showShoppingList?: boolean;
  showRecipes?: boolean;
}

const PersonalReport: React.FC<Props> = ({
  data,
  showShoppingList = true,
  showRecipes = true,
}) => {
  if (!data) return <p>Brak danych</p>;

  return (
    <div className="text-left space-y-6 overflow-y-auto max-h-full pb-6">
      <ResultsHero />

      {data.plan_dnia && data.plan_dnia.length > 0 && (
        <DayPlanSection meals={data.plan_dnia} />
      )}

      {showShoppingList &&
        data.lista_zakupow &&
        data.lista_zakupow.length > 0 && (
        <ShoppingListSection items={data.lista_zakupow} />
        )}

      {showRecipes && data.przepisy && data.przepisy.length > 0 && (
        <RecipesSection recipes={data.przepisy} />
      )}
    </div>
  );
};

export default PersonalReport;

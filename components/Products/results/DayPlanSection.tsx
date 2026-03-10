"use client";

import { useState } from "react";
import { FaClock, FaFireAlt, FaSearch, FaSyncAlt } from "react-icons/fa";
import { PlanPosilku } from "./types";
import LoginPopup from "@/components/LoginPopup";

function fmt(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export default function DayPlanSection({ meals }: { meals: PlanPosilku[] }) {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const dailyCalories = meals.reduce(
    (sum, meal) => sum + (typeof meal.kalorie_kcal === "number" ? meal.kalorie_kcal : 0),
    0,
  );

  return (
    <section className="rounded-3xl bg-white p-5 lg:p-6 shadow-lg border border-zinc-100">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-anton tracking-[0.08rem] text-xl lg:text-2xl text-[#1f1d1d]">
          PLAN DNIA
        </h3>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff3e0] text-[#e77503] text-sm font-semibold">
          <FaFireAlt /> {fmt(dailyCalories)} kcal
        </span>
      </div>

      <div className="space-y-4">
        {meals.map((meal, index) => (
          <article
            key={`${meal.nazwa_posilku}-${index}`}
            className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-white to-zinc-50 p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base lg:text-lg font-bold text-zinc-900">
                {meal.nazwa_posilku}
              </h4>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600">
                <FaClock className="text-[#e77503]" />
                {meal.godzina}
              </span>
            </div>

            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-zinc-700">
              {meal.skladniki.map((item, i) => (
                <li key={`${item.produkt}-${i}`} className="bg-white rounded-lg px-3 py-2 border border-zinc-100">
                  {item.produkt} - {fmt(item.ilosc_g)} g
                </li>
              ))}
            </ul>

              <div className="mt-3 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-xs lg:text-sm">
                  <span className="px-3 py-1 rounded-full bg-[#fff3e0] text-[#c45f00] font-semibold">
                    {fmt(meal.kalorie_kcal)} kcal
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                    B: {fmt(meal.bialko_g)} g
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                    T: {fmt(meal.tluszcze_g)} g
                  </span>
                  <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                    W: {fmt(meal.weglowodany_g)} g
                  </span>
                </div>

                <div className="hidden md:grid grid-cols-2 gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowRegisterPopup(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e77503] to-[#fcaa30] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <FaSyncAlt className="text-xs" />
                    Wymień danie
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegisterPopup(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm hover:bg-zinc-200 transition-colors"
                  >
                    <FaSearch className="text-xs" />
                    Zobacz przepis
                  </button>
                </div>
              </div>

              <div className="md:hidden grid grid-cols-2 gap-2 w-full">
                <button
                  type="button"
                  onClick={() => setShowRegisterPopup(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e77503] to-[#fcaa30] px-3 py-3 text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
                >
                  <FaSyncAlt className="text-xs" />
                  Wymień danie
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterPopup(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-3 py-3 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-200 transition-colors"
                >
                  <FaSearch className="text-xs" />
                  Zobacz przepis
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <LoginPopup
        isOpen={showRegisterPopup}
        onClose={() => setShowRegisterPopup(false)}
        initialMode="register"
        allowModeSwitch={false}
      />
    </section>
  );
}

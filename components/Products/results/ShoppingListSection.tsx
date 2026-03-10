"use client";

import { useMemo, useState } from "react";
import { FaShoppingCart, FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { ListaZakupowItem } from "./types";

function fmt(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export default function ShoppingListSection({
  items,
}: {
  items: ListaZakupowItem[];
}) {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) => ({
        ...item,
        id: `${item.produkt}-${item.ilosc_calkowita_g}-${index}`,
      })),
    [items],
  );

  const checkedCount = normalizedItems.filter((item) => checkedMap[item.id]).length;
  const totalCount = normalizedItems.length;
  const remainingCount = Math.max(totalCount - checkedCount, 0);

  return (
    <section className="rounded-3xl bg-white p-5 lg:p-6 border border-zinc-100">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-anton tracking-[0.06rem] text-xl lg:text-2xl text-[#1f1d1d]">
          LISTA ZAKUPOW
        </h3>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff3e0] text-[#e77503] text-sm font-semibold">
          <FaShoppingCart /> Na caly dzien
        </span>
      </div>

      <div className="mb-4 rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-700">
        Zrobione: <span className="font-semibold text-zinc-900">{checkedCount}</span> /{" "}
        <span className="font-semibold text-zinc-900">{totalCount}</span> • Zostalo:{" "}
        <span className="font-semibold text-[#e77503]">{remainingCount}</span>
      </div>

      <ul className="space-y-2">
        {normalizedItems.map((item) => {
          const isChecked = !!checkedMap[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() =>
                  setCheckedMap((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
                className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                  isChecked
                    ? "border-green-200 bg-green-50"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-0.5 text-[#e77503]">
                      {isChecked ? <FaCheckCircle /> : <FaRegCircle />}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`font-semibold truncate ${
                          isChecked ? "text-zinc-500 line-through" : "text-zinc-900"
                        }`}
                      >
                        {item.produkt}
                      </p>
                      <p className="text-xs text-zinc-600 mt-0.5">
                        {fmt(item.kalorie_kcal)} kcal
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs font-semibold rounded-full bg-[#fff3e0] text-[#b45b00] px-2.5 py-1">
                    {fmt(item.ilosc_calkowita_g)} g
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { FaUtensils } from "react-icons/fa";
import { Przepis } from "./types";

function fmt(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export default function RecipesSection({ recipes }: { recipes: Przepis[] }) {
  return (
    <section className="rounded-3xl bg-white p-5 lg:p-6 shadow-lg border border-zinc-100">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="font-anton tracking-[0.08rem] text-xl lg:text-2xl text-[#1f1d1d]">
          PRZEPISY
        </h3>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff3e0] text-[#e77503] text-sm font-semibold">
          <FaUtensils /> Krok po kroku
        </span>
      </div>

      <div className="space-y-4">
        {recipes.map((recipe, index) => (
          <article
            key={`${recipe.nazwa_posilku}-${index}`}
            className="rounded-2xl border border-zinc-200 bg-gradient-to-r from-white to-zinc-50 p-4 shadow-sm"
          >
            <h4 className="text-base lg:text-lg font-bold text-zinc-900 mb-3">
              {recipe.nazwa_posilku}
            </h4>

            <p className="text-sm font-semibold text-zinc-700 mb-2">Skladniki</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
              {recipe.skladniki.map((item, i) => (
                <li key={`${item.produkt}-${i}`} className="bg-white rounded-lg px-3 py-2 border border-zinc-100 text-sm text-zinc-700">
                  {item.produkt} - {fmt(item.ilosc_g)} g
                </li>
              ))}
            </ul>

            <p className="text-sm font-semibold text-zinc-700 mb-2">Przygotowanie</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-700">
              {recipe.kroki.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </section>
  );
}

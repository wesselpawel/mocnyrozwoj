import { FaCheck } from "react-icons/fa";

export default function ResultsHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f1d1d] via-[#252222] to-[#1f1d1d] p-6 lg:p-8 text-white shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,117,3,0.25),transparent_45%)]" />
      <div className="relative z-10">
        <p className="font-extrabold text-2xl lg:text-3xl tracking-[0.35rem] font-montserrat text-white">
          GOTOWY PLAN
        </p>
        <h2 className="text-xl sm:text-2xl lg:text-4xl mt-3 text-[#e77503] font-anton tracking-[0.08rem]">
          KLIKNIJ. JEDZ. OSIAGNIJ CEL
        </h2>
        <p className="mt-4 text-sm lg:text-base text-zinc-100 max-w-3xl">
          Przygotowalismy dla Ciebie kompletny
          plan dnia, liste zakupow i przepisy krok po kroku.
        </p>
        <p className="mt-6 text-sm text-zinc-100 max-w-3xl">
          W panelu użytkownika czekają na ciebie:
        </p>
        <div className="flex flex-wrap gap-3 mt-2">
          {["Przepisy", "Lista zakupow", "Personalizowane porady","Czego unikać" , "Najczęstsze błędy"].map((label) => (
            <div
              key={label}
              className="w-max max-w-full flex items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg"
            >
              <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                <FaCheck className="text-white" />
              </div>
              <p className="text-sm font-montserrat">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

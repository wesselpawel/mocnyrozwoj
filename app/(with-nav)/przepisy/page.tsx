import { Metadata } from "next";
import Link from "next/link";
import { RECIPE_CATEGORIES } from "@/lib/recipeService";

export const metadata: Metadata = {
  title: "Przepisy dietetyczne - śniadania, obiady, kolacje | DzienDiety",
  description:
    "Przepisy dietetyczne z dokładną kalorycznością i makroskładnikami. Znajdź przepisy na masę, redukcję lub utrzymanie wagi.",
  openGraph: {
    title: "Przepisy dietetyczne - śniadania, obiady, kolacje | DzienDiety",
    description:
      "Przepisy dietetyczne z dokładną kalorycznością i makroskładnikami. Znajdź przepisy na masę, redukcję lub utrzymanie wagi.",
  },
};

const categoryIcons: Record<string, string> = {
  "na-mase": "💪",
  "na-redukcje": "🔥",
  "na-utrzymanie-wagi": "⚖️",
};

export default function PrzepisyPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-zinc-500 font-montserrat"
        >
          <Link href="/" className="hover:text-[#e77503] transition-colors">
            Strona główna
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">Przepisy dietetyczne</span>
        </nav>

        <header className="mb-12">
          <h1 className="font-montserrat font-extrabold tracking-[0.05rem] text-4xl sm:text-5xl text-[#1f1d1d] mb-4">
            Przepisy dietetyczne
          </h1>
          <p className="text-lg text-zinc-600 max-w-3xl">
            Znajdź idealne przepisy dopasowane do Twojego celu. Każdy przepis
            zawiera dokładną kaloryczność składników, makroskładniki i instrukcję
            przygotowania krok po kroku.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {RECIPE_CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/przepisy/${category.slug}`}
              className="group block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-lg hover:border-[#e77503]/30 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">
                  {categoryIcons[category.slug] || "🍽️"}
                </span>
                <h2 className="font-bold text-xl text-zinc-900 group-hover:text-[#e77503] transition-colors">
                  {category.name}
                </h2>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed mb-4">
                {category.description}
              </p>
              <span className="inline-flex items-center text-[#e77503] font-semibold text-sm group-hover:gap-2 transition-all">
                Zobacz przepisy
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16">
          <h2 className="font-montserrat font-bold text-2xl text-zinc-900 mb-6">
            Dlaczego nasze przepisy?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#e77503]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                Dokładna kaloryczność
              </h3>
              <p className="text-zinc-600 text-sm">
                Każdy składnik z dokładną liczbą kalorii. Żadnych przybliżeń.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#e77503]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                Makroskładniki
              </h3>
              <p className="text-zinc-600 text-sm">
                Białko, tłuszcze i węglowodany dla każdego przepisu.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-[#e77503]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-zinc-900 mb-2">
                Lista zakupów
              </h3>
              <p className="text-zinc-600 text-sm">
                Gotowa lista składników do każdego przepisu.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import profile from "@/public/donut.jpg";
import { categorySlugs, categories as defaultCategories } from "./data";
import { PublicBlogEntry } from "@/lib/publicBlogEntries";
import {
  getMassHubPath,
  getReductionHubPath,
  getMaintenanceHubPath,
} from "@/programmatic/diet/generator";
import BlogCardAdminGenerateButton from "@/components/BlogCardAdminGenerateButton";

const MASS_CALORIES = [1500, 1800, 2000, 2200, 2500, 2800, 3000, 3500, 4000];
const REDUCTION_CALORIES = [1500, 1800, 2000, 2200, 2500, 2800, 3000, 3500, 4000];
const MAINTENANCE_CALORIES = [1500, 1800, 2000, 2200, 2500, 2800, 3000, 3500, 4000];

const CATEGORY_SLUG_TO_DIETA_SECTION: Record<string, string> = {
  "dieta-na-mase": "na-mase",
  "dieta-na-redukcje": "na-redukcje",
  "dieta-na-utrzymanie-wagi": "na-utrzymanie-wagi",
  "przepisy-dietetyczne": "przepisy",
};

/** Programmatic SEO content for the hero header per section (category or index). */
const SECTION_SEO: Record<
  string,
  { badge: string; title: string; description: string }
> = {
  __index: {
    badge: "DIETA W PIGUŁCE",
    title: "Plany dietetyczne z przepisami i listą zakupów",
    description:
      "Miejsce z uporządkowaną wiedzą na temat żywienia: od podstawowych typów diet, przez przykładowe dni jadłospisu, po gotowe przepisy i strategie pod konkretny cel.",
  },
  "Dieta na masę": {
    badge: "DIETA NA MASĘ",
    title: "Dieta na masę – przykładowe jadłospisy 1500–4000 kcal",
    description:
      "Gotowe plany na masę mięśniową: jadłospisy od 1500 do 4000 kcal, rozkład posiłków, przepisy i lista zakupów. Wybierz kaloryczność i liczbę posiłków.",
  },
  "Dieta na redukcję": {
    badge: "DIETA NA REDUKCJĘ",
    title: "Dieta na redukcję – jadłospisy od 1500 do 4000 kcal",
    description:
      "Przykładowe diety redukcyjne z deficytem kalorycznym: gotowe jadłospisy, przepisy i lista zakupów. Bezpieczna redukcja masy ciała.",
  },
  "Dieta na utrzymanie wagi": {
    badge: "DIETA NA UTRZYMANIE WAGI",
    title: "Dieta na utrzymanie wagi – jadłospisy i plany żywieniowe",
    description:
      "Plany żywieniowe na utrzymanie masy ciała: zbilansowane jadłospisy, przepisy i lista zakupów. Stabilna waga bez efektu jo-jo.",
  },
  "Przepisy dietetyczne": {
    badge: "PRZEPISY DIETETYCZNE",
    title: "Przepisy dietetyczne – śniadania, obiady, kolacje",
    description:
      "Gotowe przepisy na dania dopasowane do celu: na masę, redukcję i utrzymanie wagi. Kalorie i makro przy każdym przepisie.",
  },
};

export default function BlogLibraryContent({
  selectedCategory,
  entries,
  isAdmin = false,
}: {
  selectedCategory: string | null;
  entries: PublicBlogEntry[];
  /** When true, programmatic diet cards show "Generuj jadłospis" button */
  isAdmin?: boolean;
}) {
  // Only show categories that (1) are in the default list and (2) have at least one entry.
  // Legacy categories (e.g. "Konkretny cel dietetyczny") are never shown even if some entry has them.
  const fromEntries = entries.map((entry) => entry.category).filter(Boolean);
  const fromEntriesSet = new Set<string>(fromEntries);
  const categories = defaultCategories.filter((c) => fromEntriesSet.has(c));

  const categorySlugByName = categories.reduce<Record<string, string>>(
    (acc, category) => {
      acc[category] =
        categorySlugs[category as keyof typeof categorySlugs] ||
        category
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      return acc;
    },
    {},
  );

  const fullyFilteredEntries = selectedCategory
    ? entries.filter((entry) => entry.category === selectedCategory)
    : entries;

  const visibleCategories = selectedCategory ? [selectedCategory] : categories;
  const seo = SECTION_SEO[selectedCategory ?? "__index"] ?? SECTION_SEO.__index;

  return (
    <main className="min-h-screen bg-white pt-28 pb-16 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-zinc-500 font-montserrat"
        >
          <Link href="/" className="hover:text-[#e77503] transition-colors">
            Strona główna
          </Link>{" "}
          /{" "}
          <Link href="/dieta" className="hover:text-[#e77503] transition-colors">
            Diety
          </Link>
          {selectedCategory ? ` / ${selectedCategory}` : ""}
        </nav>

        <header className="rounded-3xl border border-[#e77503]/20 bg-[#fff9f3] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
            <div>
              <p className="inline-flex items-center rounded-full bg-[#e77503] px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                {seo.badge}
              </p>
              <h1 className="mt-4 font-montserrat font-extrabold tracking-[0.12rem] text-3xl sm:text-4xl lg:text-5xl text-[#1f1d1d]">
                {seo.title}
              </h1>
              <p className="mt-4 max-w-3xl text-zinc-700 leading-relaxed font-montserrat">
                {seo.description}
              </p>
            </div>
          </div>
        </header>

        {selectedCategory === "Dieta na masę" && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8" aria-labelledby="diety-wedlug-kalorii">
            <h2 id="diety-wedlug-kalorii" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
              Diety na masę według kalorii
            </h2>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {MASS_CALORIES.map((kcal) => (
                <li key={kcal}>
                  <Link
                    href={`/dieta/${getMassHubPath(kcal)}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-[#e77503] hover:bg-[#e77503]/5 hover:text-[#e77503] transition-colors"
                  >
                    {kcal} kcal
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {selectedCategory === "Dieta na redukcję" && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8" aria-labelledby="diety-redukcja-wedlug-kalorii">
            <h2 id="diety-redukcja-wedlug-kalorii" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
              Diety na redukcję według kalorii
            </h2>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {REDUCTION_CALORIES.map((kcal) => (
                <li key={kcal}>
                  <Link
                    href={`/dieta/${getReductionHubPath(kcal)}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-[#e77503] hover:bg-[#e77503]/5 hover:text-[#e77503] transition-colors"
                  >
                    {kcal} kcal
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {selectedCategory === "Dieta na utrzymanie wagi" && (
          <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8" aria-labelledby="diety-utrzymanie-wedlug-kalorii">
            <h2 id="diety-utrzymanie-wedlug-kalorii" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
              Diety na utrzymanie wagi według kalorii
            </h2>
            <ul className="flex flex-wrap gap-2 sm:gap-3">
              {MAINTENANCE_CALORIES.map((kcal) => (
                <li key={kcal}>
                  <Link
                    href={`/dieta/${getMaintenanceHubPath(kcal)}`}
                    className="inline-flex items-center px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-[#e77503] hover:bg-[#e77503]/5 hover:text-[#e77503] transition-colors"
                  >
                    {kcal} kcal
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6 lg:gap-8">
          <aside className="xl:sticky xl:top-28 self-start rounded-2xl border border-zinc-200 bg-white p-5 h-fit">
            <h2 className="text-sm font-semibold text-[#1f1d1d] mb-4">
              Kategorie
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/generator-diety-ai"
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg font-semibold text-sm hover:bg-[#e77503]/80 transition-colors"
                >
                  Generator Diety AI
                </Link>
              </li>
              <li>
                <Link
                  href="/dieta"
                  className={`block rounded-lg border px-3 py-2 text-sm transition-colors ${
                    !selectedCategory
                      ? "border-[#e77503]/60 bg-[#fff3e0] text-[#b45b00] font-semibold"
                      : "border-zinc-200 text-zinc-700 hover:border-[#e77503]/50"
                  }`}
                >
                  Wszystkie kategorie
                </Link>
              </li>
              {categories.map((category) => {
                const slug = categorySlugByName[category];
                const section = CATEGORY_SLUG_TO_DIETA_SECTION[slug] ?? slug;
                return (
                <li key={category}>
                  <Link
                    href={`/dieta/${section}`}
                    className={`block rounded-lg border px-3 py-2 text-sm transition-colors ${
                      selectedCategory === category
                        ? "border-[#e77503]/60 bg-[#fff3e0] text-[#b45b00] font-semibold"
                        : "border-zinc-200 text-zinc-700 hover:border-[#e77503]/50"
                    }`}
                  >
                    {category}
                  </Link>
                </li>
              );
              })}
            </ul>
          </aside>

          <div className="space-y-8">
            {visibleCategories.map((category) => {
              const categoryEntries = fullyFilteredEntries
                .filter((entry) => entry.category === category)
                .sort((a, b) => a.id.localeCompare(b.id));
              if (categoryEntries.length === 0) return null;
              return (
                <section key={category}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center" />
                    <h2 className="font-anton tracking-[0.08rem] text-2xl text-[#1f1d1d]">
                      {category}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categoryEntries.map((entry) => (
                      <article
                        key={entry.id}
                        id={entry.id}
                        className="rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:border-[#e77503]/50 transition-colors shadow-sm hover:shadow-md"
                      >
                        {entry.imageUrl ? (
                          <Link
                            href={entry.href || `/dieta/post/${entry.slug}`}
                            className="block relative w-full aspect-[16/10] bg-zinc-100"
                          >
                            <Image
                              src={entry.imageUrl}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                            />
                          </Link>
                        ) : null}
                        <div className="p-5">
                          <div className="flex items-center justify-between gap-3 text-xs text-zinc-500 mb-3">
                            <span>Aktualizacja: {entry.updatedAt}</span>
                            <span>{entry.readTime}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-[#1f1d1d] leading-snug">
                            {entry.title}
                          </h3>
                          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                            {entry.description}
                          </p>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <Link
                              href={entry.href || `/dieta/post/${entry.slug}`}
                              className="inline-flex items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg text-sm font-semibold hover:bg-[#e77503]/80 transition-colors"
                            >
                              Czytaj artykuł
                            </Link>
                            {isAdmin && entry.programmaticDiet && (
                              <BlogCardAdminGenerateButton
                                slug={entry.slug}
                                calories={entry.programmaticDiet.calories}
                                goal={entry.programmaticDiet.goal}
                                mealCount={entry.programmaticDiet.mealCount}
                                compact
                              />
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
            {fullyFilteredEntries.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-zinc-700">
                Brak artykułów w tej kategorii.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

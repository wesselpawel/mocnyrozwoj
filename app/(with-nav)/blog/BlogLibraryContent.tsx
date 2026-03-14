import Image from "next/image";
import Link from "next/link";
import profile from "@/public/donut.jpg";
import { categorySlugs, categories as defaultCategories } from "./data";
import { PublicBlogEntry } from "@/lib/publicBlogEntries";

export default function BlogLibraryContent({
  selectedCategory,
  entries,
}: {
  selectedCategory: string | null;
  entries: PublicBlogEntry[];
}) {
  const categories = Array.from(
    new Set([
      ...defaultCategories,
      ...entries.map((entry) => entry.category).filter(Boolean),
    ]),
  );

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
          <Link href="/blog" className="hover:text-[#e77503] transition-colors">
            Blog
          </Link>
          {selectedCategory ? ` / ${selectedCategory}` : ""}
        </nav>

        <header className="rounded-3xl border border-[#e77503]/20 bg-[#fff9f3] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
            <div>
              <p className="inline-flex items-center rounded-full bg-[#e77503] px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                Biblioteka wiedzy
              </p>
              <h1 className="mt-4 font-montserrat font-extrabold tracking-[0.12rem] text-3xl sm:text-4xl lg:text-5xl text-[#1f1d1d]">
                {selectedCategory ? selectedCategory : "Blog Dietetyczny"}
              </h1>
              <p className="mt-4 max-w-3xl text-zinc-700 leading-relaxed font-montserrat">
                Miejsce z uporządkowaną wiedzą na temat żywienia: od podstawowych
                typów diet, przez przykładowe dni jadłospisu, po gotowe przepisy
                i strategie pod konkretny cel.
              </p>
            </div>

            <aside className="rounded-2xl border border-zinc-200 bg-white p-5 min-w-[250px]">
              <p className="text-xs uppercase tracking-wide text-zinc-500 font-semibold">
                Autor
              </p>
              <div className="flex items-center gap-2">
                <Image
                  src={profile}
                  alt="Paweł Wessel"
                  width={100}
                  height={100}
                  className="h-12 w-12 mt-3 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="mt-2 text-base font-semibold text-[#1f1d1d]">
                    Paweł Wessel
                  </p>
                  <Link
                    href="https://wesselpawel.com"
                    target="_blank"
                    className="text-sm text-zinc-600 hover:text-[#e77503] transition-colors"
                  >
                    wesselpawel.com
                  </Link>
                </div>
              </div>
              <p className="max-w-[300px] mt-1 text-sm text-zinc-600">
                Twórca pierwszego polskiego{" "}
                <Link href="/generator-diety-ai">
                  <b>generatora diety AI za darmo</b>
                </Link>
                {" "}dziendiety.pl
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Aktualizacja biblioteki: 11.03.2026
              </p>
            </aside>
          </div>
        </header>

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
                  href="/blog"
                  className={`block rounded-lg border px-3 py-2 text-sm transition-colors ${
                    !selectedCategory
                      ? "border-[#e77503]/60 bg-[#fff3e0] text-[#b45b00] font-semibold"
                      : "border-zinc-200 text-zinc-700 hover:border-[#e77503]/50"
                  }`}
                >
                  Wszystkie kategorie
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/blog/${categorySlugByName[category]}`}
                    className={`block rounded-lg border px-3 py-2 text-sm transition-colors ${
                      selectedCategory === category
                        ? "border-[#e77503]/60 bg-[#fff3e0] text-[#b45b00] font-semibold"
                        : "border-zinc-200 text-zinc-700 hover:border-[#e77503]/50"
                    }`}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-8">
            {visibleCategories.map((category) => {
              const categoryEntries = fullyFilteredEntries.filter(
                (entry) => entry.category === category,
              );
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
                        className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-[#e77503]/50 transition-colors shadow-sm hover:shadow-md"
                      >
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
                        <Link
                          href={entry.href || `/blog/post/${entry.slug}`}
                          className="mt-4 inline-flex items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg text-sm font-semibold hover:bg-[#e77503]/80 transition-colors"
                        >
                          Czytaj artykuł
                        </Link>
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

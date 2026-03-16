import Image from "next/image";
import Link from "next/link";
import { FaCheck } from "react-icons/fa";
import profile from "@/public/donut.jpg";
import MarkdownContent from "@/components/MarkdownContent";
import TableOfContents from "@/components/TableOfContents";
import SectionLinkButton from "@/components/SectionLinkButton";
import FAQ from "@/components/FAQ";
import ProgrammaticDietWrapper from "@/components/ProgrammaticDietWrapper";
import RelatedDiets from "@/components/RelatedDiets";
import NewsletterSignup from "@/components/NewsletterSignup";
import type { PublicBlogEntry } from "@/lib/publicBlogEntries";

const author = {
  name: "Paweł Wessel",
  url: "https://wesselpawel.com",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type Props = {
  entry: PublicBlogEntry;
  /** "dieta" = canonical /dieta/slug, "blog" = canonical /blog/post/slug */
  canonicalBasePath: "dieta" | "blog";
  siteUrl: string;
};

export default function DietBlogArticleContent({
  entry,
  canonicalBasePath,
  siteUrl,
}: Props) {
  const canonicalUrl =
    canonicalBasePath === "dieta"
      ? `${siteUrl}/dieta/${entry.slug}`
      : `${siteUrl}/blog/post/${entry.slug}`;
  const publishedDate = entry.updatedAt.split(".").reverse().join("-");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.h1 ?? entry.title,
    description: entry.description,
    dateModified: publishedDate,
    datePublished: publishedDate,
    inLanguage: "pl-PL",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "DzienDiety",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSecond =
    canonicalBasePath === "dieta" ? (
      <Link href="/blog" className="hover:text-[#e77503] transition-colors">
        Diety
      </Link>
    ) : (
      <Link href="/blog" className="hover:text-[#e77503] transition-colors">
        Blog
      </Link>
    );

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
          {breadcrumbSecond}{" "}
          /{" "}
          <span className="text-zinc-700">{entry.h1 ?? entry.title}</span>
        </nav>

        <article className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10 items-start">
            <div>
              <p className="inline-flex items-center rounded-full bg-[#e77503] px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">
                {entry.category}
              </p>
              <h1 className="mt-4 font-montserrat font-extrabold tracking-[0.05rem] text-3xl sm:text-4xl text-[#1f1d1d]">
                {entry.h1 ?? entry.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
                <span>Aktualizacja: {entry.updatedAt}</span>
                <span>Czas czytania: {entry.readTime}</span>
              </div>
              <p className="mt-6 text-zinc-700 leading-relaxed">
                {entry.description}
              </p>
            </div>

            {!entry.programmaticDiet && (
              <aside className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-orange-50/30 p-6 lg:sticky lg:top-28 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-1 bg-[#e77503] rounded-full" />
                  <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                    Autor
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={profile}
                    alt={author.name}
                    width={100}
                    height={100}
                    className="h-16 w-16 rounded-full ring-2 ring-[#e77503]/20 ring-offset-2"
                  />
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-[#1f1d1d]">
                      {author.name}
                    </p>
                    <Link
                      href={author.url}
                      target="_blank"
                      className="text-sm text-[#e77503] hover:text-[#e77503]/80 transition-colors font-medium"
                    >
                      wesselpawel.com ↗
                    </Link>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Twórca pierwszego polskiego{" "}
                    <Link
                      href="/generator-diety-ai"
                      className="text-[#e77503] font-semibold hover:underline"
                    >
                      generatora diety AI za darmo
                    </Link>
                    {" "}— dziendiety.pl
                  </p>
                </div>
                <Link
                  href="/generator-diety-ai"
                  className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#e77503] text-white rounded-xl font-semibold text-sm hover:bg-[#e77503]/90 transition-colors"
                >
                  Stwórz swoją dietę
                </Link>
              </aside>
            )}
          </div>

          {entry.programmaticDiet && (
            <div className="mt-10">
              <ProgrammaticDietWrapper
                slug={entry.slug}
                calories={entry.programmaticDiet.calories}
                goal={entry.programmaticDiet.goal}
                mealCount={entry.programmaticDiet.mealCount}
              />
            </div>
          )}

          {entry.sections && entry.sections.length > 3 && (
            <div className="mt-8">
              <TableOfContents
                sections={entry.sections}
                title={entry.title}
                hasFaq={entry.faq && entry.faq.length > 0}
                hasJadlospis={!!entry.programmaticDiet}
              />
            </div>
          )}

          <div className="mt-10">
            {entry.sections
              ? entry.sections.map((section, idx) => {
                  const hasTable =
                    /\|.+\|/.test(section.text) && /\|-+\|/.test(section.text);
                  const hasMarkdown =
                    section.text.includes("**") || section.text.includes("](");
                  const sectionId =
                    section.id || slugify(section.title);
                  return (
                    <section
                      key={`${entry.id}-section-${idx}`}
                      id={sectionId}
                      className="pt-8 first:pt-0"
                    >
                      <h2 className="font-montserrat font-bold text-2xl text-[#1f1d1d] mb-4 flex items-center gap-3">
                        <span className="h-6 w-1 bg-[#e77503] rounded-full" />
                        {section.title}
                      </h2>
                      {hasTable || hasMarkdown ? (
                        <div className="mt-3 pl-4 border-l-2 border-zinc-100">
                          <MarkdownContent content={section.text} />
                        </div>
                      ) : (
                        <p className="mt-3 text-zinc-700 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-zinc-100">
                          {section.text}
                        </p>
                      )}
                      {section.linkToSection && section.linkText && (
                        <div className="mt-4 pl-4">
                          <SectionLinkButton
                            targetId={section.linkToSection}
                            text={section.linkText}
                          />
                        </div>
                      )}
                      {section.ctaLink && section.ctaText && (
                        <div className="mt-4 pl-4">
                          <Link
                            href={section.ctaLink}
                            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#e77503] to-[#ff9a3c] text-white rounded-xl font-semibold text-sm hover:from-[#d66a02] hover:to-[#e77503] transition-all shadow-md hover:shadow-lg"
                          >
                            {section.ctaText}
                          </Link>
                        </div>
                      )}
                      {section.video && (
                        <div className="mt-8 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 md:p-8">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 leading-tight">
                            {section.video.title}
                          </h3>
                          <div className="flex justify-center bg-white rounded-xl pt-6">
                            <video
                              src={section.video.src}
                              className="mx-auto max-w-full w-[500px] h-auto shadow-lg"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          </div>
                          {section.video.ctaLink && section.video.ctaText && (
                            <div className="mt-6 flex justify-center">
                              <Link
                                href={section.video.ctaLink}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#e77503] to-[#ff9a3c] text-white rounded-xl font-semibold text-base hover:from-[#d66a02] hover:to-[#e77503] transition-all shadow-lg hover:shadow-xl"
                              >
                                {section.video.ctaText}
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  );
                })
              : entry.content.map((paragraph, idx) => (
                  <p
                    key={`${entry.id}-${idx}`}
                    className="text-zinc-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}

            {entry.faq && entry.faq.length > 0 && (
              <FAQ
                items={entry.faq}
                title="Najczęściej zadawane pytania"
              />
            )}
          </div>

          {entry.programmaticDiet && (
            <aside className="mt-12 pt-10 border-t border-zinc-200 rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-orange-50/30 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-[#e77503] rounded-full" />
                <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                  Autor
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Image
                  src={profile}
                  alt={author.name}
                  width={100}
                  height={100}
                  className="h-20 w-20 rounded-full ring-2 ring-[#e77503]/20 ring-offset-2 flex-shrink-0"
                />
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#1f1d1d]">
                    {author.name}
                  </p>
                  <Link
                    href={author.url}
                    target="_blank"
                    className="text-[#e77503] hover:text-[#e77503]/80 transition-colors font-medium inline-block mt-1"
                  >
                    wesselpawel.com ↗
                  </Link>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Twórca pierwszego polskiego{" "}
                    <Link
                      href="/generator-diety-ai"
                      className="text-[#e77503] font-semibold hover:underline"
                    >
                      generatora diety AI za darmo
                    </Link>
                    {" "}— dziendiety.pl
                  </p>
                </div>
                <Link
                  href="/generator-diety-ai"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-[#e77503] text-white rounded-xl font-semibold text-sm hover:bg-[#e77503]/90 transition-colors flex-shrink-0"
                >
                  Stwórz swoją dietę
                </Link>
              </div>
            </aside>
          )}

          {entry.programmaticDiet && (
            <RelatedDiets
              currentCalories={entry.programmaticDiet.calories}
              goal={entry.programmaticDiet.goal}
              currentMealCount={entry.programmaticDiet.mealCount}
            />
          )}

          {entry.programmaticDiet && (
            <section className="mt-12 py-10 px-6 rounded-2xl border border-[#e77503]/20 bg-[#fff9f3]" aria-labelledby="newsletter-article">
              <div className="max-w-2xl mx-auto text-center">
                <h2 id="newsletter-article" className="font-montserrat font-extrabold tracking-[0.12rem] text-xl sm:text-2xl text-[#1f1d1d] mb-4">
                  Bądź na bieżąco
                  {entry.programmaticDiet.goal === "mass" && " – dieta na masę"}
                  {entry.programmaticDiet.goal === "reduction" && " – dieta na redukcję"}
                  {entry.programmaticDiet.goal === "maintenance" && " – dieta na utrzymanie wagi"}
                </h2>
                <p className="text-base text-zinc-600 mb-8 leading-relaxed">
                  Zapisz się do newslettera i otrzymuj informacje o najnowszych
                  planach dietetycznych, promocjach i wskazówkach żywieniowych
                  prosto na swoją skrzynkę email.
                </p>
                <NewsletterSignup />
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
                  {["Bezpłatne informacje", "Możliwość rezygnacji w każdej chwili", "Bez spamu"].map((item) => (
                    <div key={item} className="w-max max-w-full flex items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                      <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                        <FaCheck className="text-white text-xs" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <div className="mt-10">
            <Link
              href="/generator-diety-ai"
              className="inline-flex items-center px-5 py-2.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg font-semibold hover:bg-[#e77503]/80 transition-colors"
            >
              Przejdź do Generatora Diety AI
            </Link>
          </div>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}

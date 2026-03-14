import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateDietPages, slugToDietParams } from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";
import FAQ from "@/components/FAQ";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

export function generateStaticParams() {
  return generateDietPages().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageParams = slugToDietParams(slug);
  if (!pageParams) {
    return { title: "Dieta | DzienDiety", description: "Jadłospis DzienDiety." };
  }
  const data = getDietTemplateData(pageParams);
  const url = `${siteUrl}/dieta/${slug}`;
  return {
    title: `${data.title} | DzienDiety`,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${data.title} | DzienDiety`,
      description: data.description,
      url,
      siteName: "DzienDiety",
      locale: "pl_PL",
    },
    robots: { index: true, follow: true },
  };
}

export default async function DietaPage({ params }: Props) {
  const { slug } = await params;
  const pageParams = slugToDietParams(slug);
  if (!pageParams) notFound();

  const data = getDietTemplateData(pageParams);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">{data.h1}</h1>
        <p className="mt-3 text-lg text-zinc-600">{data.description}</p>
      </header>

      <div className="space-y-10">
        {data.sections.map((section, i) => (
          <section key={i} id={section.id} className="scroll-mt-20">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-4 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-[#e77503] rounded-full flex-shrink-0" />
              {section.title}
            </h2>
            <div className="prose prose-zinc max-w-none prose-p:text-zinc-700 prose-p:leading-relaxed prose-ul:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-900 prose-table:text-zinc-700 prose-th:bg-zinc-100 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-td:border prose-td:border-zinc-200 prose-th:border prose-th:border-zinc-200">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.text}</ReactMarkdown>
            </div>

            {section.linkToSection && section.linkText && (
              <Link
                href={`#${section.linkToSection}`}
                className="inline-flex items-center gap-2 mt-4 text-[#e77503] hover:text-[#d66a02] font-semibold transition-colors"
              >
                {section.linkText}
              </Link>
            )}

            {section.ctaLink && section.ctaText && (
              <Link
                href={section.ctaLink}
                className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#e77503] hover:bg-[#d66a02] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#e77503]/20"
              >
                {section.ctaText}
              </Link>
            )}

            {section.video && (
              <div className="mt-6 rounded-2xl overflow-hidden bg-zinc-900 shadow-xl">
                <video
                  src={section.video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full"
                />
                <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-white font-bold text-lg">
                    {section.video.title}
                  </span>
                  {section.video.ctaLink && section.video.ctaText && (
                    <Link
                      href={section.video.ctaLink}
                      className="px-5 py-2.5 bg-[#e77503] hover:bg-[#ff9a3c] text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      {section.video.ctaText}
                    </Link>
                  )}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>

      {data.faq && data.faq.length > 0 && (
        <FAQ items={data.faq} />
      )}
    </article>
  );
}

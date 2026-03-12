import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { entries, getEntryBySlug } from "../../data";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

export async function generateStaticParams() {
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);

  if (!entry) {
    return {
      title: "Artykuł | Blog DzienDiety",
      description: "Artykuł blogowy DzienDiety.",
    };
  }

  const url = `${siteUrl}/blog/post/${entry.slug}`;
  const keywordBase = [
    "dieta online",
    "plan diety",
    "odżywianie",
    "blog dietetyczny",
    entry.category.toLowerCase(),
  ];

  return {
    title: `${entry.title} | Blog DzienDiety`,
    description: entry.description,
    keywords: keywordBase,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: `${entry.title} | Blog DzienDiety`,
      description: entry.description,
      url,
      siteName: "DzienDiety",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | Blog DzienDiety`,
      description: entry.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const postUrl = `${siteUrl}/blog/post/${entry.slug}`;
  const publishedDate = entry.updatedAt.split(".").reverse().join("-");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: entry.description,
    dateModified: publishedDate,
    datePublished: publishedDate,
    inLanguage: "pl-PL",
    author: {
      "@type": "Person",
      name: "Paweł Wessel",
      url: "https://wesselpawel.com",
    },
    publisher: {
      "@type": "Organization",
      name: "DzienDiety",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  return (
    <main className="min-h-screen bg-white pt-28 pb-16 px-6 lg:px-12">
      <div className="max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-[#e77503] transition-colors">
            Strona główna
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-[#e77503] transition-colors">
            Blog
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{entry.title}</span>
        </nav>

        <article className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
          <p className="inline-flex items-center rounded-full bg-[#e77503] px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase">
            {entry.category}
          </p>
          <h1 className="mt-4 font-montserrat font-extrabold tracking-[0.05rem] text-3xl sm:text-4xl text-[#1f1d1d]">
            {entry.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span>Aktualizacja: {entry.updatedAt}</span>
            <span>Czas czytania: {entry.readTime}</span>
          </div>

          <p className="mt-6 text-zinc-700 leading-relaxed">{entry.description}</p>

          <div className="mt-8 space-y-4">
            {entry.content.map((paragraph, idx) => (
              <p key={`${entry.id}-${idx}`} className="text-zinc-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

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

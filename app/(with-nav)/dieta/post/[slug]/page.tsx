import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getPublicBlogEntries } from "@/lib/publicBlogEntries";
import DietBlogArticleContent from "@/components/DietBlogArticleContent";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

/** Exclude programmatic diets (canonical at /dieta/) and recipe entries (canonical at /przepisy/[category]/[slug]). */
export async function generateStaticParams() {
  const allEntries = await getPublicBlogEntries();
  return allEntries
    .filter((entry) => !entry.programmaticDiet && !entry.href?.startsWith("/przepisy/"))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allEntries = await getPublicBlogEntries();
  const entry = allEntries.find((item) => item.slug === slug);

  if (!entry) {
    return {
      title: "Artykuł | DzienDiety",
      description: "Artykuł DzienDiety.",
    };
  }

  const url = `${siteUrl}/dieta/post/${entry.slug}`;
  const keywordBase = [
    "dieta online",
    "plan diety",
    "odżywianie",
    "diety",
    entry.category.toLowerCase(),
  ];

  return {
    title: `${entry.title} | DzienDiety`,
    description: entry.description,
    keywords: keywordBase,
    authors: [{ name: "Paweł Wessel", url: "https://wesselpawel.com" }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${entry.title} | DzienDiety`,
      description: entry.description,
      url,
      siteName: "DzienDiety",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.title} | DzienDiety`,
      description: entry.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function DietPostPage({ params }: Props) {
  const { slug } = await params;
  const allEntries = await getPublicBlogEntries();
  const entry = allEntries.find((item) => item.slug === slug);
  if (!entry) notFound();

  if (entry.href?.startsWith("/przepisy/")) {
    redirect(entry.href);
  }

  return <DietBlogArticleContent entry={entry} canonicalBasePath="dieta-post" siteUrl={siteUrl} />;
}


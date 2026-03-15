import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { generateDietPages, slugToDietParams, getDietPagePath } from "@/programmatic/diet/generator";
import { getPublicBlogEntries } from "@/lib/publicBlogEntries";
import DietBlogArticleContent from "@/components/DietBlogArticleContent";

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
  const allEntries = await getPublicBlogEntries();
  const entry = allEntries.find((e) => e.slug === slug);
  if (!entry) {
    return { title: "Dieta | DzienDiety", description: "Jadłospis DzienDiety." };
  }

  const url = `${siteUrl}/dieta/${slug}`;
  return {
    title: `${entry.title} | DzienDiety`,
    description: entry.description,
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

export default async function DietaPage({ params }: Props) {
  const { slug } = await params;
  const pageParams = slugToDietParams(slug);
  if (!pageParams) notFound();

  if (pageParams.goal === "mass") {
    redirect(`/dieta/${getDietPagePath(pageParams)}`);
  }

  const allEntries = await getPublicBlogEntries();
  const entry = allEntries.find((e) => e.slug === slug);
  if (!entry || !entry.programmaticDiet) notFound();

  return (
    <DietBlogArticleContent
      entry={entry}
      canonicalBasePath="dieta"
      siteUrl={siteUrl}
    />
  );
}

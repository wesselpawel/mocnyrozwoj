import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import {
  generateDietPages,
  slugToDietParams,
  getDietPagePath,
} from "@/programmatic/diet/generator";
import { getPublicBlogEntries, filterBlogEntriesByGeneratedDiet } from "@/lib/publicBlogEntries";
import { getAdminSessionCookieName, isValidAdminSessionToken } from "@/lib/adminAuth";
import DietBlogArticleContent from "@/components/DietBlogArticleContent";
import BlogLibraryContent from "@/app/(with-nav)/blog/BlogLibraryContent";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

const SECTION_TO_CATEGORY: Record<string, string> = {
  "na-mase": "Dieta na masę",
  "na-redukcje": "Dieta na redukcję",
  "na-utrzymanie-wagi": "Dieta na utrzymanie wagi",
  przepisy: "Przepisy dietetyczne",
};

const SECTION_META: Partial<Record<string, { title: string; description: string }>> = {
  "na-mase": {
    title: "Dieta na masę – przykładowe jadłospisy 1500–4000 kcal",
    description:
      "Sprawdź przykładowe diety na masę od 1500 do 4000 kcal. Gotowe jadłospisy z 4–6 posiłkami, kaloryczność posiłków oraz propozycje przepisów na budowę masy mięśniowej.",
  },
};

export function generateStaticParams() {
  const dietSlugs = generateDietPages().map(({ slug }) => ({ slug }));
  const sectionSlugs = Object.keys(SECTION_TO_CATEGORY).map((slug) => ({ slug }));
  return [...sectionSlugs, ...dietSlugs];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const category = SECTION_TO_CATEGORY[slug];
  if (category) {
    const custom = SECTION_META[slug];
    const title = custom ? `${custom.title} | DzienDiety` : `${category} | DzienDiety`;
    const description =
      custom?.description ?? `Artykuły z sekcji "${category}" w bibliotece wiedzy DzienDiety.`;
    return {
      title,
      description,
      alternates: { canonical: `/dieta/${slug}` },
    };
  }

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

export default async function DietaSlugPage({ params, searchParams }: Props) {
  const { slug } = await params;
  await searchParams;

  const category = SECTION_TO_CATEGORY[slug];
  if (category) {
    const entries = await getPublicBlogEntries();
    const cookieStore = await cookies();
    const token = cookieStore.get(getAdminSessionCookieName())?.value;
    const isAdmin = await isValidAdminSessionToken(token);
    const filteredEntries = filterBlogEntriesByGeneratedDiet(entries, category, isAdmin);
    return (
      <BlogLibraryContent
        selectedCategory={category}
        entries={filteredEntries}
        isAdmin={isAdmin}
      />
    );
  }

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

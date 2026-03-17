import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BlogLibraryContent from "../BlogLibraryContent";
import { categories, categorySlugs, getCategoryBySlug } from "../data";
import {
  getPublicBlogEntries,
  filterBlogEntriesByGeneratedDiet,
} from "@/lib/publicBlogEntries";
import { getAdminSessionCookieName, isValidAdminSessionToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string }>;
};

const CATEGORY_META: Partial<Record<string, { title: string; description: string }>> = {
  "dieta-na-mase": {
    title: "Dieta na masę – przykładowe jadłospisy 1500–4000 kcal",
    description:
      "Sprawdź przykładowe diety na masę od 1500 do 4000 kcal. Gotowe jadłospisy z 4–6 posiłkami, kaloryczność posiłków oraz propozycje przepisów na budowę masy mięśniowej.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Blog | DzienDiety",
      description: "Biblioteka wiedzy dietetycznej DzienDiety.",
    };
  }

  const customMeta = CATEGORY_META[categorySlug];
  const title = customMeta
    ? `${customMeta.title} | DzienDiety`
    : `${category} | Blog DzienDiety`;
  const description = customMeta?.description ?? `Artykuły z kategorii "${category}" w bibliotece wiedzy DzienDiety.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${categorySlug}`,
    },
  };
}

export function generateStaticParams() {
  return categories.map((category) => ({
    categorySlug: categorySlugs[category],
  }));
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: Props) {
  const { categorySlug } = await params;
  await searchParams;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

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

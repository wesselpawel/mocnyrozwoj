import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogLibraryContent from "../BlogLibraryContent";
import { categories, categorySlugs, getCategoryBySlug } from "../data";

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ q?: string }>;
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

  return {
    title: `${category} | Blog DzienDiety`,
    description: `Artykuły z kategorii "${category}" w bibliotece wiedzy DzienDiety.`,
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

  return <BlogLibraryContent selectedCategory={category} />;
}

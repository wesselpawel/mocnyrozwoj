import { Metadata } from "next";
import { notFound } from "next/navigation";
import { calories } from "@/programmatic/diet/data";
import {
  dietParamsToSlug,
  getDietPagePath,
  parseMealsSegment,
} from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";
import { getGeneratedProgrammaticDietSlugs } from "@/lib/publicBlogEntries";
import DietBlogArticleContent from "@/components/DietBlogArticleContent";
import type { PublicBlogEntry } from "@/lib/publicBlogEntries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

type Props = {
  params: Promise<{ calorie: string; meals: string }>;
};

function parseCalorieSegment(segment: string): number | null {
  const m = segment.match(/^(\d+)-kcal$/);
  if (!m) return null;
  const value = parseInt(m[1], 10);
  return calories.includes(value as (typeof calories)[number]) ? value : null;
}

function estimateReadTime(parts: string[]): string {
  const text = parts.join(" ").trim();
  if (!text) return "3 min";
  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min`;
}

export function generateStaticParams() {
  const params: { calorie: string; meals: string }[] = [];
  const mealSegments = ["3-posilki", "4-posilki", "5-posilkow"];
  for (const calorie of calories) {
    for (const meals of mealSegments) {
      params.push({ calorie: `${calorie}-kcal`, meals });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { calorie: calorieSegment, meals: mealsSegment } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  const mealCount = parseMealsSegment(mealsSegment);
  if (calorie === null || mealCount === null) {
    return { title: "Dieta na redukcję | DzienDiety" };
  }

  const data = getDietTemplateData({
    calorie,
    goal: "reduction",
    mealCount,
  });
  const path = getDietPagePath({ calorie, goal: "reduction", mealCount });
  const url = `${siteUrl}/dieta/${path}`;

  return {
    title: `${data.title} | DzienDiety`,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${data.title} | DzienDiety`,
      description: data.description,
      url,
      siteName: "DzienDiety",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} | DzienDiety`,
      description: data.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function DietReductionMealsPage({ params }: Props) {
  const { calorie: calorieSegment, meals: mealsSegment } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  const mealCount = parseMealsSegment(mealsSegment);
  if (calorie === null || mealCount === null) notFound();

  const templateData = getDietTemplateData({
    calorie,
    goal: "reduction",
    mealCount,
  });
  const oldSlug = dietParamsToSlug({
    calorie,
    goal: "reduction",
    mealCount,
  });
  const generatedSlugs = await getGeneratedProgrammaticDietSlugs();
  const path = getDietPagePath({ calorie, goal: "reduction", mealCount });

  const contentFromSections = templateData.sections.map((s) => s.text);
  const entry: PublicBlogEntry = {
    id: `programmatic-diet-reduction-${calorie}-${mealCount}`,
    slug: path,
    href: `/dieta/${path}`,
    title: templateData.title,
    h1: templateData.h1,
    description: templateData.description,
    category: "Dieta na redukcję",
    readTime: estimateReadTime([templateData.description, ...contentFromSections]),
    updatedAt: new Date().toLocaleDateString("pl-PL"),
    content: contentFromSections,
    sections: templateData.sections,
    faq: templateData.faq,
    programmaticDiet: {
      calories: calorie,
      goal: "reduction",
      mealCount,
    },
    hasGeneratedDietDay: generatedSlugs.has(oldSlug),
  };

  return (
    <DietBlogArticleContent
      entry={entry}
      canonicalBasePath="dieta"
      siteUrl={siteUrl}
    />
  );
}

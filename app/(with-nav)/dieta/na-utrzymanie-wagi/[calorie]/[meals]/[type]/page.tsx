import { Metadata } from "next";
import { notFound } from "next/navigation";
import { calories, dietTypes } from "@/programmatic/diet/data";
import {
  dietParamsToSlug,
  getDietPagePath,
  parseMealsSegment,
  parseDietTypeSegment,
} from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";
import { getGeneratedProgrammaticDietSlugs } from "@/lib/publicBlogEntries";
import DietBlogArticleContent from "@/components/DietBlogArticleContent";
import type { PublicBlogEntry } from "@/lib/publicBlogEntries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

type Props = {
  params: Promise<{ calorie: string; meals: string; type: string }>;
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
  const params: { calorie: string; meals: string; type: string }[] = [];
  const mealSegments = ["3-posilki", "4-posilki", "5-posilkow"];
  for (const calorie of calories) {
    for (const meals of mealSegments) {
      for (const t of dietTypes) {
        params.push({ calorie: `${calorie}-kcal`, meals, type: t.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { calorie: calorieSegment, meals: mealsSegment, type } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  const mealCount = parseMealsSegment(mealsSegment);
  const dietType = parseDietTypeSegment(type);
  if (calorie === null || mealCount === null || dietType === null) {
    return { title: "Dieta na utrzymanie wagi | DzienDiety" };
  }

  const data = getDietTemplateData({ calorie, goal: "maintenance", mealCount, dietType });
  const path = getDietPagePath({ calorie, goal: "maintenance", mealCount, dietType });
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

export default async function DietMaintenanceMealsTypePage({ params }: Props) {
  const { calorie: calorieSegment, meals: mealsSegment, type } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  const mealCount = parseMealsSegment(mealsSegment);
  const dietType = parseDietTypeSegment(type);
  if (calorie === null || mealCount === null || dietType === null) notFound();

  const templateData = getDietTemplateData({
    calorie,
    goal: "maintenance",
    mealCount,
    dietType,
  });
  const oldSlug = dietParamsToSlug({ calorie, goal: "maintenance", mealCount });
  const generatedSlugs = await getGeneratedProgrammaticDietSlugs();
  const path = getDietPagePath({ calorie, goal: "maintenance", mealCount, dietType });

  const contentFromSections = templateData.sections.map((s) => s.text);
  const entry: PublicBlogEntry = {
    id: `programmatic-diet-maintenance-${calorie}-${mealCount}-${dietType}`,
    slug: path,
    href: `/dieta/${path}`,
    title: templateData.title,
    h1: templateData.h1,
    description: templateData.description,
    category: "Dieta na utrzymanie wagi",
    readTime: estimateReadTime([templateData.description, ...contentFromSections]),
    updatedAt: new Date().toLocaleDateString("pl-PL"),
    content: contentFromSections,
    sections: templateData.sections,
    faq: templateData.faq,
    programmaticDiet: {
      calories: calorie,
      goal: "maintenance",
      mealCount,
    },
    hasGeneratedDietDay: generatedSlugs.has(oldSlug),
  };

  return (
    <DietBlogArticleContent entry={entry} canonicalBasePath="dieta" siteUrl={siteUrl} />
  );
}


import { getDocuments, getDocumentIds } from "@/firebase";
import { entries as staticEntries } from "@/app/(with-nav)/blog/data";
import { generateDietPages, getDietPagePath } from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";
import type { DietPageParams } from "@/programmatic/types";
import { getAllRecipes, getCategoryByGoal } from "@/lib/recipeService";
import type { RecipeEntry } from "@/types/recipe";

export type BlogFAQItem = {
  question: string;
  answer: string;
};

export type BlogSection = {
  id?: string;
  title: string;
  text: string;
  linkToSection?: string;
  linkText?: string;
  ctaLink?: string;
  ctaText?: string;
  video?: {
    src: string;
    title: string;
    ctaLink?: string;
    ctaText?: string;
  };
};

export type PublicBlogEntry = {
  id: string;
  slug: string;
  title: string;
  /** Optional H1 for programmatic diet pages (differs from meta title) */
  h1?: string;
  description: string;
  category: string;
  readTime: string;
  updatedAt: string;
  content: string[];
  /** Programmatic entries: sections with title + text (rendered as h2 + paragraphs) */
  sections?: BlogSection[];
  /** FAQ section */
  faq?: BlogFAQItem[];
  /** Programmatic diet params (for generating content) */
  programmaticDiet?: {
    calories: number;
    goal: "mass" | "reduction" | "maintenance";
    mealCount: number;
  };
  /** Custom href - if set, overrides the default /blog/post/{slug} URL */
  href?: string;
  /** Programmatic diet: true if this diet page has a generated day of meals in Firebase */
  hasGeneratedDietDay?: boolean;
  /** Optional image URL (e.g. recipe photo for Przepisy dietetyczne) */
  imageUrl?: string;
};

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatDate = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return new Date().toLocaleDateString("pl-PL");
  }

  if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString("pl-PL");
  }

  return date.toLocaleDateString("pl-PL");
};

const estimateReadTime = (parts: string[]) => {
  const text = parts.join(" ").trim();
  if (!text) {
    return "3 min";
  }

  const wordCount = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${minutes} min`;
};

const getRawContentParts = (post: Record<string, unknown>) => {
  const parts: string[] = [];

  for (let index = 1; index <= 7; index += 1) {
    const key = `text${index}Desc`;
    const value = post[key];
    if (typeof value === "string" && value.trim()) {
      parts.push(value);
    }
  }

  return parts;
};

const toPublicBlogEntry = (post: Record<string, unknown>): PublicBlogEntry | null => {
  const slug = typeof post.url === "string" ? post.url.trim() : "";
  const title = typeof post.title === "string" ? post.title.trim() : "";

  if (!slug || !title) {
    return null;
  }

  const rawContent = getRawContentParts(post);
  const plainContent = rawContent.map((part) => stripHtml(part)).filter(Boolean);
  const shortDesc =
    typeof post.shortDesc === "string" ? post.shortDesc.trim() : "";
  const description = shortDesc || plainContent[0] || "";
  const readTime =
    typeof post.readTime === "string" && post.readTime.trim()
      ? post.readTime.trim()
      : estimateReadTime([description, ...plainContent]);

  return {
    id: typeof post.id === "string" && post.id.trim() ? post.id : slug,
    slug,
    title,
    description,
    category:
      typeof post.category === "string" && post.category.trim()
        ? post.category.trim()
        : "Diety",
    readTime,
    updatedAt: formatDate(post.updatedAt || post.createdAt),
    content: plainContent.length ? plainContent : [description],
  };
};

const DIET_GOAL_CATEGORIES: Record<string, string> = {
  mass: "Dieta na masę",
  reduction: "Dieta na redukcję",
  maintenance: "Dieta na utrzymanie wagi",
};

/**
 * All possible Firebase document IDs for this diet (Firestore IDs cannot contain "/").
 * Used to match generated content regardless of which format was used when saving.
 */
function getPossibleGeneratedIdsForDiet(slug: string, params: DietPageParams): string[] {
  const ids: string[] = [slug];
  if (params.goal === "mass") {
    const path = getDietPagePath(params);
    ids.push(path.replace(/\//g, "-"));
  }
  return ids;
}

/** Programmatic SEO: diet pages as blog entries. hasGeneratedDietDay set by caller from Firebase. */
function getProgrammaticDietEntries(slugsWithGeneratedContent: Set<string>): PublicBlogEntry[] {
  const pages = generateDietPages();
  const today = new Date().toLocaleDateString("pl-PL");
  return pages.map(({ slug, params }) => {
    const data = getDietTemplateData(params);
    const contentFromSections = data.sections.map((s) => s.text);
    const category = DIET_GOAL_CATEGORIES[params.goal] || "Diety";
    const possibleIds = getPossibleGeneratedIdsForDiet(slug, params);
    const hasGeneratedDietDay = possibleIds.some((id) => slugsWithGeneratedContent.has(id));

    return {
      id: `programmatic-diet-${slug}`,
      slug,
      href: `/dieta/${slug}`,
      title: data.title,
      h1: data.h1,
      description: data.description,
      category,
      readTime: estimateReadTime([data.description, ...contentFromSections]),
      updatedAt: today,
      content: contentFromSections,
      sections: data.sections,
      faq: data.faq,
      programmaticDiet: {
        calories: params.calorie,
        goal: params.goal,
        mealCount: params.mealCount,
      },
      hasGeneratedDietDay,
    };
  });
}

/** Normalize a Firebase document ID for lookup (bare slug, no collection path). */
function normalizeGeneratedId(id: unknown): string {
  const s = typeof id === "string" ? id.trim() : String(id ?? "");
  if (!s) return "";
  const bareId = s.includes("/") ? s.replace(/^.*\//, "").trim() : s;
  return bareId;
}

/** Fetch all programmatic diet slugs that have a generated day of meals in Firebase. */
export async function getGeneratedProgrammaticDietSlugs(): Promise<Set<string>> {
  try {
    const ids = (await getDocumentIds("programmaticDiets")) as string[];
    const normalized = ids.map(normalizeGeneratedId).filter(Boolean);
    return new Set(normalized);
  } catch {
    return new Set();
  }
}

/** Convert recipes to blog entries for "Przepisy dietetyczne" category */
function recipeToPublicBlogEntry(recipe: RecipeEntry): PublicBlogEntry {
  const category = getCategoryByGoal(recipe.goal);
  const categorySlug = category?.slug || "na-mase";
  const fullHref = `/przepisy/${categorySlug}/${recipe.slug}`;
  
  const ingredientsList = recipe.ingredients
    .map((ing) => `${ing.name} (${ing.quantity}) - ${ing.calories} kcal`)
    .join(", ");

  return {
    id: `recipe-${recipe.slug}`,
    slug: recipe.slug,
    href: fullHref,
    title: recipe.seo.title,
    description: recipe.seo.description,
    category: "Przepisy dietetyczne",
    readTime: "3 min",
    updatedAt: new Date(recipe.generatedAt).toLocaleDateString("pl-PL"),
    content: [
      recipe.seo.description,
      `Składniki: ${ingredientsList}`,
      `Przygotowanie: ${recipe.preparationSteps.join(" ")}`,
    ],
    imageUrl: recipe.imageUrl,
  };
}

async function getRecipeEntries(): Promise<PublicBlogEntry[]> {
  try {
    const recipes = await getAllRecipes();
    return recipes.map(recipeToPublicBlogEntry);
  } catch {
    return [];
  }
}

export const getPublicBlogEntries = async (): Promise<PublicBlogEntry[]> => {
  const merged = new Map<string, PublicBlogEntry>();
  const generatedSlugs = await getGeneratedProgrammaticDietSlugs();

  for (const entry of staticEntries) {
    merged.set(entry.slug, entry);
  }

  for (const entry of getProgrammaticDietEntries(generatedSlugs)) {
    merged.set(entry.slug, entry);
  }

  // Add recipe entries to "Przepisy dietetyczne" category
  const recipeEntries = await getRecipeEntries();
  for (const entry of recipeEntries) {
    merged.set(entry.slug, entry);
  }

  try {
    const dbPosts = (await getDocuments("blog")) as Record<string, unknown>[];
    for (const post of dbPosts) {
      const entry = toPublicBlogEntry(post);
      if (entry) {
        merged.set(entry.slug, entry);
      }
    }
  } catch {
    // Public pages should still work with bundled static entries.
  }

  return Array.from(merged.values());
};

const DIET_GOAL_CATEGORIES_FOR_FILTER = [
  "Dieta na masę",
  "Dieta na redukcję",
  "Dieta na utrzymanie wagi",
] as const;

/**
 * Filter entries for display on blog (user vs admin).
 * - User: for diet goal categories, show only entries that have a generated day of meals (or static entries).
 * - Admin: for diet goal categories, show only entries that do NOT have a generated day (to see what needs generating).
 */
export function filterBlogEntriesByGeneratedDiet(
  entries: PublicBlogEntry[],
  selectedCategory: string | null,
  isAdmin: boolean
): PublicBlogEntry[] {
  return entries.filter((entry) => {
    if (!DIET_GOAL_CATEGORIES_FOR_FILTER.includes(entry.category as (typeof DIET_GOAL_CATEGORIES_FOR_FILTER)[number])) {
      return true;
    }
    if (!entry.programmaticDiet) return true;
    if (isAdmin) return entry.hasGeneratedDietDay === false;
    return entry.hasGeneratedDietDay === true;
  });
}

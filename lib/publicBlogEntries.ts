import { getDocuments } from "@/firebase";
import { entries as staticEntries } from "@/app/(with-nav)/blog/data";
import { generateDietPages } from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";

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
  description: string;
  category: string;
  readTime: string;
  updatedAt: string;
  content: string[];
  /** Programmatic entries: sections with title + text (rendered as h2 + paragraphs) */
  sections?: BlogSection[];
  /** FAQ section */
  faq?: BlogFAQItem[];
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

/** Programmatic SEO: diet pages as blog entries for category "Diety" */
function getProgrammaticDietEntries(): PublicBlogEntry[] {
  const pages = generateDietPages();
  const today = new Date().toLocaleDateString("pl-PL");
  return pages.map(({ slug, params }) => {
    const data = getDietTemplateData(params);
    const contentFromSections = data.sections.map((s) => s.text);
    return {
      id: `programmatic-diet-${slug}`,
      slug,
      title: data.title,
      description: data.description,
      category: "Diety",
      readTime: estimateReadTime([data.description, ...contentFromSections]),
      updatedAt: today,
      content: contentFromSections,
      sections: data.sections,
      faq: data.faq,
    };
  });
}

export const getPublicBlogEntries = async (): Promise<PublicBlogEntry[]> => {
  const merged = new Map<string, PublicBlogEntry>();

  for (const entry of staticEntries) {
    merged.set(entry.slug, entry);
  }

  for (const entry of getProgrammaticDietEntries()) {
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

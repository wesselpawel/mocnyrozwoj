export type Category =
  | "Dieta na masę"
  | "Dieta na redukcję"
  | "Dieta na utrzymanie wagi"
  | "Przepisy dietetyczne";

export type BlogEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  readTime: string;
  updatedAt: string;
  content: string[];
};

export const categories: Category[] = [
  "Dieta na masę",
  "Dieta na redukcję",
  "Dieta na utrzymanie wagi",
  "Przepisy dietetyczne",
];

export const categorySlugs: Record<Category, string> = {
  "Dieta na masę": "dieta-na-mase",
  "Dieta na redukcję": "dieta-na-redukcje",
  "Dieta na utrzymanie wagi": "dieta-na-utrzymanie-wagi",
  "Przepisy dietetyczne": "przepisy-dietetyczne",
};

const slugToCategoryMap = Object.entries(categorySlugs).reduce<
  Record<string, Category>
>((acc, [category, slug]) => {
  acc[slug] = category as Category;
  return acc;
}, {});

export const getCategoryBySlug = (slug?: string): Category | null => {
  if (!slug) return null;
  return slugToCategoryMap[slug] ?? null;
};

/** Static low-content placeholder entries removed; blog list uses Firestore + programmatic diets + recipes only. */
export const entries: BlogEntry[] = [];

export const getEntryBySlug = (slug: string) =>
  entries.find((entry) => entry.slug === slug) ?? null;

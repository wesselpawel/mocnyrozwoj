/**
 * Wspólne typy dla programmatic SEO.
 * Szczegóły: docs/PROGRAMMATIC-SEO-PLAN.md
 */

/** Parametry jednej strony diety (dla generatora i URL) */
export type DietPageParams = {
  calorie: number;
  goal: "reduction" | "mass" | "maintenance";
  mealCount: number;
  /** Opcjonalnie: 4. wymiar strony (/.../[type]) */
  dietType?: import("./diet/data").DietTypeSlug;
  /** Opcjonalnie: liczba dni jadłospisu */
  days?: number;
};

/** FAQ item */
export type FAQItem = {
  question: string;
  answer: string;
};

/** Sekcja artykułu */
export type ArticleSection = {
  id?: string;
  title: string;
  text: string;
  /** Optional: shows a button linking to another section */
  linkToSection?: string;
  linkText?: string;
  /** Optional: shows a CTA button linking to another page */
  ctaLink?: string;
  ctaText?: string;
  /** Optional: video embed after the section content */
  video?: {
    src: string;
    title: string;
    ctaLink?: string;
    ctaText?: string;
  };
};

/** Dane przekazywane do template / strony diety */
export type DietPageData = DietPageParams & {
  title: string;
  h1: string;
  description: string;
  sections: ArticleSection[];
  faq?: FAQItem[];
};

/** Slug celu (do mapowania na content/diet/...) */
export type GoalSlug = "reduction" | "mass" | "maintenance";

/** Parametry strony posiłku (Faza 2) */
export type MealPageParams = {
  mealType: string;
  calories: number;
};

/** Parametry strony choroby (Faza 3) */
export type DiseasePageParams = {
  diseaseSlug: string;
};

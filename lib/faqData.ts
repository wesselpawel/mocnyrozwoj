import type { FAQItem } from "@/components/FAQ";
import faqContent from "@/JSONCONTENTS/faq.json";

type FAQCategory = {
  id: string;
  title: string;
  items: FAQItem[];
};

type FAQContentFile = {
  version: string;
  lastUpdated: string;
  categories: FAQCategory[];
};

const typedFAQContent = faqContent as FAQContentFile;

export const faqCategories: FAQCategory[] = typedFAQContent.categories;

export const defaultFAQItems: FAQItem[] = faqCategories.flatMap(
  (category) => category.items,
);

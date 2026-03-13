import { BlogPost } from "@/lib/blogService";
import { CONTENT_SECTION_NUMBERS, ContentSection, SectionNumber } from "./types";

const getSectionTitle = (sectionNumber: SectionNumber) => `Sekcja ${sectionNumber}`;

const getTextTitleKey = (sectionNumber: SectionNumber) =>
  `text${sectionNumber}Title` as const;

const getTextDescKey = (sectionNumber: SectionNumber) =>
  `text${sectionNumber}Desc` as const;

export const createEmptySections = (): ContentSection[] =>
  CONTENT_SECTION_NUMBERS.map((sectionNumber) => ({
    id: sectionNumber.toString(),
    title: getSectionTitle(sectionNumber),
    content: "",
  }));

export const createSectionsFromPost = (post?: Partial<BlogPost> | null): ContentSection[] =>
  CONTENT_SECTION_NUMBERS.map((sectionNumber) => {
    const titleKey = getTextTitleKey(sectionNumber);
    const descKey = getTextDescKey(sectionNumber);

    return {
      id: sectionNumber.toString(),
      title: post?.[titleKey] || getSectionTitle(sectionNumber),
      content: post?.[descKey] || "",
    };
  });

export const mapSectionsToLegacyContentFields = (sections: ContentSection[]) =>
  CONTENT_SECTION_NUMBERS.reduce<Record<string, string>>((acc, sectionNumber) => {
    const section = sections[sectionNumber - 1];
    acc[getTextTitleKey(sectionNumber)] =
      section?.title?.trim() || getSectionTitle(sectionNumber);
    acc[getTextDescKey(sectionNumber)] = section?.content || "";
    return acc;
  }, {});

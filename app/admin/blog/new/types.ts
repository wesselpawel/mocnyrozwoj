export interface ContentSection {
  id: string;
  title: string;
  content: string;
}

export type SectionNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const CONTENT_SECTION_NUMBERS: SectionNumber[] = [1, 2, 3, 4, 5, 6, 7];

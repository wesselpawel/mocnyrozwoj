export type Category =
  | "Diety"
  | "Przykładowe dni diety"
  | "Konkretny cel dietetyczny"
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
  "Diety",
  "Przykładowe dni diety",
  "Konkretny cel dietetyczny",
  "Przepisy dietetyczne",
];

export const categorySlugs: Record<Category, string> = {
  Diety: "diety",
  "Przykładowe dni diety": "przykladowe-dni-diety",
  "Konkretny cel dietetyczny": "konkretny-cel-dietetyczny",
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

export const entries: BlogEntry[] = [
  {
    id: "diety-1",
    slug: "dieta-redukcyjna-fundamenty",
    title: "Dieta redukcyjna: fundamenty skutecznego planu",
    description:
      "Najważniejsze zasady budowania deficytu kalorycznego bez utraty komfortu i energii.",
    category: "Diety",
    readTime: "8 min",
    updatedAt: "11.03.2026",
    content: [
      "Skuteczna redukcja zaczyna się od realnego deficytu kalorycznego, który nie obniża codziennej energii i nie utrudnia pracy ani treningów.",
      "Podstawą jest regularność posiłków, wysoka podaż białka i plan zakupów oparty o produkty łatwo dostępne.",
      "Najczęstszy błąd to zbyt agresywne cięcie kalorii, które kończy się spadkiem motywacji i powrotem do dawnych nawyków.",
    ],
  },
  {
    id: "diety-2",
    slug: "dieta-wysokobialkowa-praktycznie",
    title: "Dieta wysokobiałkowa: dla kogo i jak ją zbilansować",
    description:
      "Praktyczny przewodnik po źródłach białka, proporcjach makro i błędach początkujących.",
    category: "Diety",
    readTime: "7 min",
    updatedAt: "09.03.2026",
    content: [
      "Dieta wysokobiałkowa wspiera sytość i ochronę masy mięśniowej, szczególnie podczas redukcji.",
      "Warto łączyć różne źródła białka: nabiał, jaja, mięso, ryby oraz rośliny strączkowe.",
      "Bilans nie powinien opierać się wyłącznie na białku - istotne są także tłuszcze i węglowodany dopasowane do celu.",
    ],
  },
  {
    id: "days-1",
    slug: "przykladowy-dzien-diety-1800-kcal",
    title: "Przykładowy dzień diety 1800 kcal",
    description:
      "Kompletny jadłospis na jeden dzień z podziałem na posiłki i listą zakupów.",
    category: "Przykładowe dni diety",
    readTime: "6 min",
    updatedAt: "08.03.2026",
    content: [
      "Przykładowy dzień 1800 kcal obejmuje 4-5 posiłków o stałych porach i prostym przygotowaniu.",
      "Każdy posiłek ma określoną gramaturę i podane makroskładniki, co ułatwia kontrolę postępów.",
      "Dzień kończy lista zakupów, aby plan był łatwy do wdrożenia bez dodatkowego liczenia.",
    ],
  },
  {
    id: "days-2",
    slug: "przykladowy-dzien-diety-2200-kcal",
    title: "Przykładowy dzień diety 2200 kcal",
    description:
      "Wersja dla osób o większym zapotrzebowaniu energetycznym i wysokiej aktywności.",
    category: "Przykładowe dni diety",
    readTime: "6 min",
    updatedAt: "05.03.2026",
    content: [
      "Plan 2200 kcal odpowiada osobom aktywnym, które potrzebują więcej energii w ciągu dnia.",
      "Rozkład kalorii pomiędzy posiłkami pozwala utrzymać stabilny poziom sytości i efektywność treningu.",
      "Wersję można skalować o 100-200 kcal, zachowując proporcje i strukturę dnia.",
    ],
  },
  {
    id: "goal-1",
    slug: "cel-redukcja-masy-ciala-bez-jojo",
    title: "Cel: redukcja masy ciała bez efektu jo-jo",
    description:
      "Jak planować tempo spadku wagi, monitorować postępy i utrzymać efekty długoterminowo.",
    category: "Konkretny cel dietetyczny",
    readTime: "9 min",
    updatedAt: "04.03.2026",
    content: [
      "Bezpieczne tempo redukcji to zwykle 0,3-0,8 kg tygodniowo i stała kontrola obwodów.",
      "Warto monitorować nie tylko wagę, ale też samopoczucie, sen i poziom aktywności.",
      "Utrzymanie efektów wymaga etapu stabilizacji, a nie gwałtownego powrotu do dawnych nawyków.",
    ],
  },
  {
    id: "goal-2",
    slug: "cel-poprawa-skladu-ciala",
    title: "Cel: poprawa składu ciała i budowa sylwetki",
    description:
      "Strategia łączenia żywienia z treningiem pod lepszą kompozycję ciała.",
    category: "Konkretny cel dietetyczny",
    readTime: "10 min",
    updatedAt: "02.03.2026",
    content: [
      "Poprawa składu ciała wymaga konsekwencji w jedzeniu i zaplanowanego bodźca treningowego.",
      "Kluczowe jest utrzymanie odpowiedniej podaży białka oraz progresywne zwiększanie obciążeń.",
      "Regularna analiza zdjęć sylwetki i obwodów daje pełniejszy obraz zmian niż sama masa ciała.",
    ],
  },
  {
    id: "recipes-1",
    slug: "szybkie-sniadania-wysokobialkowe",
    title: "Szybkie śniadania wysokobiałkowe",
    description:
      "Zestaw prostych przepisów do przygotowania w mniej niż 15 minut.",
    category: "Przepisy dietetyczne",
    readTime: "5 min",
    updatedAt: "01.03.2026",
    content: [
      "Wysokobiałkowe śniadanie powinno łączyć prostotę przygotowania i dobrą sytość.",
      "W artykule znajdują się przepisy z krótką listą składników i jasnym opisem kroków.",
      "Każda propozycja ma przybliżoną kaloryczność i podział makroskładników.",
    ],
  },
  {
    id: "recipes-2",
    slug: "kolacje-o-niskim-ladunku-glikemicznym",
    title: "Kolacje o niskim ładunku glikemicznym",
    description:
      "Przepisy wspierające sytość i stabilny poziom energii pod koniec dnia.",
    category: "Przepisy dietetyczne",
    readTime: "6 min",
    updatedAt: "27.02.2026",
    content: [
      "Kolacje o niskim ładunku glikemicznym pomagają ograniczyć napady głodu wieczorem.",
      "Podstawą są warzywa, źródło białka i kontrolowana porcja węglowodanów.",
      "Dobrze skomponowana kolacja wspiera regenerację nocną i komfort snu.",
    ],
  },
];

export const getEntryBySlug = (slug: string) =>
  entries.find((entry) => entry.slug === slug) ?? null;

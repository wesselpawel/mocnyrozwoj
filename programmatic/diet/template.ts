/**
 * Szablon artykułu diety: wybór treści per cel (masa / redukcja / utrzymanie)
 * i złożenie title, h1, description, sections z content blocks + zmiennych.
 */

import type { DietPageParams, DietPageData, ArticleSection } from "../types";
import { mealCountLabel } from "./generator";
import * as massContent from "@/content/diet/mass";
import * as reductionContent from "@/content/diet/reduction";
import * as maintenanceContent from "@/content/diet/maintenance";
import { getMassDietFAQ } from "@/content/diet/mass/faq";
import { getReductionDietFAQ } from "@/content/diet/reduction/faq";
import { getMaintenanceDietFAQ } from "@/content/diet/maintenance/faq";
import { dietTypes } from "./data";

/** "4 posiłki" -> "4 posiłkami" for description */
function mealsDative(meals: string): string {
  if (meals === "5 posiłków") return "5 posiłkami";
  if (meals === "4 posiłki") return "4 posiłkami";
  return "3 posiłkami";
}

/** Zwraca dane strony dla danej kombinacji (params) — do użycia w getStaticProps / page */
export function getDietTemplateData(params: DietPageParams): DietPageData {
  const { calorie, goal, mealCount } = params;

  if (goal === "mass") {
    return getMassTemplateData(params);
  }
  if (goal === "reduction") {
    return getReductionTemplateData(params);
  }
  return getMaintenanceTemplateData(params);
}

function withDietTypeVariant(base: DietPageData): DietPageData {
  if (!base.dietType) return base;
  const label = dietTypes.find((t) => t.slug === base.dietType)?.label ?? base.dietType;
  const suffix = ` (${label})`;
  return {
    ...base,
    title: `${base.title}${suffix}`,
    h1: `${base.h1}${suffix}`,
    description: `${base.description} Wariant: ${label}.`,
  };
}

function getMassTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const meals = mealCountLabel(mealCount);
  // Meta title: SEO phrase with posiłki/posiłków
  const title = `Dieta na masę ${calorie} kcal — jadłospis na 7 dni z przepisami`;
  const h1 = `Dieta na masę ${calorie} kcal — jadłospis na 7 dni, przepisy i lista zakupów`;
  const description = `Przykładowa dieta na masę ${calorie} kcal z ${mealsDative(
    meals
  )} dziennie. Zobacz kompletny przykładowy dzień z przepisami i listą zakupów oraz poznaj zasady budowania jadłospisu na 7 dni.`;

  const sections: ArticleSection[] = [
    {
      id: "dla-kogo",
      title: `Dieta na masę ${calorie} kcal – dla kogo jest odpowiednia?`,
      text: massContent.getIntro(calorie),
    },
    {
      id: "hacki-kaloryczne",
      title: "Najlepsze hacki kaloryczne na masie",
      text: massContent.getCaloricHacks(),
      linkToSection: "tabele-produktow",
      linkText: "Zobacz pełne tabele produktów wysokokalorycznych →",
    },
    {
      id: "zapotrzebowanie",
      title: "Zapotrzebowanie kaloryczne a dieta na masę",
      text: massContent.getCaloricNeeds(),
      ctaLink: "/kalkulator-kcal",
      ctaText: "Oblicz zapotrzebowanie kaloryczne w kalkulatorze kalorii →",
    },
    {
      id: "nadwyzka",
      title: "Nadwyżka kaloryczna przy budowaniu masy",
      text: massContent.getCaloricSurplus(calorie),
    },
    {
      id: "zasady",
      title: `Zasady diety na masę ${calorie} kcal`,
      text: massContent.getPrinciples(calorie, mealCount),
      ctaLink: "/generator-diety-ai",
      ctaText: "Stwórz dietę na masę w generatorze diety AI →",
    },
    {
      id: "co-jesc",
      title: `Dieta ${calorie} kcal – co jeść?`,
      text: massContent.getProducts(),
      video: {
        src: "/generator-diety-ai-video.mp4",
        title: "DIETA NA MASĘ ZA DARMO",
        ctaLink: "/generator-diety-ai",
        ctaText: "Stwórz swoją dietę w generatorze diety AI →",
      },
    },
    {
      id: "czego-unikac",
      title: `Czego unikać na diecie ${calorie} kcal?`,
      text: massContent.getMistakes(calorie),
    },
    {
      id: "tempo-budowania",
      title: "Jak szybko można budować masę mięśniową?",
      text: massContent.getProgress(),
    },
    {
      id: "podsumowanie",
      title: "Podsumowanie",
      text: massContent.getSummary(calorie),
    },
    {
      id: "powiazane-artykuly",
      title: "Powiązane artykuły",
      text: `Jeśli chcesz pogłębić wiedzę o żywieniu i treningu, sprawdź też te materiały:

- [Dieta na masę – kompletny przewodnik](/dieta/na-mase)
- [Dieta na redukcję – jak schudnąć zdrowo](/dieta/na-redukcje)
- [Dieta na utrzymanie wagi – jak utrzymać formę](/dieta/na-utrzymanie-wagi)

Więcej porad dietetycznych znajdziesz w sekcji [Diety](/dieta).`,
    },
    {
      id: "tabele-produktow",
      title: "Tabele produktów wysokokalorycznych",
      text: massContent.getProductTables(),
    },
  ];

  return withDietTypeVariant({
    ...params,
    title,
    h1,
    description,
    sections,
    faq: getMassDietFAQ(calorie),
  });
}

function getReductionTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const meals = mealCountLabel(mealCount);
  const title = `Dieta na redukcję ${calorie} kcal jadłospis ${meals}`;
  const h1 = `Dieta na redukcję ${calorie} kcal. Jadłospis, przepisy, lista zakupów`;
  const description = `Przykładowa dieta na redukcję ${calorie} kcal z ${mealsDative(meals)} dziennie. Zobacz jadłospis, rozkład kalorii oraz propozycje posiłków na redukcję tkanki tłuszczowej.`;

  const sections: ArticleSection[] = [
    {
      id: "dla-kogo",
      title: `Dieta ${calorie} kcal – dla kogo będzie odpowiednia?`,
      text: reductionContent.getIntro(calorie),
    },
    {
      id: "zapotrzebowanie",
      title: "Zapotrzebowanie kaloryczne a redukcja",
      text: reductionContent.getCaloricNeeds(),
      ctaLink: "/kalkulator-kcal",
      ctaText: "Sprawdź swoje zapotrzebowanie w kalkulatorze kalorii →",
    },
    {
      id: "deficyt",
      title: "Deficyt kaloryczny przy redukcji",
      text: reductionContent.getCaloricDeficit(calorie),
    },
    {
      id: "zasady",
      title: `Zasady diety redukcyjnej ${calorie} kcal`,
      text: reductionContent.getPrinciples(calorie, mealCount),
      ctaLink: "/generator-diety-ai",
      ctaText: "Stwórz dietę redukcyjną w generatorze diety AI →",
    },
    {
      id: "co-jesc",
      title: `Co jeść na diecie redukcyjnej ${calorie} kcal?`,
      text: reductionContent.getProducts(),
      video: {
        src: "/generator-diety-ai-video.mp4",
        title: "DIETA REDUKCYJNA ZA DARMO",
        ctaLink: "/generator-diety-ai",
        ctaText: "Stwórz swoją dietę w generatorze diety AI →",
      },
    },
    {
      id: "czego-unikac",
      title: `Czego unikać na diecie redukcyjnej?`,
      text: reductionContent.getMistakes(calorie),
    },
    {
      id: "tempo-redukcji",
      title: `Jak szybko można schudnąć na diecie ${calorie} kcal?`,
      text: reductionContent.getProgress(),
    },
    {
      id: "porownanie-kalorycznosci",
      title: `Dieta ${calorie} kcal a inne kaloryczności`,
      text: `Wybór odpowiedniej kaloryczności diety zależy od Twojej masy ciała, poziomu aktywności i celu.

| Dieta | Dla kogo najczęściej |
|-------|----------------------|
| 1500 kcal | osoby o małej masie ciała i niskiej aktywności |
| 1600–1800 kcal | umiarkowana aktywność i chęć spokojnej redukcji |
| 2000 kcal | wyższe zapotrzebowanie lub większa aktywność |

Jeśli po czasie uznasz, że potrzebujesz innej kaloryczności, możesz sprawdzić także inne przykładowe jadłospisy, np. [dieta 1800 kcal](/dieta/na-redukcje/1800-kcal) lub [dieta 2200 kcal](/dieta/na-redukcje/2200-kcal).`,
    },
    {
      id: "podsumowanie",
      title: "Podsumowanie",
      text: reductionContent.getSummary(calorie),
    },
    {
      id: "tabele-produktow",
      title: "Produkty o niskiej kaloryczności – tabela",
      text: reductionContent.getProductTables(),
      linkToSection: "co-jesc",
      linkText: "← Wróć do listy produktów",
    },
  ];

  return withDietTypeVariant({
    ...params,
    title,
    h1,
    description,
    sections,
    faq: getReductionDietFAQ(calorie),
  });
}

function getMaintenanceTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const meals = mealCountLabel(mealCount);
  const mealWord = mealCount === 3 || mealCount === 4 ? "posiłki" : "posiłków";
  const title = `Dieta na utrzymanie wagi ${calorie} kcal – jadłospis na ${mealCount} ${mealWord} + lista zakupów`;
  const h1 = `Dieta na utrzymanie wagi ${calorie} kcal – jadłospis, przepisy i lista zakupów`;
  const description = `Przykładowa dieta na utrzymanie wagi ${calorie} kcal z ${mealsDative(meals)} dziennie. Zobacz jadłospis, rozkład kalorii oraz propozycje posiłków pomagających utrzymać stabilną masę ciała.`;

  const sections: ArticleSection[] = [
    {
      id: "dla-kogo",
      title: `Dieta na utrzymanie wagi ${calorie} kcal – dla kogo jest?`,
      text: maintenanceContent.getIntro(calorie),
    },
    {
      id: "zapotrzebowanie",
      title: "Zapotrzebowanie kaloryczne a utrzymanie wagi",
      text: `Aby dobrać odpowiednią kaloryczność diety na utrzymanie wagi, warto znać swoje dzienne zapotrzebowanie energetyczne. [Oblicz je w kalkulatorze kalorii](/kalkulator-kcal) — na tej podstawie ustalisz, ile kalorii dziennie spożywać, aby masa ciała pozostawała stabilna.`,
      ctaLink: "/kalkulator-kcal",
      ctaText: "Oblicz zapotrzebowanie kaloryczne w kalkulatorze kalorii →",
    },
    {
      id: "bilans",
      title: "Bilans kaloryczny przy utrzymaniu wagi",
      text: maintenanceContent.getCaloricBalance(calorie),
    },
    {
      id: "zasady",
      title: `Zasady diety na utrzymanie wagi ${calorie} kcal`,
      text: maintenanceContent.getPrinciples(calorie, mealCount),
      ctaLink: "/generator-diety-ai",
      ctaText: "Stwórz dietę w generatorze diety AI →",
    },
    {
      id: "co-jesc",
      title: `Dieta ${calorie} kcal – co jeść przy utrzymaniu wagi?`,
      text: maintenanceContent.getProducts(),
      video: {
        src: "/generator-diety-ai-video.mp4",
        title: "DIETA NA UTRZYMANIE WAGI ZA DARMO",
        ctaLink: "/generator-diety-ai",
        ctaText: "Stwórz swoją dietę w generatorze diety AI →",
      },
    },
    {
      id: "jak-utrzymac-wage",
      title: "Jak utrzymać wagę bez ciągłego liczenia kalorii?",
      text: maintenanceContent.getCaloricHacks(),
    },
    {
      id: "czego-unikac",
      title: "Czego unikać przy utrzymaniu wagi?",
      text: maintenanceContent.getMistakes(),
    },
    {
      id: "podsumowanie",
      title: "Podsumowanie",
      text: maintenanceContent.getSummary(calorie),
    },
    {
      id: "powiazane-artykuly",
      title: "Powiązane artykuły",
      text: `Jeśli chcesz pogłębić wiedzę o żywieniu i treningu, sprawdź też te materiały:

- [Dieta na utrzymanie wagi – jak utrzymać formę](/dieta/na-utrzymanie-wagi)
- [Dieta na masę – kompletny przewodnik](/dieta/na-mase)
- [Dieta na redukcję – jak schudnąć zdrowo](/dieta/na-redukcje)
- [Kalkulator kalorii – oblicz zapotrzebowanie](/kalkulator-kcal)

Więcej porad dietetycznych znajdziesz w sekcji [Diety](/dieta).`,
    },
  ];

  return withDietTypeVariant({
    ...params,
    title,
    h1,
    description,
    sections,
    faq: getMaintenanceDietFAQ(calorie),
  });
}

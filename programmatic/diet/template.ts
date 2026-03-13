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

function getMassTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const isLowCalorie = calorie <= 2200;
  const lowCalorieDisclaimer = massContent.getLowCalorieDisclaimer(calorie);

  // SEO coverage posts (1500-2200 kcal) have different title
  const meals = mealCountLabel(mealCount);
  const title = isLowCalorie
    ? `Dieta na masę ${calorie} kcal – czy to w ogóle ma sens?`
    : `Dieta na masę ${calorie} kcal z jadłospisem na ${meals}`;
  const h1 = title;
  const description = isLowCalorie
    ? `Czy dieta ${calorie} kcal na masę mięśniową jest możliwa? Sprawdź dla kogo i kiedy ma sens. ${meals} dziennie.`
    : `Dieta ${calorie} kcal na masę mięśniową z przykładowym jadłospisem. Sprawdź zasady, produkty i ${meals} dziennie.`;

  const sections: ArticleSection[] = [];

  // For low calorie diets (1500-2200), add disclaimer as first section
  if (lowCalorieDisclaimer) {
    sections.push({
      id: "czy-ma-sens",
      title: `Dieta na masę ${calorie} kcal – czy to w ogóle ma sens?`,
      text: lowCalorieDisclaimer,
    });
  }

  // Standard mass diet sections
  sections.push(
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
      ctaText: "Oblicz swoje zapotrzebowanie kaloryczne →",
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
      ctaText: "Stwórz dietę na masę za darmo →",
    },
    {
      id: "co-jesc",
      title: `Dieta ${calorie} kcal – co jeść?`,
      text: massContent.getProducts(),
      video: {
        src: "/generator-diety-ai-video.mp4",
        title: "DIETA NA MASĘ ZA DARMO",
        ctaLink: "/generator-diety-ai",
        ctaText: "Stwórz swoją dietę teraz →",
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
      id: "tabele-produktow",
      title: "Tabele produktów wysokokalorycznych",
      text: massContent.getProductTables(),
    },
  );

  return { ...params, title, h1, description, sections, faq: getMassDietFAQ(calorie) };
}

function getReductionTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const meals = mealCountLabel(mealCount);
  const title = `Dieta redukcyjna ${calorie} kcal z jadłospisem na ${meals}`;
  const h1 = title;
  const description = `Dieta redukcyjna ${calorie} kcal z przykładowym jadłospisem. Sprawdź zasady, produkty i ${meals} dziennie.`;

  const sections = [
    { title: "Wprowadzenie", text: reductionContent.getIntro(calorie) },
    { title: "Ile posiłków dziennie?", text: `W tej diecie zalecamy ${meals} dziennie.` },
    { title: "Produkty polecane na redukcję", text: reductionContent.getProducts() },
    { title: "Częste błędy na redukcji", text: reductionContent.getMistakes() },
  ];

  return { ...params, title, h1, description, sections };
}

function getMaintenanceTemplateData(params: DietPageParams): DietPageData {
  const { calorie, mealCount } = params;
  const meals = mealCountLabel(mealCount);
  const title = `Dieta ${calorie} kcal na utrzymanie wagi z jadłospisem na ${meals}`;
  const h1 = title;
  const description = `Dieta ${calorie} kcal na utrzymanie wagi z przykładowym jadłospisem. Sprawdź zasady, produkty i ${meals} dziennie.`;

  const sections = [
    { title: "Wprowadzenie", text: maintenanceContent.getIntro(calorie) },
    { title: "Ile posiłków dziennie?", text: `W tej diecie zalecamy ${meals} dziennie.` },
    { title: "Produkty polecane na utrzymanie wagi", text: maintenanceContent.getProducts() },
    { title: "Częste błędy przy utrzymaniu wagi", text: maintenanceContent.getMistakes() },
  ];

  return { ...params, title, h1, description, sections };
}

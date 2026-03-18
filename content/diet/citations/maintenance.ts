/**
 * Cytowania – dieta na utrzymanie wagi (bilans, białko, stabilność, SSB, aktywność).
 * Używane w programmatic SEO (huby + warianty z posiłkami).
 */
import type { Citation } from "./types";

const balance: Citation[] = [
  {
    id: "hall-2012-22682202",
    authors: "Hall, K.D. et al.",
    year: 2012,
    title: "Quantification of the effect of energy imbalance on bodyweight",
    url: "https://pubmed.ncbi.nlm.nih.gov/22682202/",
    takeaway:
      "Zmiany masy ciała są bezpośrednio determinowane przez różnicę między spożyciem energii a jej wydatkowaniem.",
  },
  {
    id: "hill-2012-22990272",
    authors: "Hill, J.O. et al.",
    year: 2012,
    title: "Energy balance and obesity",
    url: "https://pubmed.ncbi.nlm.nih.gov/22990272/",
    takeaway:
      "Utrzymanie masy ciała wymaga długoterminowej równowagi pomiędzy przyjmowaną a wydatkowaną energią.",
  },
  {
    id: "maclean-2015-25614201",
    authors: "MacLean, P.S. et al.",
    year: 2015,
    title: "Biological control of appetite: maintenance after weight loss",
    url: "https://pubmed.ncbi.nlm.nih.gov/25614201/",
    takeaway:
      "Utrzymanie obniżonej masy ciała wymaga trwałej kontroli bilansu energetycznego i zachowań żywieniowych.",
  },
];

const protein: Citation[] = [
  {
    id: "leidy-2015-25926512-maint",
    authors: "Leidy, H.J. et al.",
    year: 2015,
    title: "The role of protein in weight loss and maintenance",
    url: "https://pubmed.ncbi.nlm.nih.gov/25926512/",
    takeaway:
      "Diety wyższe w białko zwiększają sytość i wspierają kontrolę masy ciała.",
  },
  {
    id: "westerterp-2004-15466943",
    authors: "Westerterp-Plantenga, M.S. et al.",
    year: 2004,
    title: "High protein intake sustains weight maintenance after body weight loss in humans",
    url: "https://pubmed.ncbi.nlm.nih.gov/15466943/",
    takeaway:
      "Wyższe spożycie białka sprzyja utrzymaniu masy ciała po jej redukcji.",
  },
  {
    id: "paddon-jones-2008-18469287",
    authors: "Paddon-Jones, D. et al.",
    year: 2008,
    title: "Protein, weight management, and satiety",
    url: "https://pubmed.ncbi.nlm.nih.gov/18469287/",
    takeaway:
      "Odpowiednia podaż białka pomaga zachować beztłuszczową masę ciała.",
  },
];

const weight_stability: Citation[] = [
  {
    id: "wing-phelan-2005-16002825",
    authors: "Wing, R.R. & Phelan, S.",
    year: 2005,
    title: "Long-term weight loss maintenance",
    url: "https://pubmed.ncbi.nlm.nih.gov/16002825/",
    takeaway:
      "Regularna aktywność fizyczna i kontrola spożycia energii są kluczowe dla utrzymania masy ciała.",
  },
  {
    id: "paixao-2020-32151763",
    authors: "Paixão, C. et al.",
    year: 2020,
    title: "Behavioral predictors of weight regain after weight loss",
    url: "https://pubmed.ncbi.nlm.nih.gov/32151763/",
    takeaway:
      "Nawyki żywieniowe i samokontrola odgrywają kluczową rolę w zapobieganiu ponownemu przyrostowi masy ciała.",
  },
  {
    id: "nwcr-2004-15536218",
    authors: "Wing, R.R. & Hill, J.O. (National Weight Control Registry)",
    year: 2004,
    title: "Successful weight loss maintenance",
    url: "https://pubmed.ncbi.nlm.nih.gov/15536218/",
    takeaway:
      "Osoby utrzymujące spadek masy ciała stosują regularne posiłki i monitorują dietę oraz aktywność.",
  },
];

const ssb: Citation[] = [
  {
    id: "malik-2013-23966427",
    authors: "Malik, V.S. et al.",
    year: 2013,
    title: "Sugar-sweetened beverages and weight gain in children and adults: a systematic review and meta-analysis",
    url: "https://pubmed.ncbi.nlm.nih.gov/23966427/",
    takeaway:
      "Spożycie napojów słodzonych jest związane ze zwiększonym ryzykiem przyrostu masy ciała.",
  },
  {
    id: "hu-2013-23744974",
    authors: "Hu, F.B.",
    year: 2013,
    title: "Resolved: there is sufficient scientific evidence that decreasing sugar-sweetened beverage consumption will reduce the prevalence of obesity and obesity-related diseases",
    url: "https://pubmed.ncbi.nlm.nih.gov/23744974/",
    takeaway:
      "Płynne kalorie z napojów słodzonych sprzyjają dodatniemu bilansowi energetycznemu.",
  },
];

const physical_activity: Citation[] = [
  {
    id: "swift-2014-24576864",
    authors: "Swift, D.L. et al.",
    year: 2014,
    title: "The role of exercise and physical activity in weight loss and maintenance",
    url: "https://pubmed.ncbi.nlm.nih.gov/24576864/",
    takeaway:
      "Aktywność fizyczna odgrywa istotną rolę w zapobieganiu ponownemu przyrostowi masy ciała.",
  },
  {
    id: "jakicic-2019-30716045",
    authors: "Jakicic, J.M. et al.",
    year: 2019,
    title: "Association between bout duration of physical activity and health: systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/30716045/",
    takeaway:
      "Wyższy poziom aktywności fizycznej sprzyja długoterminowemu utrzymaniu masy ciała.",
  },
];

export const maintenanceCitations = {
  balance,
  protein,
  weight_stability,
  ssb,
  physical_activity,
} as const;

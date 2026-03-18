/**
 * Cytowania – dieta na redukcję (deficyt, białko, tempo, sytość, adherence).
 * Używane w programmatic SEO (huby + warianty z posiłkami).
 */
import type { Citation } from "./types";

const deficit: Citation[] = [
  {
    id: "tempo-diet-2019",
    authors: "TEMPO Diet Trial",
    year: 2019,
    title:
      "Effect of Weight Loss via Severe vs Moderate Energy Restriction on Lean Mass and Body Composition Among Postmenopausal Women With Obesity: The TEMPO Diet Randomized Clinical Trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/31664441/",
    takeaway:
      "Większy (agresywniejszy) deficyt zwiększa tempo utraty masy, ale rośnie ryzyko utraty beztłuszczowej masy i trudniejszej realizacji diety.",
  },
  {
    id: "adaptive-thermogenesis-23404923",
    authors: "Rosenbaum & Leibel",
    year: 2013,
    title: "Adaptive thermogenesis with weight loss in humans",
    url: "https://pubmed.ncbi.nlm.nih.gov/23404923/",
    takeaway:
      "W trakcie deficytu pojawiają się adaptacje (spadek wydatku energetycznego), które mogą utrudniać dalszą redukcję i utrzymanie efektów.",
  },
];

const protein: Citation[] = [
  {
    id: "leidy-2015-25926512",
    authors: "Leidy, H.J. et al.",
    year: 2015,
    title: "The role of protein in weight loss and maintenance",
    url: "https://pubmed.ncbi.nlm.nih.gov/25926512/",
    takeaway:
      "Wyższe spożycie białka wspiera kontrolę apetytu i pomaga chronić masę beztłuszczową podczas redukcji.",
  },
  {
    id: "protein-restriction-35538903",
    authors: "Ogilvie et al.",
    year: 2022,
    title:
      "Higher protein intake during caloric restriction improves diet quality and attenuates loss of lean body mass",
    url: "https://pubmed.ncbi.nlm.nih.gov/35538903/",
    takeaway:
      "W trakcie ograniczenia kalorii wyższe białko wiąże się z mniejszą utratą masy beztłuszczowej.",
  },
];

const rate: Citation[] = [
  {
    id: "garthe-2011-21558571",
    authors: "Garthe, I. et al.",
    year: 2011,
    title:
      "Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes",
    url: "https://pubmed.ncbi.nlm.nih.gov/21558571/",
    takeaway:
      "Szybsze tempo redukcji może pogarszać jakość składu ciała; wolniejsze zmiany często sprzyjają ochronie FFM.",
  },
  {
    id: "purcell-2014-25324020",
    authors: "Purcell et al.",
    year: 2014,
    title:
      "Gradual weight loss is no better than rapid weight loss for long term weight control",
    url: "https://pubmed.ncbi.nlm.nih.gov/25324020/",
    takeaway:
      "Długoterminowo ważniejsze od samego tempa bywa to, czy plan da się utrzymać; szybka redukcja nie musi oznaczać gorszej kontroli w dłuższym okresie.",
  },
  {
    id: "rate-compensations-28479016",
    authors: "Trial investigators",
    year: 2017,
    title:
      "The impact of rate of weight loss on body composition and compensatory mechanisms during weight reduction: A randomized control trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/28479016/",
    takeaway:
      "Tempo redukcji wpływa na odpowiedzi metaboliczne/kompensacyjne; przy zbyt agresywnym podejściu rosną koszty (np. adaptacje).",
  },
];

const satiety: Citation[] = [
  {
    id: "weigle-2005-16002798",
    authors: "Weigle, D.S. et al.",
    year: 2005,
    title:
      "A high-protein diet induces sustained reductions in appetite, ad libitum caloric intake, and body weight despite compensatory changes in diurnal plasma leptin and ghrelin concentrations",
    url: "https://pubmed.ncbi.nlm.nih.gov/16002798/",
    takeaway:
      "Dieta wysokobiałkowa może zmniejszać apetyt i spontaniczne spożycie kalorii podczas ograniczenia energii.",
  },
  {
    id: "clark-slavin-2013-23885994",
    authors: "Clark, M.J. & Slavin, J.L.",
    year: 2013,
    title: "The effect of fiber on satiety and food intake: a systematic review",
    url: "https://pubmed.ncbi.nlm.nih.gov/23885994/",
    takeaway:
      "Błonnik wspiera sytość, choć efekty zależą od rodzaju i kontekstu diety; w praktyce pomaga ograniczać głód.",
  },
];

const adherence: Citation[] = [
  {
    id: "calerie2-adherence-32144378",
    authors: "Dorling et al.",
    year: 2020,
    title:
      "Changes in body weight, adherence, and appetite during 2 years of calorie restriction: the CALERIE 2 randomized clinical trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/32144378/",
    takeaway:
      "Długoterminowa redukcja wymaga utrzymania deficytu — apetyt i zachowania mogą się zmieniać, dlatego liczy się realna adherencja.",
  },
  {
    id: "calerie2-adherence-metrics-35240264",
    authors: "Martin et al.",
    year: 2022,
    title:
      "Challenges in defining successful adherence to calorie restriction goals in humans: Results from CALERIE™ 2",
    url: "https://pubmed.ncbi.nlm.nih.gov/35240264/",
    takeaway:
      "Krytyczne jest, czy uda się utrzymać cele (zakresy i pomiar) — perfekcja i skrajne restrykcje nie są warunkiem sukcesu.",
  },
];

export const reductionCitations = {
  deficit,
  protein,
  rate,
  satiety,
  adherence,
} as const;

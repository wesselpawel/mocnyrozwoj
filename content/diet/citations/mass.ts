/**
 * Cytowania – dieta na masę (nadwyżka, białko, tempo, kontekst).
 * Źródła: PubMed. Używane w hubach i w blokach treści (getCaloricSurplus, principles itd.).
 */
import type { Citation } from "./types";

const surplus: Citation[] = [
  {
    id: "bray-2012",
    authors: "Bray, G.A. et al.",
    year: 2012,
    title: "Effect of dietary protein content on weight gain, energy expenditure, and body composition during overeating",
    url: "https://pubmed.ncbi.nlm.nih.gov/22215165/",
    takeaway: "Nadwyżka kalorii → przyrost tłuszczu i FFM; proporcje zależą od białka.",
  },
  {
    id: "garthe-2013-surplus",
    authors: "Garthe, I. et al.",
    year: 2013,
    title: "Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes",
    url: "https://pubmed.ncbi.nlm.nih.gov/23645331/",
    takeaway: "Wolniejsze tempo zmian masy → lepsza jakość składu ciała (kontekst także dla budowania masy).",
  },
];

const protein: Citation[] = [
  {
    id: "morton-2018",
    authors: "Morton, R.W. et al.",
    year: 2018,
    title: "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength",
    url: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
    takeaway: "Białko ↑ → większy przyrost FFM przy treningu; plateau ok. 1,6 g/kg.",
  },
  {
    id: "cermak-2012",
    authors: "Cermak, N.M. et al.",
    year: 2012,
    title: "Protein supplementation augments the adaptive response of skeletal muscle to resistance-type exercise training",
    url: "https://pubmed.ncbi.nlm.nih.gov/22308314/",
    takeaway: "Suplementacja białka → wzrost masy mięśniowej i siły.",
  },
  {
    id: "antonio-2014",
    authors: "Antonio, J. et al.",
    year: 2014,
    title: "The effects of a high protein diet on indices of health and body composition",
    url: "https://pubmed.ncbi.nlm.nih.gov/24834017/",
    takeaway: "Bardzo wysokie białko (~2,2–3,4 g/kg) przy nadwyżce → brak wzrostu tłuszczu.",
  },
  {
    id: "longland-2016",
    authors: "Longland, T.M. et al.",
    year: 2016,
    title: "Higher compared with lower dietary protein during an energy deficit combined with intense exercise promotes greater lean mass gain and fat mass loss",
    url: "https://pubmed.ncbi.nlm.nih.gov/26817506/",
    takeaway: "Silny wpływ białka + treningu na FFM (badanie w deficycie, ważne kontekstowo).",
  },
];

const timing: Citation[] = [
  {
    id: "areta-2013",
    authors: "Areta, J.L. et al.",
    year: 2013,
    title: "Timing and distribution of protein ingestion during prolonged recovery from resistance exercise alters myofibrillar protein synthesis",
    url: "https://pubmed.ncbi.nlm.nih.gov/23459753/",
    takeaway: "~20 g białka co ~3 h → korzystny wpływ na syntezę białek mięśniowych.",
  },
  {
    id: "moore-2009",
    authors: "Moore, D.R. et al.",
    year: 2009,
    title: "Ingested protein dose response of muscle and albumin protein synthesis after resistance exercise in young men",
    url: "https://pubmed.ncbi.nlm.nih.gov/19056590/",
    takeaway: "~20–40 g białka na posiłek maksymalizuje syntezę białek mięśniowych.",
  },
];

const rate: Citation[] = [
  {
    id: "garthe-2013-rate",
    authors: "Garthe, I. et al.",
    year: 2013,
    title: "Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes",
    url: "https://pubmed.ncbi.nlm.nih.gov/23645331/",
    takeaway: "Wolniejsze tempo → mniej tłuszczu, lepszy skład ciała.",
  },
  {
    id: "helms-2014",
    authors: "Helms, E.R. et al.",
    year: 2014,
    title: "Evidence-based recommendations for natural bodybuilding contest preparation",
    url: "https://pubmed.ncbi.nlm.nih.gov/24982771/",
    takeaway: "Zalecenia: ~0,25–0,5% masy ciała/tydz. przyrostu.",
  },
];

const context: Citation[] = [
  {
    id: "phillips-2014",
    authors: "Phillips, S.M.",
    year: 2014,
    title: "A brief review of critical processes in exercise-induced muscular hypertrophy",
    url: "https://pubmed.ncbi.nlm.nih.gov/24812050/",
    takeaway: "Początkujący budują mięśnie szybciej niż zaawansowani.",
  },
  {
    id: "aragon-schoenfeld-2013",
    authors: "Aragon, A.A. & Schoenfeld, B.J.",
    year: 2013,
    title: "Is there a maximum anabolic response to protein intake with a meal?",
    url: "https://pubmed.ncbi.nlm.nih.gov/23360586/",
    takeaway: "Skład ciała zależy od wielu czynników (BF, doświadczenie, hormony).",
  },
];

const macros: Citation[] = [
  {
    id: "hall-2015",
    authors: "Hall, K.D. et al.",
    year: 2015,
    title: "Calorie for calorie, dietary fat restriction results in more body fat loss than carbohydrate restriction in people with obesity",
    url: "https://pubmed.ncbi.nlm.nih.gov/26278052/",
    takeaway: "Przy tej samej kaloryczności różnice między makrami mniejsze niż się często sądzi.",
  },
];

export const massCitations = {
  surplus,
  protein,
  timing,
  rate,
  context,
  macros,
} as const;

/**
 * Jedna pozycja bibliograficzna (badanie kliniczne / przegląd).
 * Używane w treściach programmatic SEO (dieta na masę, redukcję, utrzymanie).
 */
export type Citation = {
  /** Krótki identyfikator (np. "bray-2012") */
  id: string;
  /** Autorzy w formacie "Pierwszy Autor et al." lub "Autor1, Autor2" */
  authors: string;
  year: number;
  /** Pełny tytuł pracy */
  title: string;
  /** Link do PubMed / PMC / DOI */
  url: string;
  /** Krótki wniosek do wplecenia w tekście (opcjonalnie) */
  takeaway?: string;
};

/**
 * Tematy, do których przypisujemy cytowania (per cel diety).
 * Rozszerzaj w zależności od potrzeb (np. reduction: deficit, protein, rate, adherence).
 */
export type MassCitationTheme =
  | "surplus"       // nadwyżka kaloryczna, skład przyrostu
  | "protein"       // białko + trening, FFM
  | "timing"        // rozkład białka w ciągu dnia
  | "rate"          // tempo przyrostu masy (kg/tydz.)
  | "context"       // poziom zaawansowania, BF, genetyka
  | "macros";       // węgle vs tłuszcze (drugorzędne)

export type ReductionCitationTheme =
  | "deficit"
  | "protein"
  | "rate"
  | "satiety"
  | "adherence";

export type MaintenanceCitationTheme =
  | "balance"
  | "protein"
  | "weight_stability"
  | "ssb"
  | "physical_activity";

export type CitationTheme = MassCitationTheme | ReductionCitationTheme | MaintenanceCitationTheme;

export type DietGoal = "mass" | "reduction" | "maintenance";

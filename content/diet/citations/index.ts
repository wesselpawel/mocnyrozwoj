/**
 * Centralna biblioteka cytowań dla treści programmatic SEO (dieta na masę, redukcję, utrzymanie).
 * Dodaj nowe cele w types.ts (CitationTheme) i nowy plik <goal>.ts, potem zarejestruj poniżej.
 */
import type { Citation, DietGoal } from "./types";
import { massCitations } from "./mass";
import { reductionCitations } from "./reduction";
import { maintenanceCitations } from "./maintenance";

export type { Citation, MassCitationTheme, ReductionCitationTheme, MaintenanceCitationTheme, DietGoal } from "./types";
export { formatCitationMarkdown, formatCitationLabel, formatCitationsBlock } from "./format";

const byGoal = {
  mass: massCitations,
  reduction: reductionCitations,
  maintenance: maintenanceCitations,
} as const;

type MassTheme = keyof typeof massCitations;
type ReductionTheme = keyof typeof reductionCitations;
type MaintenanceTheme = keyof typeof maintenanceCitations;

/** Pobierz listę cytowań dla danego celu i tematu (np. mass + surplus). */
export function getCitations(
  goal: "mass",
  theme: MassTheme
): Citation[];
export function getCitations(
  goal: "reduction",
  theme: ReductionTheme
): Citation[];
export function getCitations(
  goal: "maintenance",
  theme: MaintenanceTheme
): Citation[];
export function getCitations(goal: DietGoal, theme: string): Citation[] {
  const map = byGoal[goal] as Record<string, Citation[]>;
  return map?.[theme] ?? [];
}

/** Eksport surowych danych (np. do listy „Źródła” na stronie). */
export { massCitations, reductionCitations, maintenanceCitations };

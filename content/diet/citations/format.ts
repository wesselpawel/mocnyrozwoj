/**
 * Formatowanie cytowań do wplecenia w treść (markdown) lub do listy źródeł.
 */
import type { Citation } from "./types";

/** Link w formacie Markdown: [Authors (year)](url) */
export function formatCitationMarkdown(c: Citation): string {
  return `[${c.authors} (${c.year})](${c.url})`;
}

/** Krótka etykieta do zdania: "Bray et al. (2012)" */
export function formatCitationLabel(c: Citation): string {
  return `${c.authors.replace(/ et al\.?$/i, " i in.")} (${c.year})`;
}

/**
 * Zdanie z linkami do badań do wplecenia w treść (markdown).
 * @param sentenceFragment - np. "nadwyżka kaloryczna wpływa na skład przyrostu masy" lub "tempo przyrostu wpływa na jakość składu ciała"
 */
export function formatCitationsBlock(
  citations: Citation[],
  sentenceFragment: string,
  intro = "Według badań"
): string {
  if (citations.length === 0) return "";
  const labels = citations.map((c) => formatCitationLabel(c)).join("; ");
  const links = citations.map((c) => formatCitationMarkdown(c)).join(", ");
  return `${intro} (${labels}) ${sentenceFragment}. Źródła: ${links}.`;
}

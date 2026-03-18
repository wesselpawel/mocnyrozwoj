"use client";

import Link from "next/link";
import { getCitations, formatCitationLabel } from "@/content/diet/citations";

export type CitationBlockProps = {
  goal: "mass" | "reduction" | "maintenance";
  /** Klucz tematu z content/diet/citations (np. surplus, protein, rate) */
  theme: string;
  sentenceFragment: string;
  intro?: string;
  className?: string;
};

export default function CitationBlock(props: CitationBlockProps) {
  const { goal, theme, sentenceFragment, intro = "Według badań", className = "" } = props;
  // getCitations() ma overloady dla pojedynczych celów, a tutaj mamy unijne `goal`,
  // więc rzutujemy, aby wywołać implementację i uniknąć konfliktów typów.
  const citations = getCitations(goal as any, theme as any);
  if (citations.length === 0) return null;

  const labels = citations.map((c) => formatCitationLabel(c)).join(", ");

  return (
    <p className={`text-sm text-zinc-600 leading-relaxed ${className}`.trim()}>
      {intro} ({labels}) {sentenceFragment}. Źródła:{" "}
      {citations.map((c, i) => (
        <span key={c.id}>
          <Link
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e77503] hover:underline font-medium"
          >
            {formatCitationLabel(c)}
          </Link>
          {i < citations.length - 1 ? ", " : "."}
        </span>
      ))}
    </p>
  );
}

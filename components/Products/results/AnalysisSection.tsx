import { FaBullseye, FaExclamationTriangle, FaLightbulb } from "react-icons/fa";
import { ReactNode } from "react";
import { AnalizaDiety } from "./types";

type AnalysisSectionProps = {
  analysis: AnalizaDiety;
};

function AnalysisList({
  title,
  icon,
  items,
  accent,
}: {
  title: string;
  icon: ReactNode;
  items: string[];
  accent: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <h4 className="text-base lg:text-lg font-bold text-zinc-900 flex items-center gap-2">
        <span className={accent}>{icon}</span>
        {title}
      </h4>
      <ul className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}`}
            className="text-sm text-zinc-700 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function AnalysisSection({ analysis }: AnalysisSectionProps) {
  const porady = analysis.porady_dla_ciebie ?? [];
  const unikac = analysis.czego_unikac ?? [];
  const bledy = analysis.najczestsze_bledy ?? [];

  if (!porady.length && !unikac.length && !bledy.length) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-white p-5 lg:p-6 shadow-lg border border-zinc-100">
      <div className="grid grid-cols-1 gap-4">
        <AnalysisList
          title="Porady dla Ciebie"
          icon={<FaLightbulb />}
          items={porady}
          accent="text-[#e77503]"
        />
        <AnalysisList
          title="Czego unikać"
          icon={<FaExclamationTriangle />}
          items={unikac}
          accent="text-red-500"
        />
        <AnalysisList
          title="Najczęstsze błędy"
          icon={<FaBullseye />}
          items={bledy}
          accent="text-purple-600"
        />
      </div>
    </section>
  );
}

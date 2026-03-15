import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { calories } from "@/programmatic/diet/data";
import { getMassHubPath, mealCountToSegment, mealCountLabel } from "@/programmatic/diet/generator";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

type Props = {
  params: Promise<{ calorie: string }>;
};

function parseCalorieSegment(segment: string): number | null {
  const m = segment.match(/^(\d+)-kcal$/);
  if (!m) return null;
  const value = parseInt(m[1], 10);
  return calories.includes(value as (typeof calories)[number]) ? value : null;
}

export function generateStaticParams() {
  return calories.map((calorie) => ({
    calorie: `${calorie}-kcal`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { calorie: calorieSegment } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  if (calorie === null) {
    return { title: "Dieta na masę | DzienDiety" };
  }

  const title = `Dieta na masę ${calorie} kcal – przykładowe jadłospisy`;
  const description = `Przykładowe diety na masę ${calorie} kcal. Wybierz jadłospis na 3, 4 lub 5 posiłków – przepisy, rozkład kalorii i lista zakupów na budowę masy mięśniowej.`;
  const url = `${siteUrl}/dieta/na-mase/${calorie}-kcal`;

  return {
    title: `${title} | DzienDiety`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | DzienDiety`, description, url },
    robots: { index: true, follow: true },
  };
}

export default async function DietMassHubPage({ params }: Props) {
  const { calorie: calorieSegment } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  if (calorie === null) notFound();

  const mealVariants = [
    { count: 3, segment: mealCountToSegment(3), label: mealCountLabel(3) },
    { count: 4, segment: mealCountToSegment(4), label: mealCountLabel(4) },
    { count: 5, segment: mealCountToSegment(5), label: mealCountLabel(5) },
  ];

  return (
    <main className="min-h-screen bg-white pt-28 pb-16 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-sm text-zinc-500 font-montserrat"
        >
          <Link href="/" className="hover:text-[#e77503] transition-colors">
            Strona główna
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="hover:text-[#e77503] transition-colors">
            Diety
          </Link>{" "}
          /{" "}
          <Link href="/blog/dieta-na-mase" className="hover:text-[#e77503] transition-colors">
            Dieta na masę
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{calorie} kcal</span>
        </nav>

        <header className="rounded-3xl border border-[#e77503]/20 bg-[#fff9f3] p-6 sm:p-8 lg:p-10 mb-10">
          <h1 className="font-montserrat font-extrabold tracking-[0.05rem] text-3xl sm:text-4xl text-[#1f1d1d]">
            Dieta na masę {calorie} kcal
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-700 leading-relaxed">
            Wybierz jadłospis według liczby posiłków. Każdy wariant zawiera przykładowy dzień,
            rozkład makroskładników, przepisy i listę zakupów.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8" aria-labelledby="jadlospisy-wedlug-posilkow">
          <h2 id="jadlospisy-wedlug-posilkow" className="font-montserrat font-bold text-xl text-zinc-900 mb-6 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jadłospisy na {calorie} kcal
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealVariants.map(({ segment, label }) => (
              <li key={segment}>
                <Link
                  href={`/dieta/na-mase/${calorie}-kcal/${segment}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 hover:border-[#e77503] hover:bg-[#e77503]/5 transition-colors group"
                >
                  <span className="font-semibold text-zinc-900 group-hover:text-[#e77503]">
                    Jadłospis na {label}
                  </span>
                  <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <Link
            href="/blog/dieta-na-mase"
            className="text-[#e77503] font-semibold hover:underline"
          >
            ← Wszystkie diety na masę (1500–4000 kcal)
          </Link>
        </div>
      </div>
    </main>
  );
}

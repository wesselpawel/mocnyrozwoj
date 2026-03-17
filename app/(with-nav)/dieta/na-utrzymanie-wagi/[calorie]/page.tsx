import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { calories } from "@/programmatic/diet/data";
import {
  getMaintenanceHubPath,
  mealCountToSegment,
  mealCountLabel,
} from "@/programmatic/diet/generator";
import NewsletterSignup from "@/components/NewsletterSignup";

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
    return { title: "Dieta na utrzymanie wagi | DzienDiety" };
  }

  const title = `Dieta na utrzymanie wagi ${calorie} kcal – przykładowe jadłospisy`;
  const description = `Przykładowe diety na utrzymanie wagi ${calorie} kcal. Wybierz jadłospis na 3, 4 lub 5 posiłków – przepisy, rozkład kalorii i lista zakupów.`;
  const url = `${siteUrl}/dieta/${getMaintenanceHubPath(calorie)}`;

  return {
    title: `${title} | DzienDiety`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | DzienDiety`, description, url },
    robots: { index: true, follow: true },
  };
}

export default async function DietMaintenanceHubPage({ params }: Props) {
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
          <Link href="/dieta" className="hover:text-[#e77503] transition-colors">
            Diety
          </Link>{" "}
          /{" "}
          <Link
            href="/dieta/na-utrzymanie-wagi"
            className="hover:text-[#e77503] transition-colors"
          >
            Dieta na utrzymanie wagi
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{calorie} kcal</span>
        </nav>

        <header className="rounded-3xl border border-[#e77503]/20 bg-[#fff9f3] p-6 sm:p-8 lg:p-10 mb-10">
          <h1 className="font-montserrat font-extrabold tracking-[0.05rem] text-3xl sm:text-4xl text-[#1f1d1d]">
            Dieta na utrzymanie wagi {calorie} kcal
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-700 leading-relaxed">
            Wybierz jadłospis według liczby posiłków. Każdy wariant zawiera
            przykładowy dzień, rozkład makroskładników, przepisy i listę zakupów
            na utrzymanie stabilnej masy ciała.
          </p>
        </header>

        <section
          className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
          aria-labelledby="jadlospisy-wedlug-posilkow"
        >
          <h2
            id="jadlospisy-wedlug-posilkow"
            className="font-montserrat font-bold text-xl text-zinc-900 mb-6 flex items-center gap-3"
          >
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jadłospisy na {calorie} kcal
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mealVariants.map(({ segment, label }) => (
              <li key={segment}>
                <Link
                  href={`/dieta/na-utrzymanie-wagi/${calorie}-kcal/${segment}`}
                  className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 hover:border-[#e77503] hover:bg-[#e77503]/5 transition-colors group"
                >
                  <span className="font-semibold text-zinc-900 group-hover:text-[#e77503]">
                    Jadłospis na {label}
                  </span>
                  <span className="text-zinc-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/dieta/na-utrzymanie-wagi"
            className="text-[#e77503] font-semibold hover:underline"
          >
            ← Wszystkie diety na utrzymanie wagi (1500–4000 kcal)
          </Link>
          <p className="text-sm text-zinc-500">
            Zobacz też:{" "}
            <Link href="/dieta/na-mase" className="text-[#e77503] hover:underline">
              dieta na masę
            </Link>
            ,{" "}
            <Link href="/dieta/na-redukcje" className="text-[#e77503] hover:underline">
              dieta na redukcję
            </Link>
            .
          </p>
        </div>

        <section className="mt-16 py-16 px-6 rounded-3xl border border-[#e77503]/20 bg-[#fff9f3]" aria-labelledby="newsletter-utrzymanie">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="newsletter-utrzymanie" className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl text-[#1f1d1d] mb-4">
              Bądź na bieżąco – dieta na utrzymanie wagi
            </h2>
            <p className="text-base text-zinc-600 mb-8 leading-relaxed">
              Zapisz się do newslettera i otrzymuj informacje o najnowszych
              planach dietetycznych na utrzymanie wagi, promocjach i wskazówkach żywieniowych
              prosto na swoją skrzynkę email.
            </p>
            <NewsletterSignup />
            <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap">
              {["Bezpłatne informacje", "Możliwość rezygnacji w każdej chwili", "Bez spamu"].map((item) => (
                <div key={item} className="w-max max-w-full flex items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

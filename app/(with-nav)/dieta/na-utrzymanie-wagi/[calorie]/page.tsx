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
import { maintenanceRange, weightFemaleFromCalorie } from "@/content/diet/exampleByCalorie";
import { getMaintenanceDietPreviews } from "@/lib/getMaintenanceDietPreviews";
import NewsletterSignup from "@/components/NewsletterSignup";
import KalkulatorStyleHero from "@/components/KalkulatorStyleHero";
import FAQ from "@/components/FAQ";

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

/** Zakres wyższych kalorii (następne wartości w liście 1500–4000) do linków. */
function getSuggestedHigherCalorieRangeForMaintenance(
  calorie: number,
): { min: number; max: number } | null {
  const next = calories.filter((c) => c > calorie);
  if (next.length === 0) return null;
  const maxTarget = next.find((c) => c >= 2500) ?? next[next.length - 1];
  return { min: next[0], max: maxTarget };
}

/** Sąsiednie kalorie w liście (poprzednia / następna) do sekcji „Zobacz także”. */
function getAdjacentCalories(calorie: number): { prev: number | null; next: number | null } {
  const idx = calories.indexOf(calorie as (typeof calories)[number]);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? calories[idx - 1] : null,
    next: idx < calories.length - 1 ? calories[idx + 1] : null,
  };
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

  const previews = await getMaintenanceDietPreviews(calorie);
  const higherRange = getSuggestedHigherCalorieRangeForMaintenance(calorie);
  const { prev: prevCal, next: nextCal } = getAdjacentCalories(calorie);
  const wK = weightFemaleFromCalorie(calorie);
  const { min: kcalMinK, max: kcalMaxK } = maintenanceRange(calorie);

  const hubFaq = [
    {
      question: `Czy ${calorie} kcal wystarczy na utrzymanie wagi?`,
      answer:
        "Tak, jeśli odpowiada Twojemu dziennemu zapotrzebowaniu kalorycznemu (TDEE). W przeciwnym razie może prowadzić do spadku lub wzrostu masy ciała.",
    },
    {
      question: `Ile białka na ${calorie} kcal na utrzymanie?`,
      answer:
        `Zazwyczaj ${Math.round((calorie * 0.15) / 4)}–${Math.round((calorie * 0.25) / 4)} g dziennie, w zależności od poziomu aktywności i masy ciała.`,
    },
    {
      question: `Czy dieta ${calorie} kcal jest dobra dla każdego?`,
      answer:
        "Nie — to raczej niższa kaloryczność, odpowiednia głównie dla osób o mniejszym zapotrzebowaniu energetycznym.",
    },
    {
      question: "Ile posiłków najlepiej jeść na utrzymaniu wagi?",
      answer:
        "Tyle, ile najlepiej pasuje do Twojego stylu życia — najważniejsza jest suma kalorii i jakość diety.",
    },
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

        <KalkulatorStyleHero
          className="mt-10 mb-10"
          title={
            <>
              DIETA <br /> NA UTRZYMANIE
            </>
          }
          tagline={
            <>
              {calorie} KCAL <span className="hidden sm:inline">—</span> UTRZYMAJ
              FORMĘ
            </>
          }
          description={
            <p>
              Gotowe jadłospisy {calorie} kcal na utrzymanie wagi: wybierz liczbę
              posiłków i przejdź do planu dnia z przepisami oraz listą zakupów.
            </p>
          }
          bullets={["Jadłospisy 3–5 posiłków", "Lista zakupów", "Przepisy"]}
          ariaLabel="Wygeneruj dietę AI (utrzymanie wagi) po kliknięciu w wideo"
          ctaLabel="Rozpocznij"
        />

        {/* Dieta na utrzymanie wagi X kcal – dla kogo? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dla-kogo">
          <h2 id="dla-kogo" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Dieta na utrzymanie wagi {calorie} kcal – dla kogo?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Dieta na utrzymanie wagi {calorie} kcal to plan żywieniowy przeznaczony dla osób, które chcą zachować obecną masę ciała przy stosunkowo niskim zapotrzebowaniu kalorycznym. Najczęściej sprawdzi się u:
          </p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-2 mb-4">
            <li>
              <strong>kobiet o niższej masie ciała</strong> – np. przy wadze około {wK} kg i wzroście 160 cm (zapotrzebowanie na utrzymanie to wtedy ok. {kcalMinK}–{kcalMaxK} kcal);
            </li>
            <li>osób prowadzących siedzący tryb życia;</li>
            <li>osób z wolniejszym metabolizmem;</li>
            <li>osób po redukcji, które chcą utrzymać efekty.</li>
          </ul>
          {higherRange && (
            <p className="text-zinc-700 leading-relaxed">
              Jeśli Twoje zapotrzebowanie kaloryczne jest wyższe, warto rozważyć{" "}
              <Link
                href={`/dieta/na-utrzymanie-wagi/${higherRange.min}-kcal`}
                className="text-[#e77503] font-semibold hover:underline"
              >
                dietę {higherRange.min}–{higherRange.max} kcal
              </Link>
              .
            </p>
          )}
        </section>

        {/* Czy na X kcal można utrzymać wagę? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="czy-utrzymasz">
          <h2 id="czy-utrzymasz" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Czy na {calorie} kcal można utrzymać wagę?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Utrzymanie masy ciała zależy od Twojego zapotrzebowania energetycznego (TDEE). Jeśli {calorie} kcal odpowiada Twojemu zapotrzebowaniu:
          </p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-2 mb-4">
            <li>Twoja masa ciała powinna pozostać stabilna;</li>
            <li>niewielkie wahania wagi są normalne (np. przez wodę lub cykl hormonalny);</li>
            <li>długoterminowy trend powinien być stały.</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed mb-2">
            Jeśli {calorie} kcal to dla Ciebie <strong>za mało</strong>, możesz stopniowo tracić na wadze.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Jeśli <strong>za dużo</strong>, możesz powoli przybierać na wadze. Dlatego warto regularnie monitorować wagę i samopoczucie.
          </p>
        </section>

        {/* Makroskładniki */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="makroskladniki">
          <h2 id="makroskladniki" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Makroskładniki w diecie {calorie} kcal na utrzymanie
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">Przykładowy rozkład makroskładników:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mb-4">
            <li>
              Białko: 15–25% (ok. {Math.round((calorie * 0.15) / 4)}–{Math.round((calorie * 0.25) / 4)} g)
            </li>
            <li>
              Tłuszcze: 25–35% (ok. {Math.round((calorie * 0.25) / 9)}–{Math.round((calorie * 0.35) / 9)} g)
            </li>
            <li>
              Węglowodany: 40–60% (ok. {Math.round((calorie * 0.4) / 4)}–{Math.round((calorie * 0.6) / 4)} g)
            </li>
          </ul>
          <p className="text-zinc-700 leading-relaxed">
            Białko wspiera regenerację organizmu i utrzymanie masy mięśniowej, węglowodany dostarczają energii do codziennych aktywności, a tłuszcze są ważne dla hormonów i zdrowia ogólnego.
          </p>
        </section>

        {/* Jadłospisy na X kcal */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="jadlospisy-wedlug-posilkow">
          <h2 id="jadlospisy-wedlug-posilkow" className="font-montserrat font-bold text-xl text-zinc-900 mb-2 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jadłospisy na {calorie} kcal
          </h2>
          <p className="text-zinc-600 text-sm mb-6">
            Poniżej znajdziesz gotowe warianty diety na utrzymanie wagi {calorie} kcal dopasowane do liczby posiłków w ciągu dnia. Każdy jadłospis zawiera przykładowy dzień, przepisy oraz listę zakupów.
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {mealVariants.map(({ segment, label }) => (
              <li key={segment}>
                <Link
                  href={`/dieta/na-utrzymanie-wagi/${calorie}-kcal/${segment}`}
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

          {/* Tabele: lista posiłków (link do przepisu + kcal) dla 3, 4, 5 posiłków */}
          <div className="space-y-8">
            {([3, 4, 5] as const).map((count) => {
              const segment = mealCountToSegment(count);
              const label = mealCountLabel(count);
              const desc =
                count === 3
                  ? "jeśli preferujesz większe porcje"
                  : count === 4
                    ? "jeśli chcesz zachować równowagę"
                    : "jeśli lepiej czujesz się jedząc częściej, ale mniej";
              const mealsData = previews[count];

              return (
                <div key={count}>
                  <h3 className="font-montserrat font-bold text-lg text-zinc-900 mb-2">
                    Dieta {calorie} kcal – {label} → {desc}
                  </h3>
                  {mealsData && mealsData.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-zinc-200">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200">
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700">
                              Posiłek
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {mealsData.map((meal, i) => (
                            <tr key={i} className="border-b border-zinc-100 last:border-0">
                              <td className="py-3 px-4 font-medium text-zinc-800 align-top">
                                <Link
                                  href={meal.recipePath}
                                  className="hover:text-[#e77503] hover:underline transition-colors"
                                >
                                  {meal.mealName}{" "}
                                  <span className="text-zinc-500 font-normal">
                                    ({meal.calories} kcal)
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-zinc-500 text-sm">
                      <Link
                        href={`/dieta/na-utrzymanie-wagi/${calorie}-kcal/${segment}`}
                        className="text-[#e77503] hover:underline"
                      >
                        Zobacz jadłospis na {label} →
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Jak wybrać liczbę posiłków? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="wybor-posilkow">
          <h2 id="wybor-posilkow" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jak wybrać liczbę posiłków?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Liczba posiłków nie wpływa bezpośrednio na utrzymanie wagi — kluczowa jest całkowita kaloryczność diety.
          </p>
          <p className="text-zinc-700 leading-relaxed">Wybierz:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mt-2">
            <li>3 posiłki – jeśli preferujesz większe porcje;</li>
            <li>4 posiłki – jeśli chcesz zachować równowagę;</li>
            <li>5 posiłków – jeśli lepiej czujesz się jedząc częściej, ale mniej.</li>
          </ul>
        </section>

        {/* Jak dostosować dietę? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dostosowanie">
          <h2 id="dostosowanie" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jak dostosować dietę {calorie} kcal?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-2">Jeśli zauważysz zmiany w wadze:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mb-4">
            <li>spadek masy ciała: zwiększ kaloryczność o +100–150 kcal;</li>
            <li>przyrost masy ciała: zmniejsz kalorie o 100–150 kcal;</li>
            <li>kontroluj wagę co 1–2 tygodnie i obserwuj długoterminowy trend.</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <FAQ items={hubFaq} title={`FAQ – dieta na utrzymanie wagi ${calorie} kcal`} />
        </section>

        {/* Zobacz także */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="zobacz-takze">
          <h2 id="zobacz-takze" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Zobacz także
          </h2>
          <ul className="flex flex-wrap gap-3 text-zinc-700">
            {prevCal !== null && (
              <li>
                <Link href={`/dieta/na-utrzymanie-wagi/${prevCal}-kcal`} className="text-[#e77503] hover:underline">
                  Dieta na utrzymanie {prevCal} kcal
                </Link>
              </li>
            )}
            {nextCal !== null && (
              <li>
                <Link href={`/dieta/na-utrzymanie-wagi/${nextCal}-kcal`} className="text-[#e77503] hover:underline">
                  Dieta na utrzymanie {nextCal} kcal
                </Link>
              </li>
            )}
            <li>
              <Link href={`/dieta/na-mase/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                Dieta na masę {calorie} kcal
              </Link>
            </li>
            <li>
              <Link href={`/dieta/na-redukcje/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                Dieta na redukcję {calorie} kcal
              </Link>
            </li>
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

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { calories } from "@/programmatic/diet/data";
import { mealCountToSegment, mealCountLabel } from "@/programmatic/diet/generator";
import { weightFemaleFromCalorie, weightMaleFromCalorie, maintenanceRange } from "@/content/diet/exampleByCalorie";
import { getMassDietPreviews } from "@/lib/getMassDietPreviews";
import NewsletterSignup from "@/components/NewsletterSignup";
import FAQ from "@/components/FAQ";
import KalkulatorStyleHero from "@/components/KalkulatorStyleHero";
import AuthorCard from "@/components/AuthorCard";
import CitationBlock from "@/components/CitationBlock";

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
function getHigherCalorieRange(calorie: number): { min: number; max: number } | null {
  const next = calories.filter((c) => c > calorie);
  if (next.length === 0) return null;
  return { min: next[0], max: next[next.length - 1] };
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

  const wK = weightFemaleFromCalorie(calorie);
  const wM = weightMaleFromCalorie(calorie);
  const { min: kcalMinK, max: kcalMaxK } = maintenanceRange(calorie);
  const { min: kcalMinM, max: kcalMaxM } = maintenanceRange(calorie);
  const higherRange = getHigherCalorieRange(calorie);
  const { prev: prevCal, next: nextCal } = getAdjacentCalories(calorie);
  const previews = await getMassDietPreviews(calorie);

  const hubFaq = [
    {
      question: `Czy ${calorie} kcal wystarczy na masę?`,
      answer: "Tak, jeśli jest to nadwyżka kaloryczna względem Twojego zapotrzebowania.",
    },
    {
      question: `Ile białka na ${calorie} kcal na masę?`,
      answer: "Zazwyczaj 1,6–2,2 g białka na kg masy ciała.",
    },
    {
      question: `Czy dieta ${calorie} kcal jest dobra dla mężczyzny?`,
      answer:
        "Może być, ale często jest to wartość bliższa utrzymaniu lub redukcji – zależy od wagi i aktywności.",
    },
    {
      question: "Ile posiłków najlepiej jeść na masie?",
      answer: "Nie ma jednej idealnej liczby – wybierz 3, 4 lub 5 w zależności od preferencji.",
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
          <Link href="/dieta/na-mase" className="hover:text-[#e77503] transition-colors">
            Dieta na masę
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{calorie} kcal</span>
        </nav>

        <KalkulatorStyleHero
          className="mt-10 mb-10"
          title={
            <>
              DIETA <br /> NA MASĘ
            </>
          }
          tagline={
            <>
              {calorie} KCAL <span className="hidden sm:inline">—</span> WYBIERZ
              WARIANT
            </>
          }
          description={
            <p>
              Gotowe jadłospisy na masę {calorie} kcal. Wybierz liczbę posiłków i
              przejdź do planu dnia z przepisami oraz listą zakupów.
            </p>
          }
          bullets={["Jadłospisy 3–5 posiłków", "Lista zakupów", "Przepisy"]}
          ariaLabel="Wygeneruj dietę AI (na masę) po kliknięciu w wideo"
          ctaLabel="Rozpocznij"
        />

        {/* Dieta na masę X kcal – dla kogo? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dla-kogo">
          <h2 id="dla-kogo" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Dieta na masę {calorie} kcal – dla kogo?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Dieta na masę {calorie} kcal to plan żywieniowy przeznaczony dla osób, które chcą zwiększyć masę ciała – głównie masę mięśniową – przy stosunkowo umiarkowanym zapotrzebowaniu kalorycznym. Najczęściej sprawdzi się u:
          </p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-2 mb-4">
            <li>
              <strong>kobiet budujących masę mięśniową</strong> – np. przy wadze około {wK} kg i wzroście 170 cm (zapotrzebowanie na utrzymanie to wtedy ok. {kcalMinK}–{kcalMaxK} kcal);
            </li>
            <li>
              <strong>mężczyzn o niższej wadze lub rozpoczynających trening siłowy</strong> – np. przy wadze około {wM} kg i wzroście 180 cm (zapotrzebowanie ok. {kcalMinM}–{kcalMaxM} kcal);
            </li>
            <li>osób wracających do treningów po przerwie;</li>
            <li>osób z wolniejszym metabolizmem.</li>
          </ul>
          {higherRange && (
            <p className="text-zinc-700 leading-relaxed">
              Jeśli Twoje zapotrzebowanie kaloryczne jest wyższe, warto rozważyć{" "}
              <Link href={`/dieta/na-mase/${higherRange.min}-kcal`} className="text-[#e77503] font-semibold hover:underline">
                dietę {higherRange.min}–{higherRange.max} kcal
              </Link>
              .
            </p>
          )}
        </section>

        {/* Ile można przytyć na X kcal? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="ile-przytyc">
          <h2 id="ile-przytyc" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Ile można przytyć na {calorie} kcal?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Tempo przyrostu masy zależy od Twojego zapotrzebowania energetycznego (TDEE). Jeśli {calorie} kcal stanowi nadwyżkę kaloryczną:
          </p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-2 mb-4">
            <li>możesz przybrać ok. 0,25–0,5 kg tygodniowo;</li>
            <li>większa nadwyżka = szybszy przyrost, ale też więcej tkanki tłuszczowej;</li>
            <li>zbyt mała nadwyżka = brak efektów.</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed">
            Dlatego warto monitorować wagę i w razie potrzeby zwiększyć kaloryczność.
          </p>
          <CitationBlock
            goal="mass"
            theme="rate"
            sentenceFragment="tempo przyrostu masy wpływa na jakość składu ciała — wolniejszy przyrost (np. 0,25–0,5 kg/tydz.) często oznacza mniej tkanki tłuszczowej"
            className="mt-4"
          />
        </section>

        {/* Makroskładniki */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="makroskladniki">
          <h2 id="makroskladniki" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Makroskładniki w diecie {calorie} kcal na masę
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">Przykładowy rozkład makroskładników:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mb-4">
            <li>Białko: 15–25% (ok. {Math.round((calorie * 0.15) / 4)}–{Math.round((calorie * 0.25) / 4)} g)</li>
            <li>Tłuszcze: 25–35% (ok. {Math.round((calorie * 0.25) / 9)}–{Math.round((calorie * 0.35) / 9)} g)</li>
            <li>Węglowodany: 40–60% (ok. {Math.round((calorie * 0.4) / 4)}–{Math.round((calorie * 0.6) / 4)} g)</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed">
            Białko wspiera budowę mięśni, węglowodany dostarczają energii do treningów, a tłuszcze regulują gospodarkę hormonalną.
          </p>
          <CitationBlock
            goal="mass"
            theme="protein"
            sentenceFragment="wyższa podaż białka (ok. 1,6–2,2 g/kg) przy treningu siłowym wspiera przyrost masy mięśniowej"
            className="mt-4"
          />
        </section>

        {/* Jadłospisy na X kcal – tabele 3, 4, 5 posiłków */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="jadlospisy-wedlug-posilkow">
          <h2 id="jadlospisy-wedlug-posilkow" className="font-montserrat font-bold text-xl text-zinc-900 mb-2 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jadłospisy na {calorie} kcal
          </h2>
          <p className="text-zinc-600 text-sm mb-6">
            Poniżej znajdziesz gotowe warianty diety na masę {calorie} kcal dopasowane do liczby posiłków w ciągu dnia. Każdy jadłospis zawiera przykładowy dzień, przepisy oraz listę zakupów.
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
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

          {/* Tabele: tylko nazwy produktów dla 3, 4, 5 posiłków */}
          <div className="space-y-8">
            {([3, 4, 5] as const).map((count) => {
              const segment = mealCountToSegment(count);
              const label = mealCountLabel(count);
              const desc =
                count === 3
                  ? "dla osób preferujących większe, sycące posiłki"
                  : count === 4
                    ? "najbardziej uniwersalny wariant"
                    : "dla osób aktywnych, trenujących regularnie";
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
                      <Link href={`/dieta/na-mase/${calorie}-kcal/${segment}`} className="text-[#e77503] hover:underline">
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
            Liczba posiłków nie wpływa bezpośrednio na przyrost masy — najważniejsza jest kaloryczność i makroskładniki.
          </p>
          <p className="text-zinc-700 leading-relaxed">Wybierz:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mt-2">
            <li>3 posiłki – jeśli lubisz jeść rzadziej, ale więcej;</li>
            <li>4 posiłki – jeśli chcesz zachować balans;</li>
            <li>5 posiłków – jeśli łatwiej Ci jeść mniejsze porcje.</li>
          </ul>
        </section>

        {/* Jak dostosować dietę? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dostosowanie">
          <h2 id="dostosowanie" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jak dostosować dietę {calorie} kcal?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-2">Jeśli nie widzisz efektów:</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1 mb-4">
            <li>zwiększ kaloryczność o +100–200 kcal;</li>
            <li>dodaj przekąskę (np. koktajl białkowy);</li>
            <li>monitoruj wagę co 1–2 tygodnie.</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed mb-2">Jeśli przybierasz za szybko (tkanka tłuszczowa):</p>
          <ul className="list-disc pl-6 text-zinc-700 space-y-1">
            <li>zmniejsz kalorie o 100–200 kcal.</li>
          </ul>
        </section>

        <section className="mb-8 max-w-xl" aria-label="Autor artykułu">
          <AuthorCard />
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <FAQ items={hubFaq} title={`FAQ – dieta na masę ${calorie} kcal`} />
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
                <Link href={`/dieta/na-mase/${prevCal}-kcal`} className="text-[#e77503] hover:underline">
                  Dieta na masę {prevCal} kcal
                </Link>
              </li>
            )}
            {nextCal !== null && (
              <li>
                <Link href={`/dieta/na-mase/${nextCal}-kcal`} className="text-[#e77503] hover:underline">
                  Dieta na masę {nextCal} kcal
                </Link>
              </li>
            )}
            <li>
              <Link href={`/dieta/na-redukcje/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                Dieta na redukcję {calorie} kcal
              </Link>
            </li>
            <li>
              <Link href={`/dieta/na-utrzymanie-wagi/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                Dieta na utrzymanie {calorie} kcal
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/dieta/na-mase"
            className="text-[#e77503] font-semibold hover:underline"
          >
            ← Wszystkie diety na masę (1500–4000 kcal)
          </Link>
          <p className="text-sm text-zinc-500">
            Zobacz też:{" "}
            <Link href="/dieta/na-redukcje" className="text-[#e77503] hover:underline">
              dieta na redukcję
            </Link>
            ,{" "}
            <Link href="/dieta/na-utrzymanie-wagi" className="text-[#e77503] hover:underline">
              dieta na utrzymanie wagi
            </Link>
            .
          </p>
        </div>

        <section className="mt-16 py-16 px-6 rounded-3xl border border-[#e77503]/20 bg-[#fff9f3]" aria-labelledby="newsletter-mase">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="newsletter-mase" className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl text-[#1f1d1d] mb-4">
              Bądź na bieżąco – dieta na masę
            </h2>
            <p className="text-base text-zinc-600 mb-8 leading-relaxed">
              Zapisz się do newslettera i otrzymuj informacje o najnowszych
              planach dietetycznych na masę, promocjach i wskazówkach żywieniowych
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

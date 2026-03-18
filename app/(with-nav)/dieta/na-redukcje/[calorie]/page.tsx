import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaCheck } from "react-icons/fa";
import { calories } from "@/programmatic/diet/data";
import {
  mealCountToSegment,
  mealCountLabel,
} from "@/programmatic/diet/generator";
import { getReductionDietPreviews } from "@/lib/getReductionDietPreviews";
import { getReductionHubFaq } from "@/content/diet/reduction/hubFaq";
import NewsletterSignup from "@/components/NewsletterSignup";
import FAQ from "@/components/FAQ";
import KalkulatorStyleHero from "@/components/KalkulatorStyleHero";

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
    return { title: "Dieta na redukcję | DzienDiety" };
  }

  const title = `Dieta na redukcję ${calorie} kcal – czy na pewno schudniesz?`;
  const description = `Dieta na redukcję ${calorie} kcal – dla kogo ma sens, ile można schudnąć i gotowe jadłospisy na 3, 4 lub 5 posiłków. Przepisy, rozkład kalorii i lista zakupów.`;
  const url = `${siteUrl}/dieta/na-redukcje/${calorie}-kcal`;

  return {
    title: `${title} | DzienDiety`,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | DzienDiety`, description, url },
    robots: { index: true, follow: true },
  };
}

export default async function DietReductionHubPage({ params }: Props) {
  const { calorie: calorieSegment } = await params;
  const calorie = parseCalorieSegment(calorieSegment);
  if (calorie === null) notFound();

  const mealVariants = [
    { count: 3, segment: mealCountToSegment(3), label: mealCountLabel(3) },
    { count: 4, segment: mealCountToSegment(4), label: mealCountLabel(4) },
    { count: 5, segment: mealCountToSegment(5), label: mealCountLabel(5) },
  ];

  const { prev: prevCal, next: nextCal } = getAdjacentCalories(calorie);
  const previews = await getReductionDietPreviews(calorie);
  const hubFaq = getReductionHubFaq(calorie);

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
            href="/dieta/na-redukcje"
            className="hover:text-[#e77503] transition-colors"
          >
            Dieta na redukcję
          </Link>{" "}
          /{" "}
          <span className="text-zinc-700">{calorie} kcal</span>
        </nav>

        <KalkulatorStyleHero
          className="mt-10 mb-10"
          title={
            <>
              DIETA <br /> NA REDUKCJĘ
            </>
          }
          tagline={
            <>
              {calorie} KCAL <span className="hidden sm:inline">—</span> SPRAWDŹ
              WARIANTY
            </>
          }
          description={
            <p>
              Jadłospisy redukcyjne {calorie} kcal: wybierz liczbę posiłków i
              przejdź do planu dnia z przepisami oraz listą zakupów.
            </p>
          }
          bullets={["Jadłospisy 3–5 posiłków", "Lista zakupów", "Przepisy"]}
          ariaLabel="Wygeneruj dietę AI (na redukcję) po kliknięciu w wideo"
          ctaLabel="Rozpocznij"
        />

        {/* Intro: 2000 kcal samo w sobie nie odchudza */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="czy-schudne">
          <h2 id="czy-schudne" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Czy na diecie {calorie} kcal na pewno schudniesz?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            {calorie} kcal samo w sobie nie odchudza. To, czy schudniesz, zależy wyłącznie od tego, czy jest to dla Ciebie deficyt kaloryczny. Jeśli wcześniej jadłeś 2600–3000 kcal dziennie, przejście na dietę {calorie} kcal niemal na pewno uruchomi proces redukcji. Jeśli jednak Twoje zapotrzebowanie wynosi około {calorie} kcal — efektów możesz nie zobaczyć wcale.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            To dlatego dwie osoby na tej samej diecie mogą mieć zupełnie inne rezultaty.
          </p>
        </section>

        {/* Ile można schudnąć */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="ile-schudnac">
          <h2 id="ile-schudnac" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Ile można schudnąć na diecie {calorie} kcal?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            To pytanie pojawia się częściej niż jakiekolwiek inne — i słusznie. Każdy chce wiedzieć, czego się spodziewać.
          </p>
          <p className="text-zinc-700 leading-relaxed mb-4">
            W praktyce dieta redukcyjna {calorie} kcal pozwala najczęściej tracić od około 0,3 do 0,7 kg tygodniowo. U osób z większą nadwagą tempo bywa szybsze, u osób już stosunkowo szczupłych — znacznie wolniejsze. Organizm nie działa według sztywnych tabel, ale jedno pozostaje niezmienne: liczy się konsekwencja.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            To nie idealny dzień diety daje efekt, tylko powtarzalność przez tygodnie.
          </p>
        </section>

        {/* Dla kogo dieta ma sens */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dla-kogo">
          <h2 id="dla-kogo" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Dla kogo dieta {calorie} kcal na redukcję ma sens?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Wbrew pozorom nie jest to dieta „dla każdego”. {calorie} kcal na redukcji najczęściej sprawdza się u mężczyzn o umiarkowanej aktywności, aktywnych kobiet oraz osób, które dopiero zaczynają odchudzanie i nie chcą od razu wchodzić na bardzo niskie kalorie.
          </p>
          <p className="text-zinc-700 leading-relaxed mb-4">
            To także dobry punkt startowy dla tych, którzy wcześniej nie kontrolowali jedzenia i chcą zobaczyć pierwsze efekty bez poczucia głodu.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Z drugiej strony — jeśli po kilku tygodniach waga stoi w miejscu, to nie znak, że „redukcja nie działa”, tylko że {calorie} kcal może być dla Ciebie poziomem utrzymania. W takiej sytuacji konieczna jest korekta.
          </p>
        </section>

        {/* Jadłospisy na redukcję – tabele 3, 4, 5 posiłków */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="jadlospisy-wedlug-posilkow">
          <h2 id="jadlospisy-wedlug-posilkow" className="font-montserrat font-bold text-xl text-zinc-900 mb-2 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Jadłospisy na redukcję {calorie} kcal
          </h2>
          <p className="text-zinc-600 text-sm mb-6">
            Najczęstszy błąd początkujących? Szukanie „idealnej liczby posiłków”. W rzeczywistości nie ma znaczenia, czy jesz trzy, cztery czy pięć razy dziennie — o ile bilans kalorii się zgadza, efekt będzie ten sam. Różnica polega wyłącznie na wygodzie i kontroli głodu. Poniżej znajdziesz różne warianty diety {calorie} kcal na redukcję — możesz wybrać taki, który najlepiej pasuje do Twojego stylu życia. Każdy zawiera gotowy jadłospis, przepisy oraz listę zakupów.
          </p>

          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {mealVariants.map(({ segment, label }) => (
              <li key={segment}>
                <Link
                  href={`/dieta/na-redukcje/${calorie}-kcal/${segment}`}
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
                      <Link href={`/dieta/na-redukcje/${calorie}-kcal/${segment}`} className="text-[#e77503] hover:underline">
                        Zobacz jadłospis na {label} →
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Czy na redukcji trzeba jeść „idealnie czysto”? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="czysta-dieta">
          <h2 id="czysta-dieta" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Czy na redukcji {calorie} kcal trzeba jeść „idealnie czysto”?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            To jeden z największych mitów, który sabotuje efekty. Dieta redukcyjna nie polega na eliminowaniu wszystkiego, co „smaczne”, tylko na kontrolowaniu kalorii. Możesz jeść normalne posiłki — obiady, kanapki, makarony — a nawet wkomponować coś słodkiego, jeśli mieści się to w bilansie.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Paradoksalnie to właśnie zbyt restrykcyjne podejście najczęściej prowadzi do przerwania diety.
          </p>
        </section>

        {/* Dlaczego nie chudnę */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="dlaczego-nie-chudne">
          <h2 id="dlaczego-nie-chudne" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Dlaczego nie chudnę na {calorie} kcal?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            To moment, w którym wiele osób zaczyna się frustrować. „Jem {calorie} kcal i nic się nie dzieje” — brzmi znajomo?
          </p>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Najczęściej problem nie leży w samej diecie, ale w szczegółach. Niedokładne liczenie kalorii, podjadanie między posiłkami, brak ruchu albo przecenianie swojej aktywności potrafią całkowicie zniwelować deficyt.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Jeśli jednak masz pewność, że wszystko robisz dobrze, odpowiedź jest prosta: dla Twojego organizmu {calorie} kcal to za dużo, by schudnąć. Wtedy rozwiązaniem nie jest rezygnacja, tylko precyzyjna korekta.
          </p>
        </section>

        {/* Czy X kcal to dużo na redukcji? */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="czy-duzo">
          <h2 id="czy-duzo" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Czy {calorie} kcal to dużo na redukcji?
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            To zależy — i to jest najbardziej uczciwa odpowiedź. Dla jednej osoby {calorie} kcal będzie agresywną redukcją, dla innej poziomem, na którym masa ciała stoi w miejscu. Właśnie dlatego skuteczna dieta nie zaczyna się od „ile kalorii jeść”, tylko od zrozumienia własnego zapotrzebowania.
          </p>
          <p className="text-zinc-700 leading-relaxed">
            Dobra wiadomość jest taka, że {calorie} kcal to bardzo często świetny punkt wyjścia — ani za niski, ani za wysoki. Wystarczająco komfortowy, żeby wytrwać, i wystarczająco skuteczny, żeby zobaczyć efekty.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <FAQ items={hubFaq} title={`Najczęstsze pytania o dietę na redukcję ${calorie} kcal`} />
        </section>

        {/* Zobacz także */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 mb-8" aria-labelledby="zobacz-takze">
          <h2 id="zobacz-takze" className="font-montserrat font-bold text-xl text-zinc-900 mb-4 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-[#e77503] rounded-full" />
            Zobacz także
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Jeśli chcesz lepiej dopasować kaloryczność do siebie, sprawdź również inne warianty:
          </p>
          <ul className="flex flex-wrap gap-3 text-zinc-700">
            {prevCal !== null && (
              <li>
                <Link href={`/dieta/na-redukcje/${prevCal}-kcal`} className="text-[#e77503] hover:underline">
                  dieta na redukcję {prevCal} kcal
                </Link>
              </li>
            )}
            {nextCal !== null && (
              <li>
                <Link href={`/dieta/na-redukcje/${nextCal}-kcal`} className="text-[#e77503] hover:underline">
                  dieta na redukcję {nextCal} kcal
                </Link>
              </li>
            )}
            <li>
              <Link href={`/dieta/na-mase/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                dieta na masę {calorie} kcal
              </Link>
            </li>
            <li>
              <Link href={`/dieta/na-utrzymanie-wagi/${calorie}-kcal`} className="text-[#e77503] hover:underline">
                dieta na utrzymanie {calorie} kcal
              </Link>
            </li>
          </ul>
        </section>

        <div className="mt-10 flex flex-col gap-2">
          <Link
            href="/dieta/na-redukcje"
            className="text-[#e77503] font-semibold hover:underline"
          >
            ← Wszystkie diety na redukcję (1500–4000 kcal)
          </Link>
          <p className="text-sm text-zinc-500">
            Zobacz też:{" "}
            <Link href="/dieta/na-mase" className="text-[#e77503] hover:underline">
              dieta na masę
            </Link>
            ,{" "}
            <Link href="/dieta/na-utrzymanie-wagi" className="text-[#e77503] hover:underline">
              dieta na utrzymanie wagi
            </Link>
            .
          </p>
        </div>

        <section className="mt-16 py-16 px-6 rounded-3xl border border-[#e77503]/20 bg-[#fff9f3]" aria-labelledby="newsletter-redukcje">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="newsletter-redukcje" className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl text-[#1f1d1d] mb-4">
              Bądź na bieżąco – dieta na redukcję
            </h2>
            <p className="text-base text-zinc-600 mb-8 leading-relaxed">
              Zapisz się do newslettera i otrzymuj informacje o najnowszych
              planach dietetycznych na redukcję, promocjach i wskazówkach żywieniowych
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

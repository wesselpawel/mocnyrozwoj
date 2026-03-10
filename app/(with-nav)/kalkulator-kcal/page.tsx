import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import accent1 from "@/public/accent1.png";
import asset3 from "@/public/assets/3.jpg";
import asset4 from "@/public/assets/4.jpg";
import { FaCheck, FaStar } from "react-icons/fa";
import KcalCalculator from "@/components/KcalCalculator";
import NewsletterSignup from "@/components/NewsletterSignup";
import FAQ from "@/components/FAQ";
import { defaultFAQItems } from "@/lib/faqData";
import Products from "@/components/Products";
import { getProducts } from "@/lib/getProducts";
import LandingTestTriggerButton from "@/components/LandingTestTriggerButton";
import LandingTestTriggerWrapper from "@/components/LandingTestTriggerWrapper";

export default async function KalkulatorKcalPage() {
  const products = await getProducts();
  const testProduct = products[0];
  const calculatorSteps = [
    {
      id: 1,
      title: "Podajesz dane osobowe",
      description:
        "Wiek, płeć, wzrost i waga to podstawa do obliczenia metabolizmu.",
      impact: "Dostajesz precyzyjne BMR zamiast zgadywania kalorii.",
      tag: "Dane",
    },
    {
      id: 2,
      title: "Wybierasz poziom aktywności",
      description:
        "Od trybu siedzącego po intensywne treningi - dokładnie tak, jak wygląda Twój tydzień.",
      impact:
        "Kalkulator wylicza TDEE, czyli realne zapotrzebowanie z ruchem.",
      tag: "Aktywność",
    },
    {
      id: 3,
      title: "Ustalasz cel",
      description:
        "Redukcja, utrzymanie lub budowanie masy - dobierasz kierunek działania.",
      impact:
        "System automatycznie dopasowuje kalorie pod wybrany cel sylwetkowy.",
      tag: "Cel",
    },
    {
      id: 4,
      title: "Otrzymujesz docelowe kcal",
      description:
        "Wynik pokazuje ile jeść każdego dnia, aby iść w wybranym kierunku.",
      impact:
        "Masz konkretną liczbę kalorii, na której możesz budować plan diety.",
      tag: "Wynik",
    },
    {
      id: 5,
      title: "Dostajesz makroskładniki",
      description:
        "Kalkulator wylicza ilość białka, węglowodanów i tłuszczów w gramach.",
      impact:
        "Od razu wiesz, jak rozłożyć posiłki bez ręcznych obliczeń.",
      tag: "Makro",
    },
    {
      id: 6,
      title: "Przechodzisz do działania",
      description:
        "Z gotowym wynikiem łatwiej zacząć dietę i kontrolować postępy co tydzień.",
      impact:
        "Mniej chaosu, więcej regularności i szybsza droga do efektu.",
      tag: "Efekt",
    },
  ];

  return (
    <div className="relative min-h-screen">
      <div className="relative mt-32 flex items-center justify-center overflow-hidden">
        <div className="z-50 pt-8 w-full">
          <div className="max-w-6xl mx-auto px-4 lg:px-6 relative">
            <div className="absolute left-[-260px] lg:left-[-300px] top-[-144px] sm:top-[-128px] lg:top-[-100px] sm:left-[-320px] w-[350px] lg:w-[300px] h-auto z-[-1]">
              <Image
                src={accent1}
                width={1000}
                height={1000}
                alt="Accent 1"
                className="w-full h-full rotate-45"
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <h1 className="font-extrabold text-3xl lg:text-5xl tracking-[0.6rem] font-montserrat text-[#1f1d1d]">
                  KALKULATOR <br /> KCAL
                </h1>
                <span className="block text-2xl sm:text-3xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.1rem]">
                  POLICZ. DOPASUJ. DZIAŁAJ
                </span>
                <p className="mx-3 lg:mx-0 mt-6 text-black max-w-lg">
                  W mniej niż minutę obliczysz swoje zapotrzebowanie kaloryczne,
                  docelowe kcal i rozkład makroskładników.
                </p>
                <div className="flex flex-wrap flex-row justify-center lg:justify-start gap-4 mt-8">
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">BMR i TDEE</p>
                  </div>
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">Docelowe kalorie</p>
                  </div>
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">Makroskładniki</p>
                  </div>
                </div>
              </div>

              <div className="ml-3 mt-2">
                {testProduct ? (
                  <LandingTestTriggerWrapper
                    testProduct={testProduct}
                    className="block max-h-[80vh] w-full rounded-2xl"
                    ariaLabel="Wygeneruj dietę AI po kliknięciu w wideo"
                  >
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster="/generator-diety-ai-video.mp4"
                      className="w-full object-cover"
                    >
                      <source
                        src="/generator-diety-ai-video.mp4"
                        type="video/mp4"
                      />
                      Twoja przeglądarka nie obsługuje odtwarzania wideo.
                    </video>
                  </LandingTestTriggerWrapper>
                ) : null}
                <div className="mb-6 mt-6 flex justify-center gap-3">
                  <Link
                    href="#kcal-calculator"
                    className="inline-flex items-center rounded-full border border-[#e77503]/30 px-6 py-3 font-semibold text-[#1f1d1d] hover:bg-[#fff7ef] transition-colors duration-300 shadow-sm"
                  >
                    Oblicz teraz
                  </Link>
                  {testProduct ? (
                    <LandingTestTriggerButton
                      testProduct={testProduct}
                      label="Rozpocznij"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {testProduct ? (
        <div className="max-w-6xl mx-auto px-4 lg:px-6 mt-8" id="shop">
          <Products product={testProduct} heroTitle="DIETA ONLINE ZA DARMO" />
        </div>
      ) : null}

      <section className="py-16 px-6 lg:px-12 bg-gray-50" id="kcal-calculator">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-4">
              KALKULATOR KALORII ONLINE
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Uzupełnij dane i sprawdź swoje dzienne zapotrzebowanie kaloryczne
              oraz sugerowany rozkład makroskładników.
            </p>
          </div>
          <KcalCalculator />
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-center text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-4">
            OPINIE UŻYTKOWNIKÓW
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Sprawdź, co mówią o nas klienci, którzy już wypróbowali nasze plany
            dietetyczne.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
                <FaStar className="text-yellow-500 mr-2" /> 10/10
              </div>
              <div className="flex items-start gap-3">
                <Image
                  src={asset3}
                  width={80}
                  height={80}
                  alt="Arek"
                  className="rounded-full w-14 h-14 object-cover flex-shrink-0 border-2 border-[#e77503]/30"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1f1d1d] leading-tight">
                    Arek - Trener personalny
                  </h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Dla mnie super. Strona daje przepisy na dania, plany
                    dietetyczne i listy zakupów. Polecam wszystkim moim
                    podopiecznym.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
                <FaStar className="text-yellow-500 mr-2" /> 10/10
              </div>
              <div className="flex items-start gap-3">
                <Image
                  src={asset4}
                  width={80}
                  height={80}
                  alt="Maciej - Sportowiec"
                  className="rounded-full w-14 h-14 object-cover flex-shrink-0 border-2 border-[#e77503]/30"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1f1d1d] leading-tight">
                    Maciej - Sportowiec
                  </h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Znalazłem to czego szukałem, w gotowych planach dietetycznych
                    brakowało mi listy zakupów.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
                <FaStar className="text-yellow-500 mr-2" /> 10/10
              </div>
              <div className="flex items-start gap-3">
                <div className="text-white text-lg p-1 w-12 h-12 border-2 border-[#fcaa30] rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                  <div className="font-bold">K</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1f1d1d] leading-tight">
                    Karolina - dietetyczka
                  </h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Jako dietetyczka mogę polecić. Dobre plany dietetyczne, które
                    nie jeden doswiadczony dietetyk mógłby polecić klientom.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-10">
            <h2 className="font-montserrat font-extrabold tracking-[0.4rem] text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d]">
              JAK DZIAŁA KALKULATOR KCAL
            </h2>
            <p className="mt-5 text-zinc-700 max-w-3xl leading-relaxed">
              Kalkulator prowadzi Cię krok po kroku: od danych osobowych przez
              poziom aktywności, aż po gotowe kalorie i makro na każdy dzień.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                WYNIK W MINUTĘ
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                Szybkie obliczenia bez ręcznego liczenia.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                PRECYZYJNE DANE
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                BMR i TDEE obliczane na podstawie Twoich parametrów.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                GOTOWY PLAN STARTU
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                Wiesz ile jeść i jak rozłożyć makroskładniki.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {calculatorSteps.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#fff3e0] text-[#b45b00] text-xs font-semibold">
                    {item.tag}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#e77503] text-white text-sm font-bold flex items-center justify-center">
                    {item.id}
                  </div>
                </div>
                <h3 className="font-semibold text-[#1f1d1d] leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="w-max max-w-full flex flex-row items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <p className="text-white text-xs sm:text-sm">{item.impact}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl border border-[#e77503]/20 bg-white/90 bg-cover bg-center bg-no-repeat shadow-sm"
            style={{ backgroundImage: "url('/assets2/1.jpg')" }}
          >
            <div className="bg-gradient-to-r from-green-100/30 to-blue-100/30 z-10 p-6 sm:p-8 lg:p-10 rounded-3xl">
              <div className="text-center">
                <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-4">
                  BĄDŹ NA BIEŻĄCO
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Zapisz się do newslettera i otrzymuj informacje o najnowszych
                  planach dietetycznych, promocjach i wskazówkach żywieniowych
                  prosto na swoją skrzynkę email.
                </p>
              </div>

              <NewsletterSignup />

              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                {[
                  "Bezpłatne informacje",
                  "Możliwość rezygnacji w każdej chwili",
                  "Bez spamu",
                ].map((item) => (
                  <div
                    key={item}
                    className="w-max max-w-full flex items-center px-4 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg"
                  >
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white text-xs" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-[#e77503]/20 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-3">
                CZĘSTO ZADAWANE PYTANIA
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Najważniejsze odpowiedzi w jednym miejscu - kliknij pytanie, aby
                rozwinąć szczegóły.
              </p>
            </div>

            <FAQ items={[...defaultFAQItems]} allowMultiple={false} />
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Kalkulator KCAL - Oblicz zapotrzebowanie kalorii - Dziendiety.pl",
  description:
    "Darmowy kalkulator kalorii online. Oblicz BMR, TDEE, docelowe kcal i makroskładniki pod redukcję, utrzymanie lub budowę masy.",
  icons: [
    {
      type: "image/x-icon",
      url: "./public/favicons/favicon.ico",
    },
  ],
};

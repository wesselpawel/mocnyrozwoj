import Image from "next/image";
import accent1 from "@/public/accent1.png";
import asset3 from "@/public/assets/3.jpg";
import asset4 from "@/public/assets/4.jpg";
import { FaCheck, FaStar } from "react-icons/fa";
import LandingTestTriggerButton from "@/components/LandingTestTriggerButton";
import LandingTestTriggerWrapper from "@/components/LandingTestTriggerWrapper";
import Products from "@/components/Products";
import NewsletterSignup from "@/components/NewsletterSignup";
import FAQ from "@/components/FAQ";
import { defaultFAQItems } from "@/lib/faqData";
import { getProducts } from "@/lib/getProducts";
import { Metadata } from "next";

export default async function GeneratorDietyAiPage() {
  const products = await getProducts();
  const testProduct = products[0];
  const generatorQuestions = [
    {
      id: 1,
      question: "Jaki jest Twój główny cel?",
      description:
        "Wybierasz kierunek: redukcja, masa, utrzymanie lub poprawa energii.",
      impact:
        "Na tej podstawie ustawiamy kaloryczność i proporcje makroskładników.",
      tag: "Cel",
    },
    {
      id: 2,
      question: "Co najbardziej utrudnia Ci trzymanie diety?",
      description:
        "Wskazujesz realne przeszkody, np. brak czasu, podjadanie czy nieregularną pracę.",
      impact:
        "Generator dobiera prostsze rozwiązania i plan odporny na codzienne trudności.",
      tag: "Nawyki",
    },
    {
      id: 3,
      question: "Jak wygląda Twoja aktywność?",
      description:
        "Określasz poziom ruchu: od pracy siedzącej po intensywny sport.",
      impact:
        "Dzięki temu plan ma odpowiednią ilość kalorii i energii na treningi.",
      tag: "Aktywność",
    },
    {
      id: 4,
      question: "Ile czasu możesz poświęcić na przygotowanie posiłków?",
      description:
        "Wybierasz tempo gotowania: od ekspresowych dań po bardziej rozbudowane przepisy.",
      impact:
        "Plan zawiera posiłki, które naprawdę zdążysz przygotować.",
      tag: "Czas",
    },
    {
      id: 5,
      question: "Czy jest coś, czego nie jesz?",
      description:
        "Podajesz preferencje i ograniczenia, np. bez glutenu, bez laktozy lub wegetariańskie.",
      impact:
        "Usuwamy problematyczne składniki, żeby dieta była bezpieczna i wygodna.",
      tag: "Preferencje",
    },
    {
      id: 6,
      question: "Podaj swoją wagę (kg)",
      description:
        "Waga to kluczowy punkt startowy do wyliczeń zapotrzebowania.",
      impact:
        "Pozwala dokładniej dobrać porcje i tempo realizacji celu.",
      tag: "Parametry",
    },
    {
      id: 7,
      question: "Podaj swój wzrost (cm)",
      description:
        "Wzrost wpływa na podstawową przemianę materii i bilans energetyczny.",
      impact:
        "Dzięki temu plan jest bardziej precyzyjny niż gotowe jadłospisy.",
      tag: "Parametry",
    },
    {
      id: 8,
      question: "Podaj swój wiek",
      description:
        "Wiek wpływa na metabolizm i rekomendowany rozkład kalorii.",
      impact:
        "Generator dopasowuje plan do aktualnych możliwości organizmu.",
      tag: "Parametry",
    },
    {
      id: 9,
      question: "Podaj swoją płeć",
      description:
        "Ta informacja pomaga dokładniej wyliczyć dzienne zapotrzebowanie kaloryczne.",
      impact:
        "Plan jest lepiej dopasowany do fizjologii i celu sylwetkowego.",
      tag: "Dopasowanie",
    },
    {
      id: 10,
      question: "Czy chcesz dodać dodatkowe uwagi do planu?",
      description:
        "Możesz dopisać własne potrzeby: nielubiane produkty, styl śniadań lub rytm dnia.",
      impact:
        "To etap personalizacji, który zamienia dobry plan w plan dla Ciebie.",
      tag: "Personalizacja",
    },
  ];

  return (
    <div className="relative min-h-screen ">
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
                  GENERATOR <br /> DIETY AI
                </h1>
                <span className="block text-2xl sm:text-3xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.1rem]">
                  KLIKNIJ. JEDZ. OSIĄGNIJ CEL
                </span>
                <p className="mx-3 lg:mx-0 mt-6 text-black max-w-lg">
                  W 60 sekund za darmo wygenerujesz gotową dietę dopasowaną do
                  Twojego celu.
                </p>
                <div className="flex flex-wrap flex-row justify-center lg:justify-start gap-4 mt-8">
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">Lista zakupów</p>
                  </div>
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">Przepisy na dania</p>
                  </div>
                  <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                    <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                      <FaCheck className="text-white" />
                    </div>
                    <p className="text-white text-sm">Kalorie policzone</p>
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
                <div className="mb-6 flex justify-center">
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
          <Products product={testProduct} heroTitle="WYGENERUJ DIETĘ AI" />
        </div>
      ) : null}

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
              JAK DZIAŁA GENERATOR DIETY AI
            </h2>
            <p className="mt-5 text-zinc-700 max-w-3xl leading-relaxed">
              Zamiast długiego formularza przechodzisz przez 10 krótkich pytań.
              Każde z nich odpowiada za inny element planu: kalorie, wybór
              posiłków, tempo przygotowania i ograniczenia żywieniowe.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                10 PYTAŃ
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                Krótka ścieżka zamiast skomplikowanego planowania.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                60 SEKUND
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                Odpowiadasz szybko, a system składa gotową bazę pod plan.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#e77503]/20 p-5">
              <p className="font-anton text-[#e77503] text-xl tracking-[0.05rem]">
                KONKRETNY EFEKT
              </p>
              <p className="text-sm text-zinc-700 mt-2">
                Otrzymujesz dietę, listę zakupów i przepisy pod swój cel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {generatorQuestions.map((item) => (
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
                  {item.question}
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
  title: "Generator Diety AI - Darmowy plan dietetyczny - Dziendiety.pl",
  description:
    "Wypełnij 10 krótkich pytań i wygeneruj dietę AI dopasowaną do Twojego celu. Otrzymasz jadłospis, listę zakupów i przepisy.",
  icons: [
    {
      type: "image/x-icon",
      url: "./public/favicons/favicon.ico",
    },
  ],
};

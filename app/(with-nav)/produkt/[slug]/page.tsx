"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { dietService } from "@/lib/dietService";
import { Diet } from "@/types";
import PurchaseButton from "@/components/PurchaseButton";
import FAQ from "@/components/FAQ";
import accent1 from "@/public/accent1.png";
import {
  FaArrowLeft,
  FaCalendar,
  FaChartBar,
  FaCheck,
  FaExclamationTriangle,
  FaFire,
  FaShoppingCart,
  FaUserMd,
  FaUtensils,
} from "react-icons/fa";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);

  const parseArray = (data: string[] | string | undefined) => {
    if (!data) return [];
    if (Array.isArray(data)) return data.filter(Boolean);
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return [];
    }
  };

  const parseMealPlan = (
    data:
      | string
      | {
          [key: string]: {
            Time: string;
            Calories: number;
            Example: string;
          };
        }
      | undefined,
  ) => {
    if (!data) return [];
    if (typeof data === "object") {
      return Object.entries(data);
    }
    try {
      const parsed = JSON.parse(data);
      return typeof parsed === "object" && parsed
        ? Object.entries(parsed)
        : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchDiet = async () => {
      if (!slug) return;
      try {
        const data = await dietService.getDietBySlug(slug);
        setDiet(data);
      } catch {
        setDiet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDiet();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffaf4]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e77503]" />
      </div>
    );
  }

  if (!diet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Produkt nie znaleziony
        </h1>
        <p className="text-gray-600 mb-6">
          Nie udało się znaleźć tego produktu. Sprawdź adres lub wróć do listy.
        </p>
        <Link
          href="/#dieta"
          className="text-[#e77503] hover:text-[#ca6400] border-2 border-[#ca6400] rounded-full px-4 py-2 font-medium"
        >
          ← Wróć do produktów
        </Link>
      </div>
    );
  }

  const benefits = parseArray(diet.benefits);
  const contraindications = parseArray(diet.contraindications);
  const targetAudience = parseArray(diet.targetAudience);
  const shoppingList = parseArray(diet.shoppingList);
  const preparationTips = parseArray(diet.preparationTips);
  const scientificReferences = parseArray(diet.scientificReferences);
  const clinicalStudies = parseArray(diet.clinicalStudies);
  const mealPlanRows = parseMealPlan(diet.mealPlanStructure);

  return (
    <div className="relative min-h-screen bg-[#fffaf4] pb-16">
      <section className="relative mt-28 flex items-center justify-center px-4">
        <div className="z-10 pt-8 flex flex-col items-center justify-center text-center max-w-5xl">
          <div className="max-w-[900px] relative">
            <div className="absolute left-[-240px] lg:left-[-320px] top-[-120px] w-[280px] lg:w-[340px] h-auto z-[-1] opacity-80">
              <Image
                src={accent1}
                width={1000}
                height={1000}
                alt="Tło dekoracyjne"
                className="w-full h-full rotate-45"
              />
            </div>

            <Link
              href="/#shop"
              className="border-2 border-[#ca6400] hover:bg-white rounded-full px-4 py-2 inline-flex items-center text-[#e77503] hover:text-[#ca6400] text-sm font-medium mb-6"
            >
              <FaArrowLeft className="mr-2" />
              Wróć do produktów
            </Link>

            <p className="font-extrabold text-center text-2xl sm:text-3xl lg:text-5xl tracking-[0.4rem] lg:tracking-[0.6rem] font-montserrat text-[#1f1d1d]">
              PLAN DIETY
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.08rem]">
              {diet.title}
            </h1>
            <p className="mx-3 lg:mx-auto mt-6 text-black max-w-3xl text-center text-base sm:text-lg">
              {diet.shortDescription || diet.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-sm">Poziom: {diet.difficulty}</p>
              </div>
              <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-sm">{diet.duration}</p>
              </div>
              <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-sm">{diet.calories} kcal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <Image
              src={diet.image || "/logoNew.png"}
              width={900}
              height={700}
              alt={diet.title}
              className="w-full rounded-2xl shadow-lg object-cover"
            />
          </div>
          <div>
            <h2 className="font-montserrat font-extrabold tracking-[0.4rem] lg:tracking-[0.6rem] text-left text-2xl sm:text-3xl lg:text-4xl text-black mb-8">
              O TEJ DIECIE
            </h2>
            <p className="font-montserrat text-zinc-800 leading-relaxed">
              {diet.dietOverview || diet.description}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f4e8da]">
                <div className="text-[#e77503] text-xl mb-2">
                  <FaCalendar />
                </div>
                <p className="text-sm text-zinc-500">Czas trwania</p>
                <p className="font-bold text-zinc-900">{diet.duration}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f4e8da]">
                <div className="text-[#e77503] text-xl mb-2">
                  <FaUtensils />
                </div>
                <p className="text-sm text-zinc-500">Posiłki / dzień</p>
                <p className="font-bold text-zinc-900">{diet.meals}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f4e8da]">
                <div className="text-[#e77503] text-xl mb-2">
                  <FaFire />
                </div>
                <p className="text-sm text-zinc-500">Kalorie</p>
                <p className="font-bold text-zinc-900">{diet.calories} kcal</p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-[#f4e8da]">
                <div className="text-[#e77503] text-xl mb-2">
                  <FaChartBar />
                </div>
                <p className="text-sm text-zinc-500">Skuteczność</p>
                <p className="font-bold text-zinc-900">{diet.successRate}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.6rem] text-left text-2xl sm:text-3xl lg:text-5xl text-black mb-10">
            KORZYŚCI I DLA KOGO
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={`${benefit}-${index}`}
                  className="w-max max-w-full flex items-start px-5 py-2 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg"
                >
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <FaCheck className="text-white text-xs" />
                  </div>
                  <p className="font-montserrat text-white">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f4e8da]">
              <h3 className="font-anton tracking-[0.08rem] text-2xl mb-4 text-[#1f1d1d]">
                Dla kogo jest ten plan
              </h3>
              <div className="flex flex-wrap gap-2">
                {targetAudience.map((audience, index) => (
                  <span
                    key={`${audience}-${index}`}
                    className="px-3 py-1 rounded-full bg-[#fff0df] text-[#ca6400] text-sm font-medium"
                  >
                    {audience}
                  </span>
                ))}
              </div>
              {diet.averageTimeToResults && (
                <p className="mt-6 text-zinc-700">
                  <span className="font-semibold text-zinc-900">Czas efektów:</span>{" "}
                  {diet.averageTimeToResults}
                </p>
              )}
              {diet.averageWeightLoss && (
                <p className="mt-2 text-zinc-700">
                  <span className="font-semibold text-zinc-900">Średnia zmiana:</span>{" "}
                  {diet.averageWeightLoss}
                </p>
              )}
            <PurchaseButton
              variant="secondary"
              item={{
                id: diet.id,
                title: diet.title,
                price: diet.price,
                type: "diet",
              }}
            />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f4e8da]">
            <h3 className="font-anton tracking-[0.08rem] text-2xl mb-4 text-[#1f1d1d]">
              Lista zakupów
            </h3>
            <div className="space-y-3">
              {shoppingList.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start">
                  <FaCheck className="text-[#e77503] mr-3 mt-1" />
                  <p className="text-zinc-800">{item}</p>
                </div>
              ))}
            </div>
            <PurchaseButton
              variant="secondary"
              item={{
                id: diet.id,
                title: diet.title,
                price: diet.price,
                type: "diet",
              }}
            />
            
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-[#f4e8da]">
            <h3 className="font-anton tracking-[0.08rem] text-2xl mb-4 text-[#1f1d1d]">
              Wskazówki przygotowania
            </h3>
            <div className="space-y-3">
              {preparationTips.map((tip, index) => (
                <div key={`${tip}-${index}`} className="flex items-start">
                  <FaCheck className="text-[#e77503] mr-3 mt-1" />
                  <p className="text-zinc-800">{tip}</p>
                </div>
              ))}
            </div>
            <PurchaseButton
              variant="secondary"
              item={{
                id: diet.id,
                title: diet.title,
                price: diet.price,
                type: "diet",
              }}
            />
          </div>
        </div>
      </section>

      {mealPlanRows.length > 0 && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-montserrat font-extrabold tracking-[0.5rem] text-left text-2xl sm:text-3xl lg:text-4xl text-black mb-8">
              STRUKTURA JADŁOSPISU
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {mealPlanRows.map(([mealName, mealData]) => {
                const details = mealData as {
                  Time?: string;
                  Calories?: number;
                  Example?: string;
                };
                return (
                  <div
                    key={mealName}
                    className="bg-white rounded-2xl p-5 shadow-md border border-[#f4e8da]"
                  >
                    <h3 className="font-bold text-lg text-zinc-900">{mealName}</h3>
                    {details.Time && (
                      <p className="text-sm text-zinc-600 mt-1">
                        Godzina: {details.Time}
                      </p>
                    )}
                    {details.Calories && (
                      <p className="text-sm text-zinc-600 mt-1">
                        Kalorie: {details.Calories} kcal
                      </p>
                    )}
                    {details.Example && (
                      <p className="text-zinc-800 mt-3">{details.Example}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {(contraindications.length > 0 || diet.progressTracking || diet.maintenancePhase) && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {contraindications.length > 0 && (
              <div className="bg-[#fff1f1] rounded-2xl p-6 border border-[#ffd8d8]">
                <h3 className="font-anton tracking-[0.06rem] text-xl mb-4 text-[#7a1c1c]">
                  Przeciwwskazania
                </h3>
                <div className="space-y-3">
                  {contraindications.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-start">
                      <FaExclamationTriangle className="text-[#c73535] mr-3 mt-1 shrink-0" />
                      <p className="text-[#5d1f1f]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {diet.progressTracking && (
              <div className="bg-white rounded-2xl p-6 border border-[#f4e8da] shadow-md">
                <h3 className="font-anton tracking-[0.06rem] text-xl mb-4 text-[#1f1d1d]">
                  Monitorowanie postępów
                </h3>
                <p className="text-zinc-800">{diet.progressTracking}</p>
              </div>
            )}
            {diet.maintenancePhase && (
              <div className="bg-white rounded-2xl p-6 border border-[#f4e8da] shadow-md">
                <h3 className="font-anton tracking-[0.06rem] text-xl mb-4 text-[#1f1d1d]">
                  Faza utrzymania
                </h3>
                <p className="text-zinc-800">{diet.maintenancePhase}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {(diet.nutritionistName || diet.nutritionistCredentials || diet.nutritionistBio) && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl p-6 lg:p-8 border border-[#f4e8da] shadow-lg">
            <h2 className="font-montserrat font-extrabold tracking-[0.4rem] text-left text-2xl sm:text-3xl text-black mb-6">
              OPIEKA SPECJALISTY
            </h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-[#fff0df] flex items-center justify-center shrink-0">
                <FaUserMd className="text-[#e77503] text-xl" />
              </div>
              <div>
                {diet.nutritionistName && (
                  <p className="font-bold text-zinc-900">{diet.nutritionistName}</p>
                )}
                {diet.nutritionistCredentials && (
                  <p className="text-zinc-700 mt-1">{diet.nutritionistCredentials}</p>
                )}
                {diet.nutritionistBio && (
                  <p className="text-zinc-800 mt-3 leading-relaxed">
                    {diet.nutritionistBio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {(scientificReferences.length > 0 || clinicalStudies.length > 0) && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#f4e8da] shadow-md">
              <h3 className="font-anton tracking-[0.06rem] text-xl mb-4 text-[#1f1d1d]">
                Badania naukowe
              </h3>
              <div className="space-y-3">
                {scientificReferences.map((reference, index) => (
                  <p key={`${reference}-${index}`} className="text-zinc-700 text-sm">
                    {reference}
                  </p>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#f4e8da] shadow-md">
              <h3 className="font-anton tracking-[0.06rem] text-xl mb-4 text-[#1f1d1d]">
                Badania kliniczne
              </h3>
              <div className="space-y-3">
                {clinicalStudies.map((study, index) => (
                  <p key={`${study}-${index}`} className="text-zinc-700 text-sm">
                    {study}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {diet.testimonials.length > 0 && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-montserrat font-extrabold tracking-[0.4rem] text-left text-2xl sm:text-3xl lg:text-4xl text-black mb-8">
              OPINIE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diet.testimonials.map((testimonial, index) => (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="bg-white rounded-2xl p-6 shadow-md border border-[#f4e8da]"
                >
                  <p className="font-bold text-zinc-900">{testimonial.name}</p>
                  <p className="text-sm text-[#e77503] mt-1">
                    {testimonial.weightLoss}
                  </p>
                  <p className="text-zinc-700 mt-4">"{testimonial.review}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {diet.beforeAfterStories.length > 0 && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-montserrat font-extrabold tracking-[0.4rem] text-left text-2xl sm:text-3xl lg:text-4xl text-black mb-8">
              HISTORIE PRZEMIAN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diet.beforeAfterStories.map((story, index) => (
                <div
                  key={`${story.name}-${index}`}
                  className="bg-white rounded-2xl p-6 shadow-md border border-[#f4e8da]"
                >
                  <p className="font-bold text-zinc-900">{story.name}</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    {story.beforeWeight} → {story.afterWeight}
                  </p>
                  <p className="text-zinc-700 mt-4">{story.story}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {diet.faq.length > 0 && (
        <section className="pb-16 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <FAQ
              items={diet.faq.map((f) => ({
                question: f.question,
                answers: f.answers,
              }))}
              title="Często zadawane pytania"
              allowMultiple={false}
            />
          </div>
        </section>
      )}

      <section className="px-6 lg:px-12">
        <div className="max-w-6xl mx-auto bg-white border border-[#f4e8da] rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <p className="text-zinc-500 text-sm">Cena jednorazowa</p>
              <p className="text-4xl font-bold text-[#1f1d1d] mt-1">
                {diet.price} PLN
              </p>
              {diet.originalPrice && (
                <p className="text-zinc-400 line-through mt-1">
                  {diet.originalPrice} PLN
                </p>
              )}
            </div>
            <div className="w-full lg:w-auto">
              <PurchaseButton
                item={{
                  id: diet.id,
                  title: diet.title,
                  price: diet.price,
                  type: "diet",
                  data: {
                    duration: diet.duration,
                    difficulty: diet.difficulty,
                    calories: diet.calories,
                    meals: diet.meals,
                    category: diet.category,
                    image: diet.image,
                    nutritionistName: diet.nutritionistName,
                    nutritionistCredentials: diet.nutritionistCredentials,
                    benefits: diet.benefits,
                    targetAudience: diet.targetAudience,
                    mealPlanStructure: diet.mealPlanStructure,
                    shoppingList: diet.shoppingList,
                    preparationTips: diet.preparationTips,
                    progressTracking: diet.progressTracking,
                    maintenancePhase: diet.maintenancePhase,
                    scientificReferences: diet.scientificReferences,
                    clinicalStudies: diet.clinicalStudies,
                    averageWeightLoss: diet.averageWeightLoss,
                    averageTimeToResults: diet.averageTimeToResults,
                    successRate: diet.successRate,
                    faq: diet.faq,
                    testimonials: diet.testimonials,
                    beforeAfterStories: diet.beforeAfterStories,
                  },
                }}
                className="w-full lg:w-auto bg-[#1f1d1d] hover:bg-black text-white px-7 py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2"
              >
                <FaShoppingCart className="text-xs" />
                Kup teraz
              </PurchaseButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

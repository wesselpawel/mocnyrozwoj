import Image from "next/image";
import Link from "next/link";
import hero from "@/public/hero.png";
import logo from "@/public/dziendiety.png";
import brain from "@/public/brain.png";
import form from "@/public/assets/form.png";
import asset1 from "@/public/assets/1.jpg";
import asset2 from "@/public/assets/2.jpg";
import asset3 from "@/public/assets/3.jpg";
import asset6 from "@/public/assets/6.png";
import asset4 from "@/public/assets/4.jpg";
import asset5 from "@/public/assets/5.jpg";
import { defaultFAQItems } from "@/lib/faqData";
import Products from "@/components/Products";
import Courses from "@/components/Courses";
import FAQ from "@/components/FAQ";
import CounterAnimation from "@/components/CounterAnimation";
import { getProducts } from "@/lib/getProducts";
import { blogService } from "@/lib/blogService";
import { Metadata } from "next";
import Script from "next/script";
import accent1 from "@/public/accent1.png";
import NewsletterSignup from "@/components/NewsletterSignup";
import LandingRegisterForm from "@/components/LandingRegisterForm";
import LandingTestTriggerImage from "@/components/LandingTestTriggerImage";
import LandingTestTriggerButton from "@/components/LandingTestTriggerButton";
import LandingInteractiveTest from "@/components/LandingInteractiveTest";
import HomeDietPricingSection from "@/components/HomeDietPricingSection";
import {
  FaUserMd,
  FaBalanceScale,
  FaFileAlt,
  FaDumbbell,
  FaLeaf,
  FaSeedling,
  FaBullseye,
  FaCheck,
  FaShoppingCart,
  FaStar,
  FaChartLine,
  FaEdit,
  FaLightbulb,
  FaChartBar,
} from "react-icons/fa";
import { Diet } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products: Diet[] = await getProducts();
  const recentPosts = await blogService.getAllBlogPosts();
  const latestPosts = recentPosts.slice(0, 3); // Get the 3 most recent posts

  return (
    <div className="relative min-h-screen">
      <div className="relative mt-32 flex items-center justify-center">
        <div className="z-50 pt-8 flex flex-col items-center justify-center text-center">
          <div className="max-w-[450px] lg:max-w-full relative">
            <div className="absolute left-[-260px] lg:left-[-300px] top-[-144px] sm:top-[-128px] lg:top-[-100px] sm:left-[-320px] w-[350px] lg:w-[300px] h-auto z-[-1]">
              <Image
                src={accent1}
                width={1000}
                height={1000}
                alt="Accent 1"
                className="w-full h-full rotate-45"
              />
            </div>
            {/* <div className="-rotate-[110deg] absolute right-[-260px] lg:right-[-300px] bottom-[-144px] sm:bottom-[-128px] lg:bottom-[-100px] sm:right-[-320px] w-[350px] lg:w-[300px] h-auto z-[-1]">
              <Image
                src={accent1}
                width={1000}
                height={1000}
                alt="Accent 1"
                className="w-full h-full"
              />
            </div> */}
            <p className="font-extrabold text-center text-3xl lg:text-5xl tracking-[0.6rem] font-montserrat text-[#1f1d1d]">
              NIE LICZ <br /> KALORII
            </p>
            <span className="block text-2xl sm:text-3xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.1rem]">
              KLIKNIJ. JEDZ. OSIĄGNIJ CEL
            </span>
            <div className="flex flex-col items-center justify-center">
              <h1 className="mx-3 lg:mx-0 mt-6 text-black max-w-lg text-center">
                W 60 sekund za darmo otrzymasz gotową dietę dopasowaną do Twojego celu.
              </h1>
              <div className="flex flex-wrap flex-row justify-center gap-4 mt-8">
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
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4" id="shop">
        <Products product={products[0]} />
      </div>
      {/* How It Works Section */}
      <div className="mt-12 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.6rem] text-left text-3xl sm:text-4xl lg:text-5xl text-black mb-12">
            DIETA ONLINE DOPASOWANA DO CIEBIE
          </h2>
          <p className="mb-8 font-montserrat">
            Chcesz <b>schudnąć</b>, <b>poprawić sylwetkę</b> lub{" "}
            <b>zacząć zdrowo się odżywiać</b>, ale nie wiesz od czego zacząć?
            Nasze <b>narzędzie do tworzenia diety online</b> zrobi to za Ciebie.
            Bez wiedzy dietetycznej. Bez skomplikowanych zasad. Bez godzin
            planowania.
          </p>
          <div className="mx-auto w-max max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Image
                src={asset1}
                width={600}
                height={400}
                alt="Lekkostrawna Dieta"
                className="mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div>
              <div className="space-y-6">
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Nie musisz znać się na dietach
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Nie musisz liczyć kalorii
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Nie musisz samodzielnie układać jadłospisu
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Dostajesz konkretny plan działania
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Oszczędzasz godziny planowania
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works - 3 Steps */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.6rem] text-left text-3xl sm:text-4xl lg:text-5xl text-black mb-12">
            JAK TO DZIAŁA
          </h2>
          <p className="mb-8 font-montserrat">
            Chcesz <b>schudnąć</b>, <b>poprawić sylwetkę</b> lub{" "}
            <b>zacząć zdrowo się odżywiać</b>, ale nie wiesz od czego zacząć?
            Nasze <b>narzędzie do tworzenia diety online</b> zrobi to za Ciebie.
            Bez wiedzy dietetycznej. Bez skomplikowanych zasad. Bez godzin
            planowania.
          </p>
          <div className="flex flex-col lg:flex-row gap-8">
          <div className="grid grid-cols-1  gap-8">
            <div className="">
              <div className="p-1 w-24 h-24 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                <span className="text-white text-4xl font-bold">1</span>
              </div>
              <div className="w-max max-w-full flex flex-row items-center text-black rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg mb-6 mt-8">
                <p className="font-anton tracking-[0.1rem] text-2xl">
                  KILKA PROSTYCH PYTAŃ
                </p>
              </div>
              <p className="font-montserrat text-zinc-800 leading-relaxed">
                Podajesz swój cel (<b>odchudzanie</b>, <b>redukcja</b>,{" "}
                <b>masa</b>, <b>zdrowe odżywianie</b>), podstawowe informacje o
                sobie i preferencje żywieniowe. Bez liczenia kalorii. Bez
                skomplikowanych formularzy.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="p-1 w-24 h-24 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                <span className="text-white text-4xl font-bold">2</span>
              </div>
              <div className="w-max max-w-full flex flex-row items-center text-black rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg mb-6 mt-8">
                <p className="font-anton tracking-[0.1rem] text-2xl">
                  ALGORYTM TWORZY DIETĘ
                </p>
              </div>
              <p className="font-montserrat text-zinc-800 leading-relaxed">
                Algorytm tworzy{" "}
                <b>dopasowany jadłospis z dokładnymi porcjami</b>, listą zakupów
                i prostymi przepisami. Wiesz dokładnie co jeść, ile jeść i kiedy
                jeść.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="p-1 w-24 h-24 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                <span className="text-white text-4xl font-bold">3</span>
              </div>
              <div className="w-max max-w-full flex flex-row items-center text-black rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg mb-6 mt-8">
                <p className="font-anton tracking-[0.1rem] text-2xl">
                  PLAN JEST GOTOWY
                </p>
              </div>
              <p className="font-montserrat text-zinc-800 leading-relaxed">
                Otrzymujesz <b>gotowy plan dietetyczny</b>. Do każdego planu otrzymasz listę zakupów i przepisy. Nie musisz nic planować –
                po prostu trzymasz się rozpiski i widzisz efekty.
              </p>
            </div>
          </div>
        <video src="/generator-diety-ai-video.mp4" className="mx-automax-w-full w-[500px] h-full object-cover" autoPlay muted loop />
        </div>
        </div>
      </div>
      
      <HomeDietPricingSection />

      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.6rem] text-left text-3xl sm:text-4xl lg:text-5xl text-black mb-12">
            CZY TO DLA CIEBIE?
          </h2>
          <p className="mb-4 font-montserrat">
            <b>Co otrzymasz w 60 sekund?</b>
          </p>
          <p className="mb-8 font-montserrat">
            Gotowy dzień diety dopasowany do celu, automatycznie policzone
            kalorie, listę zakupów, proste przepisy krok po kroku, możliwość
            budowania diety dzień po dniu.
          </p>

          <div className="mx-auto w-max max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="space-y-6">
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Zaczynasz dietę i kończysz po 3 dniach
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Nie masz czasu planować posiłków
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Masz dość liczenia kalorii
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Trenujesz i chcesz jeść pod wyniki
                  </p>
                </div>
                <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg">
                  <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                    <FaCheck className="text-white" />
                  </div>
                  <p className="font-montserrat text-white">
                    Chcesz schudnąć, ale nie wiesz co jeść
                  </p>
                </div>
                <p className="font-montserrat text-zinc-800 leading-relaxed">
                  Jeśli zaznaczasz choć jeden punkt – nasz kreator diety jest
                  dla Ciebie.
                </p>
              </div>
            </div>{" "}
            <div>
              <Image
                src={asset2}
                width={600}
                height={400}
                alt="Lekkostrawna Dieta"
                className="mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 bg-gray-50">
      {/* Hero Section */}
      <div className="pt-8 pb-8 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-3xl sm:text-4xl lg:text-5xl text-[#1f1d1d] mb-4">
            JAK DZIAŁA NASZ KREATOR DIETY ONLINE
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Poznaj nasz proces i dowiedz się, jak możesz rozpocząć swoją podróż
            do lepszej wersji siebie
          </p>
        </div>
      </div>

      {/* Step 1: Account Creation */}
      <div className="py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-[#e77503] text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 1
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Utwórz konto
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Rozpocznij swoją podróż do lepszej wersji siebie. Utworzenie
                konta zajmuje tylko kilka minut.
              </p>
</div>
            <div>
              <LandingRegisterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Take Tests */}
      <div className="py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12">
            <div className="lg:order-2">
              <div className="bg-[#e77503] text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 2
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Odpowiedz na kilka pytań
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Zadamy Ci kilka pytań na temat Twojej diety i celu.
              </p>
            </div>
            <LandingTestTriggerImage
              image={form}
              alt="Odpowiedz na kilka pytań"
              testProduct={products[0]}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Get Personalized Reports */}
      <div className="py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-[#e77503] text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 3
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Porady dietetyczne
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Na podstawie wyników testu otrzymasz szczegółowe porady dla twojego planu dietetycznego.
                Znajdziesz tam również najczęściej popełniane błędy i czego unikać w diecie.
              </p>
              <LandingTestTriggerButton testProduct={products[0]} label="Rozpocznij test" />
            </div>
            <div>
              <Image
                src={asset6}
                width={600}
                height={400}
                alt="Personalizowane porady dietetyczne"
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
      </div>

    
      {/* Customer Reviews Section */}
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-center text-2xl sm:text-3xl lg:text-4xl text-[#1f1d1d] mb-4">
            OPINIE UŻYTKOWNIKÓW
          </h2>
          <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
            Sprawdź, co mówią o nas klienci, którzy już wypróbowali nasze plany
            dietetyczne
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
               <FaStar className="text-yellow-500 mr-2" />   10/10
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
                    Dla mnie super. Strona daje przepisy na dania, plany dietetyczne i listy zakupów. Polecam wszystkim moim podopiecznym. 
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
              <FaStar className="text-yellow-500 mr-2" />   10/10
              </div>
              <div className="flex items-start gap-3">
                <Image
                  src={asset4}
                  width={80}
                  height={80}
                  alt="Adam - Trener personalny"
                  className="rounded-full w-14 h-14 object-cover flex-shrink-0 border-2 border-[#e77503]/30"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1f1d1d] leading-tight">
                  Maciej - Sportowiec
                  </h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Znalazłem to czego szukałem, w gotowych planach dietetycznych brakowało mi listy zakupów.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-[#e77503]/15 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4 inline-flex items-center rounded-full bg-[#fff3e0] px-3 py-1 text-xs font-semibold text-[#b45b00]">
              <FaStar className="text-yellow-500 mr-2" />   10/10
              </div>
              <div className="flex items-start gap-3">
                <div className="text-white text-lg p-1 w-12 h-12 border-2 border-[#fcaa30] rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
                  <div className="font-bold">
                    K
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#1f1d1d] leading-tight">
                    Karolina - dietetyczka
                  </h4>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                    Jako dietetyczka mogę polecić. Dobre plany dietetyczne, które nie jeden doswiadczony dietetyk mógłby polecić klientom.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div
            className="relative rounded-3xl border border-[#e77503]/20 bg-white/90 bg-cover bg-center bg-no-repeat shadow-sm"
            style={{ backgroundImage: "url('/assets2/1.jpg')" }}
          >
            <div className="bg-gradient-to-r from-green-100/30 to-blue-100/30 z-10 p-6 sm:p-8 lg:p-10  rounded-3xl">
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
      </div>
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
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
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title:
    "Dziendiety.pl - Dieta online za darmo",
  description:
    "Jadłospis z listą zakupów i przepisami. Spersonalizowana dieta online za darmo.",
  icons: [
    {
      type: "image/x-icon",
      url: "./public/favicons/favicon.ico",
    },
  ],
};

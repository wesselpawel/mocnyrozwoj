import Image from "next/image";
import Link from "next/link";
import hero from "@/public/hero.png";
import logo from "@/public/logoNew.png";
import brain from "@/public/brain.png";
import asset1 from "@/public/assets/1.jpg";
import asset2 from "@/public/assets/2.jpg";
import asset3 from "@/public/assets/3.jpg";
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
            <h1 className="text-2xl sm:text-3xl lg:text-6xl mt-6 text-[#e77503] font-anton tracking-[0.1rem]">
              KLIKNIJ. JEDZ. OSIĄGNIJ CEL
            </h1>
            <div className="flex flex-col items-center justify-center">
              <p className="mx-3 lg:mx-0 mt-6 text-black max-w-lg text-center">
                W 60 sekund wygenerujesz gotowy dzień diety dopasowany do Twojej
                masy, redukcji lub treningu.
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col">
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
                  MY GENERUJEMY TWOJĄ PERSONALNĄ DIETĘ
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
                  WIDZISZ GOTOWY PLAN I ZACZYNASZ OD RAZU
                </p>
              </div>
              <p className="font-montserrat text-zinc-800 leading-relaxed">
                Otrzymujesz <b>kalendarz z planem żywieniowym</b>. Możesz go
                wydrukować lub korzystać w telefonie. Nie musisz nic planować –
                po prostu trzymasz się rozpiski i widzisz efekty.
              </p>
            </div>
          </div>
        </div>
      </div>
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
      {/* Diet Types Section */}
      <div className="py-16 px-6 lg:px-12 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-montserrat font-extrabold tracking-[0.6rem] text-left text-3xl sm:text-4xl lg:text-5xl text-black mb-12">
            DLACZEGO NASZA DIETA DZIAŁA?
          </h2>

          <div className="font-montserrat grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBalanceScale className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Dopasowanie celu
              </h3>
              <p className="text-gray-600">
                Nasz algorytm tworzy dietę dopasowaną do Twoich potrzeb i celów.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Bez liczenia kalorii
              </h3>
              <p className="text-gray-600">
                System automatycznie liczy kalorie i dostosowuje dietę do Twoich
                potrzeb.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Proste, dostępne produkty
              </h3>
              <p className="text-gray-600">
                System tworzy dietę na podstawie łatwo dostępnych produktów.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDumbbell className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Dieta wysokobiałkowa
              </h3>
              <p className="text-gray-600">
                Dla sportowców i osób budujących masę mięśniową
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLeaf className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Dieta wegetariańska
              </h3>
              <p className="text-gray-600">
                Wegetariańska i wegańska dla zdrowia i środowiska
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="w-16 h-16 bg-[#e77503] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSeedling className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Dieta keto i low carb
              </h3>
              <p className="text-gray-600">
                Niskowęglowodanowe plany żywieniowe
              </p>
            </div>
          </div>
        </div>
      </div>
      <Courses />
      {/* Customer Reviews Section */}
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
            Opinie klientów
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Sprawdź, co mówią o nas klienci, którzy już wypróbowali nasze plany
            dietetyczne
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4 bg-[#e77503] rounded-full p-1">
                <Image
                  src={asset3}
                  width={80}
                  height={80}
                  alt="Anna K."
                  className="rounded-full w-16 h-16 object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                    Anna K.
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    "Dzięki gotowej diecie schudłam 6 kg w 6 tygodni! Proste
                    przepisy i świetny design."
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4 bg-[#e77503] rounded-full p-1">
                <Image
                  src={asset4}
                  width={80}
                  height={80}
                  alt="Marek P."
                  className="rounded-full w-16 h-16 object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                    Marek P.
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    "Proste przepisy, świetny design, w końcu dieta, której mogę
                    się trzymać!"
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4 bg-[#e77503] rounded-full p-1">
                <Image
                  src={asset5}
                  width={80}
                  height={80}
                  alt="Karolina M."
                  className="rounded-full w-16 h-16 object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                    Karolina M.
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    "Jako trener polecam – gotowe plany dietetyczne ułatwiają
                    pracę z klientami."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Bądź na bieżąco!
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Zapisz się do newslettera i otrzymuj informacje o najnowszych
            planach dietetycznych, promocjach i wskazówkach żywieniowych prosto
            na swoją skrzynkę email.
          </p>

          <NewsletterSignup />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Bezpłatne informacje</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Możliwość rezygnacji w każdej chwili</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600 mr-2">✓</span>
              <span>Bez spamu</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 px-6 lg:px-12 bg-gray-50">
        <FAQ
          items={[...defaultFAQItems]}
          title="Często zadawane pytania"
          allowMultiple={false}
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title:
    "Gotowe Plany Dietetyczne - Profesjonalne Jadłospisy do Wydruku | Dietetyka Online",
  description:
    "Gotowe jadłospisy do wydruku z listami zakupów. Diety redukcyjne, keto, wegetariańskie. Zdrowe odżywianie online!",
  icons: [
    {
      type: "image/x-icon",
      url: "./public/logoNew.png",
    },
  ],
};

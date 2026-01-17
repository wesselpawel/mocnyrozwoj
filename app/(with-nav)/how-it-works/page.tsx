import Image from "next/image";
import asset1 from "@/public/assets2/1.jpg";
import asset2 from "@/public/assets2/2.jpg";
import asset3 from "@/public/assets2/3.jpg";
import asset4 from "@/public/assets2/4.jpg";
import Link from "next/link";
import { Metadata } from "next";
import {
  FaCheck,
  FaChartBar,
  FaBullseye,
  FaLightbulb,
  FaChartLine,
  FaEdit,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Dieta? - Proces rozwoju osobistego | MocnyRozwój.pl",
  description:
    "Poznaj nasz 4-etapowy proces rozwoju osobistego: utwórz konto, wykonaj testy osobowości, otrzymaj spersonalizowane raporty i działaj. Rozpocznij swoją transformację już dziś!",
  keywords:
    "Dieta, rozwój osobisty, testy osobowości, spersonalizowane raporty, transformacja osobista, proces rozwoju",
  openGraph: {
    title: "Dieta? - Proces rozwoju osobistego | MocnyRozwój.pl",
    description:
      "Poznaj nasz 4-etapowy proces rozwoju osobistego. Od utworzenia konta po spersonalizowane raporty - wszystko co potrzebujesz do transformacji.",
    type: "website",
    url: "https://mocnyrozwoj.pl/how-it-works",
    images: [
      {
        url: "/assets2/1.jpg",
        width: 1200,
        height: 630,
        alt: "Proces rozwoju osobistego - Dieta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dieta? - Proces rozwoju osobistego | MocnyRozwój.pl",
    description:
      "Poznaj nasz 4-etapowy proces rozwoju osobistego. Od utworzenia konta po spersonalizowane raporty.",
    images: ["/assets2/1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://mocnyrozwoj.pl/how-it-works",
  },
};

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className=" text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6">
            Dieta?
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Poznaj nasz proces i dowiedz się, jak możesz rozpocząć swoją podróż
            do lepszej wersji siebie
          </p>
        </div>
      </div>

      {/* Step 1: Account Creation */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 1
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Utwórz konto
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Rozpocznij swoją podróż do lepszej wersji siebie. Utworzenie
                konta zajmuje tylko kilka minut.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h3 className="font-bold text-gray-800 mb-4">
                  Dane wymagane do utworzenia konta:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Imię i nazwisko</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Adres email</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">
                      Hasło (minimum 6 znaków)
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 font-bold shadow-lg"
              >
                🚀 Utwórz konto teraz
              </Link>
            </div>
            <div>
              <Image
                src={asset1}
                width={600}
                height={400}
                alt="Account Creation"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Take Tests */}
      <div className="py-16 px-6 lg:px-12 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 2
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Wykup dostęp do treści
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Po zalogowaniu otrzymasz dostęp do zakupu naszych treści.
              </p>
            </div>
            <div className="lg:order-1">
              <Image
                src={asset2}
                width={600}
                height={400}
                alt="Personality Tests"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Get Personalized Reports */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-r from-pink-400 to-red-400 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 3
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Otrzymaj spersonalizowane raporty
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Na podstawie wyników testów otrzymasz szczegółowe raporty z
                rekomendacjami rozwojowymi dostosowanymi do Twojej osobowości.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-4">
                  Co zawierają raporty:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <FaChartBar className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Analiza mocnych stron</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <FaBullseye className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Obszary do rozwoju</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                      <FaLightbulb className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Praktyczne wskazówki</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src={asset3}
                width={600}
                height={400}
                alt="Personalized Reports"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step 4: Take Action */}
      <div className="py-16 px-6 lg:px-12 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-2 rounded-full text-sm font-bold inline-block mb-6">
                Krok 4
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Działaj i rozwijaj się
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Wykorzystaj otrzymane wskazówki w praktyce. Śledź swoje postępy
                i ciesz się rezultatami swojej pracy nad sobą.
              </p>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold text-gray-800 mb-4">
                  Narzędzia do rozwoju:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Śledzenie postępów</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <FaEdit className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Dziennik rozwoju</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                      <FaBullseye className="text-white text-sm" />
                    </div>
                    <span className="text-gray-700">Ustalanie celów</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <Image
                src={asset4}
                width={600}
                height={400}
                alt="Take Action"
                className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Gotowy na rozpoczęcie swojej podróży?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Dołącz do tysięcy osób, które już rozpoczęły swoją transformację z
            MocnyRozwój.pl
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 font-bold shadow-lg"
            >
              🚀 Rozpocznij teraz
            </Link>
            <Link
              href="/#shop"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold"
            >
              Zobacz produkty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

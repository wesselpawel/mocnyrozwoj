import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logoNewWhite.png";
import { MdEmail, MdPhone, MdChat } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-row gap-4">
              <div className="flex items-center -mt-8">
                <Image
                  src={logo}
                  width={512}
                  height={512}
                  alt="Mocny Rozwój Osobisty logo"
                  className="w-32 h-auto"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-200">
                  Szybkie linki
                </h4>
                <ul className="space-y-1 text-gray-400 text-xs mt-3">
                  <li>
                    <Link
                      href="/dieta"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Dieta
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/narzedzia/kalorie/kalkulator-kcal"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Kalkulator kcal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/narzedzia/kalorie/kalkulator-bmi"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Kalkulator BMI
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/narzedzia/diety/generator-diety"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Generator diety
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="mt-6 hover:text-white transition-colors duration-200"
                    >
                      Kontakt
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Logowanie
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Rejestracja
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-12 mb-4 max-w-md leading-relaxed">
              Twoja podróż do lepszej wersji siebie zaczyna się tutaj.
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                <MdEmail className="text-white text-sm" />
              </div>
              <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                <MdPhone className="text-white text-sm" />
              </div>
              <div className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                <MdChat className="text-white text-sm" />
              </div>
            </div>
          </div>

          {/* Join CTA */}
          <div className="">
            <h4 className="font-semibold text-sm mb-2 text-gray-200">
              Dołącz za darmo!
            </h4>
            <p className="text-xs mb-3 text-gray-400 leading-relaxed">
              Rozpocznij swoją transformację już dziś. Pełny dostęp do
              wszystkich narzędzi rozwojowych.
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Spersonalizowane raporty</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Praktyczne ćwiczenia</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Śledzenie postępów</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © 2026 mocnyrozwoj.pl Wszystkie prawa zastrzeżone.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0 text-xs text-gray-500">
            <span className="hover:text-gray-400 transition-colors duration-200 cursor-pointer">
              Polityka prywatności
            </span>
            <span className="hover:text-gray-400 transition-colors duration-200 cursor-pointer">
              Regulamin
            </span>
            <span className="hover:text-gray-400 transition-colors duration-200 cursor-pointer">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import logo from "@/public/dziendiety2.png";
import { MdEmail, MdPhone, MdChat } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-row gap-4">
              <div className="bg-white flex pb-4 pt-3 h-max">
                <Image
                  src={logo}
                  width={512}
                  height={512}
                  alt="Dziendiety.pl logo"
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
                      href="/login"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Zaloguj się
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Utwórz konto
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
                </ul>
              </div>
            </div>
            
            
          </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-200">
                  Narzędzia
                </h4>
                <ul className="space-y-1 text-gray-400 text-xs mt-3">
                <li>
                    <Link
                      href="/generator-diety-ai"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Generator diety AI
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kalkulator-kcal"
                      className="hover:text-white transition-colors duration-200"
                    >
                      Kalkulator kcal
                    </Link>
                  </li>
                  
                </ul>
              </div>
          {/* Join CTA */}
          <div className="">
            <h4 className="font-semibold text-sm mb-2 text-gray-200">
              Dołącz za darmo!
            </h4>
            <p className="text-xs mb-3 text-gray-400 leading-relaxed">
              Rozpocznij swoją transformację już dziś. Pełny dostęp do
              darmowej diety.
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Darmowa dieta</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Praktyczne porady</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Listy zakupów</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © 2026 dziendiety.pl
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

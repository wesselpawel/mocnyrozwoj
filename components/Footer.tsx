import Link from "next/link";
import Image from "next/image";
import logo from "@/public/dziendiety2.png";
import { MdPhone } from "react-icons/md";

const SITE_URL =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : "https://dziendiety.pl";

const LEGAL = {
  company: "PAWEŁ WESSEL",
  nip: "8762494772",
  regon: "387851407",
  phoneDisplay: "721 417 154",
  phoneTel: "+48721417154",
} as const;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: LEGAL.company,
  alternateName: "dziendiety.pl",
  url: SITE_URL,
  taxID: LEGAL.nip,
  telephone: LEGAL.phoneTel,
  identifier: {
    "@type": "PropertyValue",
    name: "REGON",
    value: LEGAL.regon,
  },
};

function OrganizationJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationJsonLd),
      }}
    />
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <OrganizationJsonLd />
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
                      Zaloguj się lub utwórz konto
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
            <h4 className="font-semibold text-sm text-gray-200">Narzędzia</h4>
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
              Rozpocznij swoją transformację już dziś. Pełny dostęp do darmowej
              diety.
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

        {/* Dane przedsiębiorcy — transparentność / E-E-A-T */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
            Właściciel serwisu / dane przedsiębiorcy
          </h3>
          <address className="not-italic text-xs text-gray-400 space-y-1 leading-relaxed">
            <p className="text-gray-300 font-medium">{LEGAL.company}</p>
            <p>
              <span className="text-gray-500">NIP:</span> {LEGAL.nip}
            </p>
            <p>
              <span className="text-gray-500">REGON:</span> {LEGAL.regon}
            </p>
            <p className="flex items-center gap-1.5 pt-1">
              <MdPhone className="text-gray-500 shrink-0" aria-hidden />
              <a
                href={`tel:${LEGAL.phoneTel}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {LEGAL.phoneDisplay}
              </a>
            </p>
          </address>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">
            © 2026 dziendiety.pl · {LEGAL.company}
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

import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Często zadawane pytania | MocnyRozwój.pl",
  description:
    "Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące rozwoju osobistego, testów osobowości, konta użytkownika i naszych usług. Sprawdź FAQ przed kontaktem.",
  keywords:
    "FAQ, często zadawane pytania, rozwój osobisty, testy osobowości, konto użytkownika, pomoc, wsparcie",
  openGraph: {
    title: "FAQ - Często zadawane pytania | MocnyRozwój.pl",
    description:
      "Odpowiedzi na najczęściej zadawane pytania o rozwój osobisty, testy osobowości i nasze usługi. Sprawdź FAQ przed kontaktem.",
    type: "website",
    url: "https://mocnyrozwoj.pl/faq",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "FAQ - Często zadawane pytania",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Często zadawane pytania | MocnyRozwój.pl",
    description:
      "Odpowiedzi na najczęściej zadawane pytania o rozwój osobisty i nasze usługi.",
    images: ["/logo.png"],
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
    canonical: "https://mocnyrozwoj.pl/faq",
  },
};

export default async function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className=" text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6">
            Często zadawane pytania
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych
            usług i produktów
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Jak mogę rozpocząć swoją podróż rozwojową?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Rozpoczęcie jest proste! Wystarczy utworzyć konto na naszej
                platformie, podając swoje imię, nazwisko, email i hasło. Po
                zalogowaniu otrzymasz dostęp do naszych testów osobowości i
                narzędzi rozwojowych.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Jakie testy są dostępne po zalogowaniu?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Po zalogowaniu otrzymasz dostęp do testu osobowości MBTI, testu
                inteligencji emocjonalnej oraz testu motywacji. Każdy test
                pomoże Ci lepiej zrozumieć siebie i swoje mocne strony.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Czy mogę śledzić swoje postępy?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tak! Nasza platforma oferuje narzędzia do śledzenia postępów,
                dziennik rozwoju oraz możliwość ustalania i monitorowania celów.
                Wszystko po to, abyś mógł zobaczyć swoje postępy w czasie
                rzeczywistym.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Jakie dane są wymagane do utworzenia konta?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Do utworzenia konta potrzebujesz tylko: imię i nazwisko, adres
                email oraz hasło (minimum 6 znaków). Twoje dane są bezpieczne i
                chronione zgodnie z najwyższymi standardami bezpieczeństwa.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Czy mogę zresetować swoje hasło?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tak, możesz zresetować swoje hasło w dowolnym momencie.
                Wystarczy kliknąć "Zapomniałem hasła" na stronie logowania i
                postępować zgodnie z instrukcjami wysłanymi na Twój email.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Jak mogę skontaktować się z obsługą klienta?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Możesz skontaktować się z nami przez formularz kontaktowy na
                stronie "Kontakt" lub wysłać email bezpośrednio na nasz adres.
                Odpowiadamy na wszystkie wiadomości w ciągu 24 godzin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Nie znalazłeś odpowiedzi?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Jeśli masz dodatkowe pytania, skontaktuj się z nami. Jesteśmy tutaj,
            aby Ci pomóc!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 font-bold shadow-lg"
            >
              📧 Skontaktuj się z nami
            </Link>
            <Link
              href="/dieta"
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 font-bold"
            >
              Dieta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

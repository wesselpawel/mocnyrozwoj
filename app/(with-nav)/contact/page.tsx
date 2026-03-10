"use client";

import { useEffect, useMemo, useState } from "react";
import { leadsService } from "@/lib/leadsService";
import { getMissingFirebaseEnvVars, isFirebaseConfigured } from "@/firebase";
import { FaEnvelope, FaClock, FaComments, FaCheck } from "react-icons/fa";
import FAQ from "@/components/FAQ";
import { defaultFAQItems } from "@/lib/faqData";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [firebaseReady, setFirebaseReady] = useState(true);
  const [firebaseConfigError, setFirebaseConfigError] = useState<string | null>(
    null
  );

  const subjectOptions = useMemo(
    () => [
      { value: "general", label: "Ogólne pytanie" },
      { value: "technical", label: "Wsparcie techniczne" },
      { value: "billing", label: "Pytania o płatności" },
      { value: "partnership", label: "Współpraca" },
      { value: "feedback", label: "Opinia" },
    ],
    []
  );

  useEffect(() => {
    if (isFirebaseConfigured()) {
      setFirebaseReady(true);
      setFirebaseConfigError(null);
      return;
    }

    const missingVars = getMissingFirebaseEnvVars();
    setFirebaseReady(false);
    setFirebaseConfigError(
      `Brakuje konfiguracji Firebase: ${missingVars.join(", ")}`
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!firebaseReady) {
      setSubmitStatus("error");
      setSubmitError(
        "Formularz jest chwilowo niedostępny. Brakuje konfiguracji Firebase."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const leadData = {
        ...formData,
        status: "new" as const,
        source: "contact_form",
      };

      await leadsService.addLead(leadData);

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        subject: "general",
      });
    } catch (error) {
      setSubmitStatus("error");
      const errorMessage =
        error instanceof Error ? error.message.toLowerCase() : "";

      if (
        errorMessage.includes("permission") ||
        errorMessage.includes("insufficient")
      ) {
        setSubmitError(
          "Połączenie z bazą danych działa, ale nie masz uprawnień do zapisu formularza. Sprawdź reguły Firestore dla kolekcji `leads`."
        );
      } else if (errorMessage.includes("network")) {
        setSubmitError(
          "Nie udało się połączyć z Firebase. Sprawdź połączenie internetowe i spróbuj ponownie."
        );
      } else {
        setSubmitError(
          "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie za chwilę."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="mt-28 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="w-max max-w-full flex flex-row items-center px-5 py-1.5 bg-[#e77503] text-white rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg mb-6">
            <div className="p-1 w-5 h-5 rounded-full bg-[#fcaa30] flex items-center justify-center mr-2">
              <FaCheck className="text-white text-xs" />
            </div>
            <p className="text-sm">Skontaktuj się z zespołem</p>
          </div>

          <h1 className="font-montserrat font-extrabold tracking-[0.2rem] text-3xl sm:text-4xl lg:text-5xl text-[#1f1d1d] mb-4">
            KONTAKT
          </h1>
          <p className="max-w-3xl text-zinc-700 font-montserrat leading-relaxed">
            Masz pytania o dietę, płatności albo techniczne działanie serwisu?
            Napisz do nas przez formularz, a odpowiemy możliwie szybko.
          </p>
        </div>
      </section>

      <section className="py-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-3xl border border-[#e77503]/20 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
              <h2 className="font-anton tracking-[0.08rem] text-2xl text-[#1f1d1d] mb-6">
                Wyślij wiadomość
              </h2>

              {!firebaseReady && firebaseConfigError && (
                <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-lg mb-6">
                  {firebaseConfigError}
                </div>
              )}

              {submitStatus === "success" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {submitError ||
                    "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie."}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#e77503] focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź swoje imię i nazwisko"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#e77503] focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź swój email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#e77503] focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź numer telefonu (opcjonalnie)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Temat *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#e77503] focus:border-transparent transition-colors duration-200 !text-black"
                  >
                    {subjectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-zinc-700 mb-2"
                  >
                    Wiadomość *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-zinc-300 rounded-xl focus:ring-2 focus:ring-[#e77503] focus:border-transparent transition-colors duration-200 !text-black resize-none"
                    placeholder="Napisz swoją wiadomość..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !firebaseReady}
                  className="w-full bg-[#e77503] text-white py-3 px-6 rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg hover:bg-[#d86a00] transition-all duration-200 font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="rounded-3xl border border-[#e77503]/20 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="font-anton tracking-[0.08rem] text-xl text-[#1f1d1d] mb-6">
                  Informacje kontaktowe
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#e77503] rounded-full flex items-center justify-center">
                      <FaClock className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-800">Godziny pracy</p>
                      <p className="text-zinc-600">Pon-Pt: 9:00 - 17:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#e77503] rounded-full flex items-center justify-center">
                      <FaComments className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-800">Czas odpowiedzi</p>
                      <p className="text-zinc-600">Do 24 godzin</p>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl border border-[#e77503]/20 bg-white p-6 sm:p-8 lg:p-10 shadow-sm">
            <h2 className="font-montserrat font-extrabold tracking-[0.12rem] text-2xl sm:text-3xl text-[#1f1d1d] mb-4 text-center">
            Często zadawane pytania
            </h2>
            <p className="text-zinc-600 text-lg mb-8 text-center">
              Może znajdziesz odpowiedź na swoje pytanie poniżej.
            </p>
            <FAQ items={defaultFAQItems} />
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { leadsService } from "@/lib/leadsService";
import {
  FaEnvelope,
  FaClock,
  FaComments,
  FaCheck,
  FaQuestion,
} from "react-icons/fa";

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
      console.error("Error submitting lead:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className=" text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 mb-6">
            Skontaktuj się z nami
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Masz pytania? Chcesz dowiedzieć się więcej o naszych usługach?
            Jesteśmy tutaj, aby Ci pomóc!
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Wyślij wiadomość
              </h2>

              {submitStatus === "success" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Dziękujemy za wiadomość! Skontaktujemy się z Tobą wkrótce.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź swoje imię i nazwisko"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź swój email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 !text-black"
                    placeholder="Wprowadź numer telefonu (opcjonalnie)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Temat *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 !text-black"
                  >
                    <option value="general">Ogólne pytanie</option>
                    <option value="technical">Wsparcie techniczne</option>
                    <option value="billing">Pytania o płatności</option>
                    <option value="partnership">Współpraca</option>
                    <option value="feedback">Opinia</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 !text-black resize-none"
                    placeholder="Napisz swoją wiadomość..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Wysyłanie..." : "📧 Wyślij wiadomość"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Informacje kontaktowe
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-gray-600">kontakt@mocnyrozwoj.pl</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <FaClock className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Godziny pracy
                      </p>
                      <p className="text-gray-600">Pon-Pt: 9:00 - 17:00</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center">
                      <FaComments className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Czas odpowiedzi
                      </p>
                      <p className="text-gray-600">Do 24 godzin</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Dlaczego warto się z nami skontaktować?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-1">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <p className="text-gray-600">
                      Otrzymasz spersonalizowane odpowiedzi na swoje pytania
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-1">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <p className="text-gray-600">
                      Pomożemy Ci wybrać najlepsze narzędzia rozwojowe
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mt-1">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <p className="text-gray-600">
                      Otrzymasz wsparcie techniczne w razie problemów
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Link Section */}
      <div className="py-16 px-6 lg:px-12 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Sprawdź też FAQ
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Może znajdziesz odpowiedź na swoje pytanie w naszej sekcji często
            zadawanych pytań.
          </p>
          <a
            href="/faq"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 font-bold shadow-lg"
          >
            <FaQuestion className="mr-2" />
            Zobacz FAQ
          </a>
        </div>
      </div>
    </div>
  );
}

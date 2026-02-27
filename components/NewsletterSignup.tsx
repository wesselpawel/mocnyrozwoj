"use client";

import { useState } from "react";
import { leadsService } from "@/lib/leadsService";
import { MdEmail } from "react-icons/md";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Proszę wprowadzić adres email");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Proszę wprowadzić poprawny adres email");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const newsletterData = {
        name: "Newsletter Subscriber",
        email: email.trim(),
        phone: "",
        message: "Zapisy do newslettera",
        subject: "newsletter",
        status: "new" as const,
        source: "newsletter_signup",
      };

      await leadsService.addLead(newsletterData);

      setSubmitStatus("success");
      setEmail("");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {submitStatus === "success" && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          Dziękujemy za zapisanie się do newslettera! Wkrótce otrzymasz pierwsze
          informacje.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          Wystąpił błąd podczas zapisywania. Spróbuj ponownie.
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Twój adres email"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 !text-black text-center sm:text-left"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Zapisywanie..."
          ) : (
            <>
              <MdEmail className="text-base" />
              Zapisz się
            </>
          )}
        </button>
      </form>
    </div>
  );
}

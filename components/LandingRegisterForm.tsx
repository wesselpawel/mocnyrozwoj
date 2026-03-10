"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaCheck } from "react-icons/fa";
import { useAuth } from "@/components/AuthContext";

export default function LandingRegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!formData.name.trim()) {
      setError("Podaj imię i nazwisko.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Podaj poprawny adres email.");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Hasło musi mieć minimum 6 znaków.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Hasła nie są takie same.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const { signUpWithEmail, createUserInFirestore } = await import("@/firebase");
      const userCredential = await signUpWithEmail(
        formData.email.trim(),
        formData.password,
      );

      const userData = {
        id: userCredential.user.uid,
        email: userCredential.user.email || "",
        name: formData.name.trim(),
        subscriptionStatus: "free" as const,
        totalPurchases: 0,
        totalSpent: 0,
        purchasedCourses: [],
      };

      await createUserInFirestore(userData);
      login(userData);
      router.push("/dashboard");
    } catch (submitError: unknown) {
      const err = submitError as { code?: string };
      if (err.code === "auth/email-already-in-use") {
        setError("Ten email jest już używany. Zaloguj się.");
      } else if (err.code === "auth/invalid-email") {
        setError("Nieprawidłowy adres email.");
      } else if (err.code === "auth/weak-password") {
        setError("Hasło jest zbyt słabe.");
      } else {
        setError("Nie udało się utworzyć konta. Spróbuj ponownie.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#e77503]/20 bg-white p-5 sm:p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="font-anton tracking-[0.06rem] text-2xl text-[#1f1d1d]">
          ZAŁÓŻ KONTO
        </h3>
        <p className="text-sm text-zinc-600 mt-1">
          Zacznij od razu - utworzenie konta zajmuje mniej niż minutę.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <FaUser className="text-[#e77503]" />
            Imię i nazwisko
          </span>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-black focus:border-[#e77503] focus:outline-none"
            placeholder="Np. Anna Kowalska"
          />
        </label>

        <label className="block">
          <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <FaEnvelope className="text-[#e77503]" />
            Email
          </span>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-black focus:border-[#e77503] focus:outline-none"
            placeholder="twoj@email.com"
          />
        </label>

        <label className="block">
          <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <FaLock className="text-[#e77503]" />
            Hasło
          </span>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-black focus:border-[#e77503] focus:outline-none"
            placeholder="Minimum 6 znaków"
            minLength={6}
          />
        </label>

        <label className="block">
          <span className="mb-1 inline-flex items-center gap-2 text-xs font-semibold text-zinc-700">
            <FaLock className="text-[#e77503]" />
            Potwierdź hasło
          </span>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-300 px-3 py-2.5 text-sm text-black focus:border-[#e77503] focus:outline-none"
            placeholder="Powtórz hasło"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#e77503] px-4 py-3 text-white font-semibold hover:bg-[#d96c02] transition-colors disabled:opacity-60"
        >
          {isSubmitting ? (
            "Tworzenie konta..."
          ) : (
            <>
              <FaCheck className="text-xs" />
              Utwórz konto i przejdź do panelu
            </>
          )}
        </button>
      </form>
    </div>
  );
}

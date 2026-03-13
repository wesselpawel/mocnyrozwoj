"use client";

import { FaCheck } from "react-icons/fa";
import { useAuth } from "@/components/AuthContext";

type PlanId = "free" | "basic" | "advanced" | "pro";

type Plan = {
  id: PlanId;
  name: string;
  price: string;
  days: number;
  features: string[];
};

const plans: Plan[] = [
  {
    id: "free",
    name: "Poziom 1",
    price: "0 zł / miesiąc",
    days: 2,
    features: ["2 dni diety", "Podstawowy dostęp", "Start bez opłat"],
  },
  {
    id: "basic",
    name: "Poziom 2",
    price: "9 zł / miesiąc",
    days: 7,
    features: ["7 dni diety", "Czego unikać", "Najczęstsze błędy"],
  },
  {
    id: "advanced",
    name: "Poziom 3",
    price: "19 zł / miesiąc",
    days: 14,
    features: ["14 dni diety", "Resetowanie dni", "Wymiana dań"],
  },
  {
    id: "pro",
    name: "Poziom 4",
    price: "29 zł / miesiąc",
    days: 30,
    features: ["30 dni diety", "Najnowszy algorytm", "Pełen dostęp"],
  },
];

export default function HomeDietPricingSection() {
  const { user } = useAuth();

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === "free") return;

    try {
      const response = await fetch("/api/stripe/subscription-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userEmail: user?.email || null,
          userId: user?.id || null,
        }),
      });

      const data = await response.json();
      if (data?.success && data?.url) {
        window.location.href = data.url;
      }
    } catch {
      // silent fail - keep UI simple on landing
    }
  };

  return (
    <div className="py-16 px-6 lg:px-12 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-montserrat font-extrabold tracking-[0.3rem] text-left text-3xl sm:text-4xl lg:text-5xl text-[#1f2b4a] mb-3">
          CENNIK NASZEJ DIETY ONLINE
        </h2>
        <p className="text-zinc-600 mb-8">
          Wybierz plan, aby odblokować więcej dni diety.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plans.map((plan) => {
            const isFree = plan.id === "free";
            const isHighlighted = plan.id === "pro";
            return (
              <article
                key={plan.id}
                className={`rounded-2xl border p-6 transition-all ${
                  isHighlighted
                    ? "border-[#e6c89b] bg-[#fff9f2]"
                    : "border-zinc-200 bg-white"
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-4xl sm:text-4xl font-semibold text-[#1f2b4a]">
                    {plan.name}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isFree
                        ? "bg-green-100 text-green-700"
                        : "bg-[#fff3e0] text-[#b45b00]"
                    }`}
                  >
                    {isFree ? "Aktualny plan" : `${plan.days} dni`}
                  </span>
                </div>

                <p className="text-5xl sm:text-5xl font-extrabold text-[#e77503] mb-5">
                  {plan.price}
                </p>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-zinc-700">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e77503] text-white">
                        <FaCheck size={10} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isFree}
                  className={`w-full rounded-full px-4 py-3 text-lg font-semibold transition-colors ${
                    isFree
                      ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                      : "bg-[#e77503] text-white hover:bg-[#d96c02]"
                  }`}
                >
                  {isFree ? "Aktywny" : "Wybierz plan"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

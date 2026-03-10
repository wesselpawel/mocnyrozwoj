"use client";

import { useRouter } from "next/navigation";
import StaticTest from "@/components/Products/StaticTest";
import staticQuestions from "@/components/Products/staticQuestions.json";
import { IProduct, IQuestion } from "@/types";
import { useAuth } from "@/components/AuthContext";

const landingTest: IProduct = {
  id: "landing-static-test",
  title: "Dieta",
  description: "Szybki test dietetyczny",
  images: [],
  mainImage: "",
  price: 0,
  tags: [],
  questions: staticQuestions as IQuestion[],
};

export default function LandingInteractiveTest() {
  const { user } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <div className="rounded-3xl border border-[#e77503]/15 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-[#1c2b4a]">
          Masz już konto - test jest dostępny w panelu.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 inline-flex items-center rounded-full bg-[#e77503] px-6 py-2.5 font-semibold text-white transition-colors hover:bg-[#d96c02]"
        >
          Przejdź do dashboardu
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#e77503]/15 shadow-sm">
      <StaticTest
        setTest={() => {}}
        test={landingTest}
        hideCloseButton
        embeddedMode
      />
    </div>
  );
}

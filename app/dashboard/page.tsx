"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logoNew.png";
import {
  FaShoppingCart,
  FaBook,
  FaSignOutAlt,
  FaDownload,
  FaArrowLeft,
  FaPlay,
  FaClock,
  FaStar,
  FaUsers,
  FaLock,
  FaLightbulb,
  FaExclamationTriangle,
  FaBullseye,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "@/components/AuthContext";
import { coursesService } from "@/lib/coursesService";
import { dietService } from "@/lib/dietService";
import { userPurchasesService } from "@/lib/userPurchasesService";
import { Course, Diet, IProduct, IQuestion } from "@/types";
import { testResultsService, TestResult } from "@/lib/testResultsService";
import DashboardPersonalReport from "@/components/Products/DashboardPersonalReport";
import DietTest from "@/components/DietTest";
import KcalCalculator from "@/components/KcalCalculator";
import StaticTest from "@/components/Products/StaticTest";
import staticQuestions from "@/components/Products/staticQuestions.json";

const dashboardDietGenerator: IProduct = {
  id: "dashboard-day-1-generator",
  title: "Dzień 1",
  description: "Generator planu diety dla Dnia 1",
  images: [],
  mainImage: "",
  price: 0,
  tags: [],
  questions: staticQuestions as IQuestion[],
};
const OPTIONAL_NOTES_QUESTION = "Czy chcesz dodać dodatkowe uwagi do planu?";

const getDayFromTestName = (testName: string) => {
  const match = /dzień\s*(\d+)/i.exec(testName || "");
  if (!match) return null;
  const day = Number(match[1]);
  return Number.isFinite(day) && day > 0 ? day : null;
};

const getMaxDaysForSubscription = (status?: string) => {
  const normalized = (status || "free").toLowerCase();
  if (normalized === "basic") return 7;
  if (normalized === "advanced") return 14;
  if (normalized === "pro" || normalized === "premium") return 30;
  return 2;
};

const isMaxSubscription = (status?: string) => {
  const normalized = (status || "free").toLowerCase();
  return normalized === "pro" || normalized === "premium";
};

type SubscriptionFeature =
  | "analysisAvoid"
  | "analysisMistakes"
  | "resetDays"
  | "mealSwap"
  | "latestAlgorithm"
  | "fullAccess";

const getSubscriptionRank = (status?: string) => {
  const normalized = (status || "free").toLowerCase();
  if (normalized === "pro" || normalized === "premium") return 3;
  if (normalized === "advanced") return 2;
  if (normalized === "basic") return 1;
  return 0;
};

const hasSubscriptionFeature = (status: string | undefined, feature: SubscriptionFeature) => {
  const rank = getSubscriptionRank(status);
  const featureRank: Record<SubscriptionFeature, number> = {
    analysisAvoid: 1,
    analysisMistakes: 1,
    resetDays: 2,
    mealSwap: 2,
    latestAlgorithm: 3,
    fullAccess: 3,
  };
  return rank >= featureRank[feature];
};

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("test-results");
  const [allDietPlans, setAllDietPlans] = useState<Course[]>([]);
  const [allDiets, setAllDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPlansPopup, setShowPlansPopup] = useState(false);
  const [showUpsellPopup, setShowUpsellPopup] = useState(false);
  const [isUpsellPopupAnimatingIn, setIsUpsellPopupAnimatingIn] = useState(false);
  const [isPlansPopupAnimatingIn, setIsPlansPopupAnimatingIn] = useState(false);
  const [userPurchasedDiets, setUserPurchasedDiets] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push(
        `${process.env.NEXT_PUBLIC_SITE_URL}/login?redirect=/dashboard`,
      );
    }
  }, [user, router]);

  // Load user's purchased diet plans
  useEffect(() => {
    const loadUserPurchasedDiets = async () => {
      if (!user?.id) return;

      try {
        const userDoc = await userPurchasesService.getUserDocument(user.id);
        const purchasedCourses = userDoc?.purchasedCourses;
        const purchasedDiets = Array.isArray(purchasedCourses)
          ? purchasedCourses.filter(
              (item): item is string => typeof item === "string",
            )
          : [];
        setUserPurchasedDiets(purchasedDiets);
      } catch {}
    };

    loadUserPurchasedDiets();
  }, [user?.id]);

  // Handle payment success and refresh user diet plans
  useEffect(() => {
    if (user) {
      // Check if user just completed a payment
      const paymentSuccess = sessionStorage.getItem("paymentSuccess");
      const sessionId = searchParams.get("session_id");
      const purchasedDietId = sessionStorage.getItem("purchasedCourseId");

      if (paymentSuccess === "true" || sessionId) {
        // Clear the flags
        sessionStorage.removeItem("paymentSuccess");
        sessionStorage.removeItem("purchasedCourseId");

        // Remove session_id from URL without page reload
        if (sessionId) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("session_id");
          window.history.replaceState({}, "", newUrl.toString());
        }

        // Switch to "Moje diety" tab and refresh user diet plans
        setActiveTab("my-diets");
        setShowSuccessMessage(true);

        // Force a complete refresh of user diet plans
        setTimeout(() => {
          const loadUserPurchasedDiets = async () => {
            try {
              const userDoc = await userPurchasesService.getUserDocument(
                user.id,
              );
              const purchasedCourses = userDoc?.purchasedCourses;
              const purchasedDiets = Array.isArray(purchasedCourses)
                ? purchasedCourses.filter(
                    (item): item is string => typeof item === "string",
                  )
                : [];
              setUserPurchasedDiets(purchasedDiets);
            } catch {}
          };
          loadUserPurchasedDiets();
        }, 1000); // Small delay to ensure the purchase is fully processed

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      }
    }
  }, [user?.id, searchParams.toString()]);

  // Load diet plans on component mount
  useEffect(() => {
    const loadAllData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [allDietPlansData, allDietsData] = await Promise.all([
          coursesService.getAllCourses(),
          dietService.getAllDiets(),
        ]);
        setAllDietPlans(allDietPlansData);
        setAllDiets(allDietsData);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [user]);

  const isAnalysisTab =
    activeTab === "analysis-advice" ||
    activeTab === "analysis-avoid" ||
    activeTab === "analysis-mistakes";
  const canAccessAvoidTab = hasSubscriptionFeature(
    user?.subscriptionStatus,
    "analysisAvoid",
  );
  const canAccessMistakesTab = hasSubscriptionFeature(
    user?.subscriptionStatus,
    "analysisMistakes",
  );

  useEffect(() => {
    if ((activeTab === "test-results" || isAnalysisTab) && user?.id) {
      testResultsService.getUserTestResults(user.id).then(setTestResults);
    }
  }, [activeTab, isAnalysisTab, user?.id]);

  const tabs = [
    { id: "test-results", name: "Moja dieta", icon: FaStar },
    { id: "analysis-advice", name: "Porady", icon: FaLightbulb },
    { id: "analysis-avoid", name: "Czego unikać", icon: FaExclamationTriangle },
    { id: "analysis-mistakes", name: "Najczęstsze błędy", icon: FaBullseye },
    { id: "settings", name: "Ustawienia", icon: FaUsers },
  ];
  const plans = [
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
      features: [
        "30 dni diety",
        "Najnowszy algorytm",
        "Pełen dostęp",
      ],
    },
  ] as const;

  useEffect(() => {
    if (!showUpsellPopup) {
      setIsUpsellPopupAnimatingIn(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setIsUpsellPopupAnimatingIn(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showUpsellPopup]);

  useEffect(() => {
    if (!showPlansPopup) {
      setIsPlansPopupAnimatingIn(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setIsPlansPopupAnimatingIn(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showPlansPopup]);

  const renderContent = () => {
    switch (activeTab) {
      case "shop":
        return (
          <ShopSection
            dietPlans={allDietPlans}
            diets={allDiets}
            loading={loading}
            userPurchasedDiets={userPurchasedDiets}
          />
        );
      case "my-diets":
        return (
          <MyDietsSection
            dietPlans={allDietPlans}
            diets={allDiets}
            loading={loading}
            userPurchasedDiets={userPurchasedDiets}
            showSuccessMessage={showSuccessMessage}
          />
        );
      case "kcal-calculator":
        return <KcalCalculator />;
      case "settings":
        return <SettingsSection />;
      case "test-results":
        return (
          <TestResultsSection
            testResults={testResults}
            loading={activeTab === "test-results" && !testResults}
            subscriptionStatus={user?.subscriptionStatus}
            onDietGenerated={() => {
              if (user?.id) {
                testResultsService.getUserTestResults(user.id).then(setTestResults);
              }
            }}
          />
        );
      case "analysis-advice":
        return (
          <AnalysisTabSection
            testResults={testResults}
            loading={isAnalysisTab && !testResults}
            view="advice"
          />
        );
      case "analysis-avoid":
        return (
          <AnalysisTabSection
            testResults={testResults}
            loading={isAnalysisTab && !testResults}
            view="avoid"
          />
        );
      case "analysis-mistakes":
        return (
          <AnalysisTabSection
            testResults={testResults}
            loading={isAnalysisTab && !testResults}
            view="mistakes"
          />
        );
      default:
        return (
          <ShopSection
            dietPlans={allDietPlans}
            diets={allDiets}
            loading={loading}
            userPurchasedDiets={userPurchasedDiets}
          />
        );
    }
  };

  // Show loading while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sprawdzanie autoryzacji...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f4fb]">
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center min-w-0">
                <Image
                  src={logo}
                  width={512}
                  height={512}
                  alt="Mocny Rozwój Osobisty logo"
                  className="h-10 w-10 shrink-0"
                />
                <h1 className="font-bold text-xl ml-3 text-black truncate">
                  Panel użytkownika
                </h1>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="p-2 rounded-full text-gray-600 hover:bg-zinc-100 hover:text-red-600 transition-colors"
                aria-label="Wyloguj"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Witaj,{" "}
              <span className="font-semibold text-black">
                {user?.name.charAt(0).toUpperCase() + user?.name.slice(1) || "Użytkowniku"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "analysis-avoid" && !canAccessAvoidTab) {
                    setShowUpsellPopup(true);
                    return;
                  }
                  if (tab.id === "analysis-mistakes" && !canAccessMistakesTab) {
                    setShowUpsellPopup(true);
                    return;
                  }
                  setActiveTab(tab.id);
                }}
                className={`min-w-max rounded-full px-5 py-2.5 text-sm sm:text-base font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#e77503] text-white"
                    : "bg-[#f6ead8] text-[#b45b00] hover:bg-[#f2dfc3]"
                }`}
              >
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
        {renderContent()}
      </div>

      {showUpsellPopup && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              isUpsellPopupAnimatingIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowUpsellPopup(false)}
          />
          <div
            className={`relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e77503]/30 shadow-2xl bg-cover bg-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isUpsellPopupAnimatingIn
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-95"
            }`}
            style={{ backgroundImage: "url('/assets2/1.jpg')" }}
          >
            <div
              className={`bg-gradient-to-b from-black/75 via-black/70 to-black/80 p-6 sm:p-8 text-white transition-all duration-500 delay-75 ${
                isUpsellPopupAnimatingIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ups... Używasz funkcji płatnej, której nie obejmuje Twój darmowy plan.
              </h3>
              <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
                Czy chcesz zobaczyć nasz cennik? Najtańszy plan zaczyna się już {" "}
                <b>od{" "}
                9 złotych na miesiąc</b>. Bez ukrytych opłat.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpsellPopup(false);
                    setShowPlansPopup(true);
                  }}
                  className="rounded-full bg-[#e77503] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d96c02] transition-colors"
                >
                  Zobacz cennik
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpsellPopup(false)}
                  className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Zostań przy darmowej wersji
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlansPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
              isPlansPopupAnimatingIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowPlansPopup(false)}
          />
          <div
            className={`relative w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isPlansPopupAnimatingIn
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-95"
            }`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1c2b4a]">
                  Dostępne plany
                </h3>
                <p className="text-zinc-600 mt-2">
                  Wybierz plan, aby odblokować więcej funkcji.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                onClick={() => setShowPlansPopup(false)}
              >
                Zamknij
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const currentPlan = (user?.subscriptionStatus || "free").toLowerCase();
                const isCurrent = currentPlan === plan.id;
                const isHighlighted = plan.id === "pro";
                return (
                  <article
                    key={plan.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isHighlighted
                        ? "border-[#e77503]/40 bg-[#fff7ef]"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-xl font-bold text-[#1c2b4a]">{plan.name}</h4>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isCurrent
                            ? "bg-green-100 text-green-700"
                            : "bg-[#fff3e0] text-[#b45b00]"
                        }`}
                      >
                        {isCurrent ? "Aktualny plan" : `${plan.days} dni`}
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#e77503] mb-4">
                      {plan.price}
                    </p>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-zinc-700"
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e77503] text-white">
                            <FaCheck size={10} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isCurrent
                          ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                          : "bg-[#e77503] text-white hover:bg-[#d96c02]"
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Aktywny" : "Wybierz plan"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Shop Section
function ShopSection({
  dietPlans,
  diets,
  loading,
  userPurchasedDiets,
}: {
  dietPlans: Course[];
  diets: Diet[];
  loading: boolean;
  userPurchasedDiets: string[];
}) {
  const { user } = useAuth();
  const [showTest, setShowTest] = useState(false);
  const [selectedDietPlan, setSelectedDietPlan] = useState<Course | null>(null);

  const handleStartTest = (dietPlan: Course) => {
    setSelectedDietPlan(dietPlan);
    setShowTest(true);
  };

  const handlePurchase = async (item: Course | Diet) => {
    try {
      const isDiet = "difficulty" in item;
      const endpoint = isDiet
        ? "/api/stripe/diet-checkout"
        : "/api/stripe/checkout";

      const requestBody = isDiet
        ? {
            dietId: item.id,
            dietTitle: item.title,
            dietPrice: item.price,
            userEmail: user?.email,
            userId: user?.id,
            dietData: {
              duration: item.duration,
              difficulty: item.difficulty,
              category: item.category,
              image: item.image,
            },
          }
        : {
            courseId: item.id,
            courseTitle: item.title,
            coursePrice: item.price,
            userEmail: user?.email,
            userId: user?.id,
          };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sklep</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie planów dietetycznych...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sklep</h2>

      {/* Diets Section */}
      {diets.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Plany dietetyczne
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diets.map((diet) => {
              const isOwned = userPurchasedDiets.includes(diet.id);

              return (
                <div
                  key={diet.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-xl overflow-hidden">
                    {diet.image && (
                      <img
                        src={diet.image}
                        alt={diet.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaBook className="text-white text-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {diet.category}
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        {diet.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {diet.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {diet.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{diet.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span>{diet.successRate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        {diet.price} PLN
                      </span>
                      {isOwned ? (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Zakupiony
                        </span>
                      ) : (
                        <button
                          onClick={() => handlePurchase(diet)}
                          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                        >
                          Kup teraz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {dietPlans.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Kursy rozwoju osobistego
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((dietPlan) => {
              const isOwned = userPurchasedDiets.includes(dietPlan.id);

              return (
                <div
                  key={dietPlan.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-0"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-xl overflow-hidden">
                    {dietPlan.image && (
                      <img
                        src={dietPlan.image}
                        alt={dietPlan.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaPlay className="text-white text-lg ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        {dietPlan.category}
                      </span>
                      <span className="text-xs font-medium text-gray-600">
                        {dietPlan.level}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {dietPlan.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {dietPlan.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          <span>{dietPlan.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="mr-1" />
                          <span>{dietPlan.students}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-black">
                          {dietPlan.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        {dietPlan.price} PLN
                      </span>
                      {isOwned ? (
                        <span className="text-sm text-green-600 font-medium">
                          ✓ Zakupiony
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStartTest(dietPlan)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                        >
                          Rozpocznij test
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No content message */}
      {dietPlans.length === 0 && diets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShoppingCart size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Brak dostępnych produktów
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Wkrótce pojawią się nowe plany dietetyczne i kursy.
          </p>
        </div>
      )}

      {/* Diet Test Modal */}
      {showTest && selectedDietPlan && (
        <DietTest
          setShowTest={setShowTest}
          dietPlan={selectedDietPlan}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
}

// My Diets Section
function MyDietsSection({
  dietPlans,
  diets,
  loading,
  userPurchasedDiets,
  showSuccessMessage,
}: {
  dietPlans: Course[];
  diets: Diet[];
  loading: boolean;
  userPurchasedDiets: string[];
  showSuccessMessage: boolean;
}) {
  const { user } = useAuth();

  const handleDownloadPdf = async (item: Course | Diet) => {
    const pdfFile = "pdfFile" in item ? item.pdfFile : item.pdfFile;

    if (!pdfFile) {
      alert("PDF nie jest dostępny dla tego produktu.");
      return;
    }

    try {
      // Create a temporary link to download the PDF
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = `${item.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("Błąd podczas pobierania PDF.");
    }
  };

  const handleRefresh = () => {
    // Reload the page to refresh user diet plans
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Moje zasoby</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
          >
            Odśwież
          </button>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie planów dietetycznych...</p>
        </div>
      </div>
    );
  }

  // Filter only items that user owns
  const ownedDiets = dietPlans.filter((dietPlan) =>
    userPurchasedDiets.includes(dietPlan.id),
  );
  const ownedDietPlans = diets.filter((diet) =>
    userPurchasedDiets.includes(diet.id),
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Moje zasoby</h2>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
        >
          Odśwież
        </button>
      </div>

      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Plan dietetyczny został zakupiony pomyślnie! Możesz teraz pobrać
                PDF.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Diets Section */}
      {ownedDietPlans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Plany dietetyczne
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedDietPlans.map((diet) => (
              <div
                key={diet.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-0"
              >
                <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-t-xl overflow-hidden">
                  {diet.image && (
                    <img
                      src={diet.image}
                      alt={diet.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaBook className="text-white text-lg" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {diet.category}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {diet.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {diet.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {diet.shortDescription}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{diet.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>{diet.successRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Zakupiony
                    </span>
                    <button
                      onClick={() => handleDownloadPdf(diet)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <FaDownload />
                      Pobierz PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {ownedDiets.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Kursy rozwoju osobistego
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedDiets.map((dietPlan) => (
              <div
                key={dietPlan.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow min-w-0"
              >
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-xl overflow-hidden">
                  {dietPlan.image && (
                    <img
                      src={dietPlan.image}
                      alt={dietPlan.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <FaPlay className="text-white text-lg ml-1" />
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {dietPlan.category}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      {dietPlan.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {dietPlan.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {dietPlan.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{dietPlan.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="mr-1" />
                        <span>{dietPlan.students}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-black">
                        {dietPlan.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      ✓ Zakupiony
                    </span>
                    <button
                      onClick={() => handleDownloadPdf(dietPlan)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <FaDownload />
                      Pobierz PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No content message */}
      {ownedDiets.length === 0 && ownedDietPlans.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaBook size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Nie masz jeszcze żadnych zasobów
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Kup swój pierwszy plan dietetyczny lub kurs w sekcji "Sklep" i
            rozpocznij swoją podróż do lepszego zdrowia i rozwoju.
          </p>
        </div>
      )}
    </div>
  );
}

function TestResultsSection({
  testResults,
  loading,
  subscriptionStatus,
  onDietGenerated,
}: {
  testResults: TestResult[];
  loading: boolean;
  subscriptionStatus?: string;
  onDietGenerated?: () => void;
}) {
  const { user } = useAuth();
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isPopupAnimatingIn, setIsPopupAnimatingIn] = useState(false);
  const [openedDay, setOpenedDay] = useState<number | null>(null);
  const [generatorTest, setGeneratorTest] = useState<IProduct | Diet | null>(null);
  const [generatedByDay, setGeneratedByDay] = useState<Record<number, TestResult>>(
    {},
  );
  const [generatingDay, setGeneratingDay] = useState<number | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPlansPopup, setShowPlansPopup] = useState(false);
  const [showUpsellPopup, setShowUpsellPopup] = useState(false);
  const [isUpsellPopupAnimatingIn, setIsUpsellPopupAnimatingIn] = useState(false);
  const [isPlansPopupAnimatingIn, setIsPlansPopupAnimatingIn] = useState(false);

  useEffect(() => {
    if (!isResultOpen && !generatorTest && !showPlansPopup && !showUpsellPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isResultOpen, generatorTest, showPlansPopup, showUpsellPopup]);

  useEffect(() => {
    if (!showUpsellPopup) {
      setIsUpsellPopupAnimatingIn(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setIsUpsellPopupAnimatingIn(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showUpsellPopup]);

  useEffect(() => {
    if (!showPlansPopup) {
      setIsPlansPopupAnimatingIn(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setIsPlansPopupAnimatingIn(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showPlansPopup]);

  useEffect(() => {
    if (!isResultOpen) {
      setIsPopupAnimatingIn(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsPopupAnimatingIn(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isResultOpen]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Moja dieta</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie Twojej diety...</p>
        </div>
      </div>
    );
  }

  const maxDays = getMaxDaysForSubscription(user?.subscriptionStatus);
  const persistedByDay = [...testResults]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce<Record<number, TestResult>>((acc, result) => {
      const day = getDayFromTestName(result.testName);
      if (!day || day > maxDays || acc[day]) return acc;
      acc[day] = result;
      return acc;
    }, {});
  const dayResults = Array.from({ length: maxDays }, (_, index) => {
    const day = index + 1;
    return generatedByDay[day] ?? persistedByDay[day] ?? null;
  });
  const latestPreferences = [...testResults]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .find((result) => Array.isArray(result.answers) && result.answers.length > 0);
  const savedPreferences =
    latestPreferences?.answers.filter(
      (item) => item.question !== OPTIONAL_NOTES_QUESTION,
    ) ?? [];
  const dayOneResult = dayResults[0];
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);
  const totalDays = maxDays;
  const availableDays = dayResults.filter(Boolean).length;
  const openedDayResult = openedDay ? dayResults[openedDay - 1] : null;
  const showAddDaysCard = !isMaxSubscription(user?.subscriptionStatus);
  const canResetDays = hasSubscriptionFeature(subscriptionStatus, "resetDays");
  const canUseLatestAlgorithm = hasSubscriptionFeature(
    subscriptionStatus,
    "latestAlgorithm",
  );
  const plans = [
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
      features: [
        "30 dni diety",
        "Najnowszy algorytm",
        "Pełen dostęp",
      ],
    },
  ] as const;

  const generateDayPlan = async (day: number) => {
    if (!user?.id || generatingDay) return;

    if (day > maxDays) return;
    const previousDayResult = day > 1 ? dayResults[day - 2] : null;
    if (day > 1 && !previousDayResult) return;
    if (savedPreferences.length === 0) return;

    setGeneratingDay(day);
    setGenerationProgress(0);

    const progressInterval = window.setInterval(() => {
      setGenerationProgress((prev) => Math.min(prev + Math.floor(Math.random() * 8) + 3, 92));
    }, 400);

    try {
      const prompt = savedPreferences;
      const previousDayMealNames =
        day > 1 &&
        previousDayResult?.report &&
        typeof previousDayResult.report === "object" &&
        Array.isArray(
          (previousDayResult.report as { plan_dnia?: unknown[] }).plan_dnia,
        )
          ? (
              (previousDayResult.report as {
                plan_dnia: Array<{ nazwa_posilku?: string }>;
              }).plan_dnia || []
            )
              .map((meal) => meal?.nazwa_posilku)
              .filter((name): name is string => Boolean(name && name.trim()))
          : [];

      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          testName: `Dzień ${day}`,
          previousDayMealNames,
          algorithmVersion: canUseLatestAlgorithm ? "latest" : "standard",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate diet");
      }
      const report = await response.json();

      await testResultsService.saveTestResult({
        userId: user.id,
        testName: `Dzień ${day}`,
        answers: prompt,
        report,
      });

      const createdAt = new Date().toISOString();
      const generatedResult: TestResult = {
        id: `generated_${day}_${Date.now()}`,
        userId: user.id,
        testName: `Dzień ${day}`,
        answers: prompt,
        report,
        createdAt,
      };

      setGeneratedByDay((prev) => ({ ...prev, [day]: generatedResult }));
      setGenerationProgress(100);
      setOpenedDay(day);
      setIsResultOpen(true);
      onDietGenerated?.();
    } catch {
    } finally {
      window.clearInterval(progressInterval);
      setTimeout(() => {
        setGeneratingDay(null);
        setGenerationProgress(0);
      }, 500);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[#1c2b4a]">
            Moja dieta
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Twój plan jest dostępny dzień po dniu.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!canResetDays) {
              setShowUpsellPopup(true);
              return;
            }
            setOpenedDay(null);
            setIsResultOpen(false);
            setGeneratorTest(dashboardDietGenerator);
          }}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
            canResetDays
              ? "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              : "border-[#e77503]/30 bg-[#fff3e0] text-[#b45b00] hover:bg-[#fde7c3]"
          }`}
        >
          {canResetDays ? "Rozpocznij od nowa" : "Rozpocznij od nowa (Poziom 3)"}
        </button>
      </div>

      <div className="rounded-2xl bg-zinc-50/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {days.map((day) => {
          const result = dayResults[day - 1];
          const isGenerating = generatingDay === day;
          const isBlockedBySequence = day > 1 && !dayResults[day - 2];
          const hasPreferences = savedPreferences.length > 0;
          return (
            <button
              type="button"
              key={day}
              className={`group rounded-2xl p-4 text-left border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm ${
                result
                  ? "border-[#e77503]/30 bg-[#e77503]"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
              onClick={() => {
                if (result) {
                  setOpenedDay(day);
                  setIsResultOpen(true);
                  return;
                }

                if (!hasPreferences && day === 1) {
                  setGeneratorTest(dashboardDietGenerator);
                  return;
                }

                if (isBlockedBySequence || !hasPreferences) return;

                if (user?.id && day <= maxDays) {
                  generateDayPlan(day);
                }
              }}
              disabled={isGenerating || isBlockedBySequence}
            >
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-base ${
                      result ? "text-white" : "text-[#1c2b4a]"
                    }`}
                  >
                    Dzień {day}
                  </span>
                  {result ? (
                    <span className="rounded-full bg-[#fff3e0] px-2.5 py-1 text-xs font-semibold text-[#b45b00] transition-transform duration-300 group-hover:scale-105">
                      Gotowy
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#e77503] px-2 py-1 text-[11px] font-medium text-white transition-transform duration-300 group-hover:scale-105">
                      <FaLock size={10} />
                      Stwórz
                    </span>
                  )}
                </div>
                <div className={`text-sm ${result ? "text-white/80" : "text-zinc-500"}`}>
                  {isGenerating
                    ? `Tworzenie planu... ${generationProgress}%`
                    : result
                      ? new Date(result.createdAt).toLocaleDateString()
                      : !hasPreferences
                        ? "Uzupełnij preferencje"
                        : isBlockedBySequence
                          ? "Najpierw stwórz poprzedni dzień"
                          : "Brak planu"}
                </div>
                {isGenerating && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                )}
               
              </div>
            </button>
          );
        })}
        {showAddDaysCard && (
          <button
            type="button"
            className="group rounded-2xl p-4 text-left border border-zinc-200 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-zinc-300"
            onClick={() => setShowUpsellPopup(true)}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base text-[#1c2b4a]">
                  Więcej dni
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e77503] px-2 py-1 text-[11px] font-medium text-white transition-transform duration-300 group-hover:scale-105">
                  Dodaj
                </span>
              </div>
              <div className="text-sm text-zinc-500">Dostępne dni: {availableDays}/{totalDays}</div>
            </div>
          </button>
        )}
      </div>
      </div>

      {showUpsellPopup && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-3 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              isUpsellPopupAnimatingIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowUpsellPopup(false)}
          />
          <div
            className={`relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e77503]/30 shadow-2xl bg-cover bg-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isUpsellPopupAnimatingIn
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-95"
            }`}
            style={{ backgroundImage: "url('/assets2/1.jpg')" }}
          >
            <div
              className={`bg-gradient-to-b from-black/75 via-black/70 to-black/80 p-6 sm:p-8 text-white transition-all duration-500 delay-75 ${
                isUpsellPopupAnimatingIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
              }`}
            >
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ups... Używasz funkcji płatnej, której nie obejmuje Twój darmowy plan.
              </h3>
              <p className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
                Czy chcesz zobaczyć nasz cennik? Najtańszy plan zaczyna się już od{" "}
                <b>9 złotych na miesiąc</b>. Bez ukrytych opłat.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpsellPopup(false);
                    setShowPlansPopup(true);
                  }}
                  className="rounded-full bg-[#e77503] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#d96c02] transition-colors"
                >
                  Zobacz cennik
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpsellPopup(false)}
                  className="rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  Zostań przy darmowej wersji
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlansPopup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ${
              isPlansPopupAnimatingIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowPlansPopup(false)}
          />
          <div
            className={`relative w-full max-w-4xl rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 lg:p-8 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isPlansPopupAnimatingIn
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-5 scale-95"
            }`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1c2b4a]">
                  Dostępne plany
                </h3>
                <p className="text-zinc-600 mt-2">
                  Wybierz plan, aby odblokować więcej dni diety.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                onClick={() => setShowPlansPopup(false)}
              >
                Zamknij
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const currentPlan = (user?.subscriptionStatus || "free").toLowerCase();
                const isCurrent = currentPlan === plan.id;
                const isHighlighted = plan.id === "pro";
                return (
                  <article
                    key={plan.id}
                    className={`rounded-2xl border p-5 transition-all ${
                      isHighlighted
                        ? "border-[#e77503]/40 bg-[#fff7ef]"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h4 className="text-xl font-bold text-[#1c2b4a]">{plan.name}</h4>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isCurrent
                            ? "bg-green-100 text-green-700"
                            : "bg-[#fff3e0] text-[#b45b00]"
                        }`}
                      >
                        {isCurrent ? "Aktualny plan" : `${plan.days} dni`}
                      </span>
                    </div>
                    <p className="text-2xl font-extrabold text-[#e77503] mb-4">
                      {plan.price}
                    </p>
                    <ul className="space-y-2 mb-5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-zinc-700"
                        >
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e77503] text-white">
                            <FaCheck size={10} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                        isCurrent
                          ? "bg-zinc-100 text-zinc-500 cursor-not-allowed"
                          : "bg-[#e77503] text-white hover:bg-[#d96c02]"
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? "Aktywny" : "Wybierz plan"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      )}

      
      {openedDayResult && isResultOpen && (
        <div
          className={`fixed inset-0 z-50 w-full h-full bg-white transition-opacity duration-300 ${
            isPopupAnimatingIn ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full h-full overflow-y-auto transition-all duration-300 ${
              isPopupAnimatingIn ? "translate-y-0" : "translate-y-3"
            }`}
          >
            <div className="sticky top-0 z-50 px-4 py-3 bg-white border-b border-zinc-100 flex flex-row items-center justify-between gap-3">
              <button
                className="inline-flex items-center gap-2 text-zinc-800 font-semibold transition-all duration-200 hover:text-[#e77503] hover:-translate-x-0.5"
                onClick={() => setIsResultOpen(false)}
                aria-label="Zamknij"
              >
                <FaArrowLeft />
                Powrót
              </button>

              <div className="flex-1 min-w-0">
                <div className="w-full overflow-x-auto scrollbar-hide">
                  <div className="inline-flex min-w-full justify-end gap-2 px-1">
                    {days.map((day) => {
                      const hasDayResult = Boolean(dayResults[day - 1]);
                      const isActive = openedDay === day;
                      return (
                        <button
                          key={`popup-day-${day}`}
                          type="button"
                          onClick={() => {
                            if (!hasDayResult) return;
                            setOpenedDay(day);
                          }}
                          className={`whitespace-nowrap rounded-full px-5 py-2.5 text-base font-bold transition-colors ${
                            isActive
                              ? "bg-[#e77503] text-white"
                              : hasDayResult
                                ? "bg-[#fff3e0] text-[#b45b00] hover:bg-[#fde7c3]"
                                : "bg-zinc-100 text-zinc-400"
                          }`}
                          disabled={!hasDayResult}
                        >
                          Dzień {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
            {openedDayResult.report && typeof openedDayResult.report === "object" ? (
              <div className="mx-auto w-full max-w-6xl py-4">
                <DashboardPersonalReport data={openedDayResult.report} />
              </div>
            ) : (
              <div className="mx-auto w-full max-w-6xl px-4 py-4">
                <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto border border-gray-200">
                  {typeof openedDayResult.report === "string"
                    ? openedDayResult.report
                    : JSON.stringify(openedDayResult.report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {generatorTest && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setGeneratorTest(null)}
          />
          <div className="relative w-full h-[calc(100dvh-1rem)] sm:h-[90vh] sm:max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl">
            <StaticTest
              setTest={setGeneratorTest}
              test={generatorTest}
              autoSaveOnResult
              redirectOnSaveSuccess={false}
              onAutoSaveSuccess={(saved) => {
                const day = 1;
                setGeneratedByDay((prev) => ({
                  ...prev,
                  [day]: {
                    id: `generated_${Date.now()}`,
                    userId: null,
                    testName: saved.testName,
                    answers: saved.answers,
                    report: saved.report,
                    createdAt: saved.createdAt,
                  },
                }));
                setGeneratorTest(null);
                setOpenedDay(day);
                setIsResultOpen(true);
                onDietGenerated?.();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsSection() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Ustawienia</h2>
        <p className="text-gray-600 mt-2">Podstawowe informacje o Twoim koncie.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Imię</div>
          <div className="font-semibold text-zinc-800">{user?.name || "-"}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Email</div>
          <div className="font-semibold text-zinc-800">{user?.email || "-"}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">ID użytkownika</div>
          <div className="font-semibold text-zinc-800 break-all">{user?.id || "-"}</div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Subskrypcja</div>
          <div className="font-semibold text-zinc-800">{user?.subscriptionStatus || "free"}</div>
        </div>
      </div>
    </div>
  );
}

function AnalysisTabSection({
  testResults,
  loading,
  view,
}: {
  testResults: TestResult[];
  loading: boolean;
  view: "advice" | "avoid" | "mistakes";
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Analiza</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie analizy...</p>
        </div>
      </div>
    );
  }

  const latestResult = [...testResults].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const report =
    latestResult && typeof latestResult.report === "object" && latestResult.report
      ? (latestResult.report as Record<string, unknown>)
      : null;
  const analysisData =
    report &&
    typeof report.analiza === "object" &&
    report.analiza !== null
      ? (report.analiza as {
          porady_dla_ciebie?: string[];
          czego_unikac?: string[];
          najczestsze_bledy?: string[];
        })
      : null;
  const currentItems =
    view === "advice"
      ? analysisData?.porady_dla_ciebie ?? []
      : view === "avoid"
        ? analysisData?.czego_unikac ?? []
        : analysisData?.najczestsze_bledy ?? [];
  const viewTitle =
    view === "advice"
      ? "Porady"
      : view === "avoid"
        ? "Czego unikać"
        : "Najczęstsze błędy";
  const viewDescription =
    view === "advice"
      ? "Praktyczne wskazówki dopasowane do Twojego celu."
      : view === "avoid"
        ? "Elementy, których warto unikać, aby szybciej zobaczyć efekty."
        : "Najczęstsze pułapki, które mogą spowolnić Twoje postępy.";

  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{viewTitle}</h2>
        <p className="text-gray-600 mt-2">{viewDescription}</p>
      </div>

      {!latestResult && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
          Nie masz jeszcze zapisanej analizy. Wykonaj test i zapisz wynik, aby
          zobaczyć tę sekcję.
        </div>
      )}

      {latestResult && !analysisData && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
          Dla tego wyniku nie ma jeszcze danych analitycznych. Wykonaj test
          ponownie, aby wygenerować nową analizę.
        </div>
      )}

      {analysisData && currentItems.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
          Brak danych w tej sekcji dla aktualnego wyniku.
        </div>
      )}

      {analysisData && currentItems.length > 0 && (
        <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <ul className="space-y-2">
            {currentItems.map((item, index) => (
              <li
                key={`${view}-${index}`}
                className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ładowanie...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

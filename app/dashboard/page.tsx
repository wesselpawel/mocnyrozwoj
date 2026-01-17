"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import {
  FaShoppingCart,
  FaBook,
  FaSignOutAlt,
  FaDownload,
  FaPlay,
  FaClock,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "@/components/AuthContext";
import { coursesService } from "@/lib/coursesService";
import { dietService } from "@/lib/dietService";
import { userPurchasesService } from "@/lib/userPurchasesService";
import { Course, Diet } from "@/types";
import { testResultsService, TestResult } from "@/lib/testResultsService";
import PersonalReport from "@/components/Products/PersonalReport";
import DietTest from "@/components/DietTest";
import KcalCalculator from "@/components/KcalCalculator";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("shop");
  const [allDietPlans, setAllDietPlans] = useState<Course[]>([]);
  const [allDiets, setAllDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [userPurchasedDiets, setUserPurchasedDiets] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_URL}/login?redirect=/dashboard`);
    }
  }, [user, router]);

  // Load user's purchased diet plans
  useEffect(() => {
    const loadUserPurchasedDiets = async () => {
      if (!user?.id) return;

      try {
        const userDoc = await userPurchasesService.getUserDocument(user.id);
        const purchasedDiets = userDoc?.purchasedCourses || [];
        setUserPurchasedDiets(purchasedDiets);
        console.log("User purchased diet plans:", purchasedDiets);
      } catch (error) {
        console.error("Error loading user purchased diet plans:", error);
      }
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
        console.log(
          "Dashboard: Payment success detected, refreshing user diet plans...",
          {
            paymentSuccess,
            sessionId,
            purchasedDietId,
          }
        );

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
                user.id
              );
              const purchasedDiets = userDoc?.purchasedCourses || [];
              setUserPurchasedDiets(purchasedDiets);
              console.log(
                "Refreshed user purchased diet plans:",
                purchasedDiets
              );

              // Check if the purchased diet is now in the array
              if (purchasedDietId && purchasedDiets.includes(purchasedDietId)) {
                console.log(
                  "✅ Purchased diet plan confirmed in user's plans:",
                  purchasedDietId
                );
              } else if (purchasedDietId) {
                console.log(
                  "❌ Purchased diet plan not found in user's plans:",
                  purchasedDietId
                );
              }
            } catch (error) {
              console.error(
                "Error refreshing user purchased diet plans:",
                error
              );
            }
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
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [user]);

  useEffect(() => {
    if (activeTab === "test-results" && user?.id) {
      testResultsService.getUserTestResults(user.id).then(setTestResults);
    }
  }, [activeTab, user?.id]);

  const tabs = [
    { id: "shop", name: "Sklep", icon: FaShoppingCart },
    { id: "my-diets", name: "Moje zasoby", icon: FaBook },
    { id: "kcal-calculator", name: "Kalkulator KCAL", icon: FaClock },
    { id: "test-results", name: "Wyniki testów", icon: FaStar },
  ];

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
      case "test-results":
        return (
          <TestResultsSection
            testResults={testResults}
            loading={activeTab === "test-results" && !testResults}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <Image
                src={logo}
                width={512}
                height={512}
                alt="Mocny Rozwój Osobisty Logo"
                className="h-12 w-12"
              />
              <h1 className="font-bold text-xl ml-3 text-black">
                Panel użytkownika
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-row items-center gap-1">
                <div className="text-sm text-gray-600">Witaj,</div>
                <div className="font-semibold text-black">
                  {user?.name || "Użytkownik"}
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center min-w-max space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-4 md:py-8">
        {renderContent()}
      </div>
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
        `${process.env.NEXT_PUBLIC_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        console.error("Error creating checkout session:", data.error);
      }
    } catch (error) {
      console.error("Error handling purchase:", error);
    }
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
    } catch (error) {
      console.error("Error downloading PDF:", error);
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
    userPurchasedDiets.includes(dietPlan.id)
  );
  const ownedDietPlans = diets.filter((diet) =>
    userPurchasedDiets.includes(diet.id)
  );

  console.log("MyDietsSection Debug:", {
    totalDietPlans: dietPlans.length,
    totalDiets: diets.length,
    ownedDiets: ownedDiets.length,
    ownedDietPlans: ownedDietPlans.length,
    userOwnedDiets: ownedDiets.map((d) => ({ id: d.id, title: d.title })),
    userOwnedDietPlans: ownedDietPlans.map((d) => ({
      id: d.id,
      title: d.title,
    })),
    currentUserId: user?.id,
    userPurchasedDietsCount: userPurchasedDiets.length,
    userPurchasedDiets: userPurchasedDiets,
  });

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
}: {
  testResults: TestResult[];
  loading: boolean;
}) {
  const [openResult, setOpenResult] = useState<TestResult | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Wyniki testów</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie wyników testów...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Wyniki testów</h2>
      {testResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaStar size={40} className="text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Brak zapisanych wyników testów
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Wypełnij testy i zapisz swoje wyniki, aby zobaczyć je tutaj.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {testResults.map((result) => (
            <div
              key={result.id}
              className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 w-full cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setOpenResult(result)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">
                <div>
                  <div className="font-bold text-lg text-purple-700">
                    {result.testName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {new Date(result.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal Popup for full result */}
      {openResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
              onClick={() => setOpenResult(null)}
              aria-label="Zamknij"
            >
              ×
            </button>
            <div className="mb-4">
              <div className="font-bold text-xl text-purple-700">
                {openResult.testName}
              </div>
              <div className="text-gray-500 text-sm mb-2">
                {new Date(openResult.createdAt).toLocaleString()}
              </div>
            </div>
            {/* Render report using PersonalReport if possible, else fallback to JSON */}
            {openResult.report && typeof openResult.report === "object" ? (
              <PersonalReport data={openResult.report} />
            ) : (
              <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto border border-gray-200">
                {typeof openResult.report === "string"
                  ? openResult.report
                  : JSON.stringify(openResult.report, null, 2)}
              </pre>
            )}
          </div>
        </div>
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

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DietPlanCard from "./CourseCard";
import DietDetailModal from "./DietDetailModal";
import { coursesService } from "@/lib/coursesService";
import { dietService } from "@/lib/dietService";
import { Course, Diet } from "@/types";
import { useAuth } from "./AuthContext";
import { FaCalendar, FaFire, FaUtensils } from "react-icons/fa";
import PurchaseButton from "./PurchaseButton";

export default function Courses() {
  const [dietPlans, setDietPlans] = useState<Course[]>([]);
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("Wszystkie");
  const [categories, setCategories] = useState<string[]>(["Wszystkie"]);
  const [selectedDiet, setSelectedDiet] = useState<Diet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch visible diet plans, diets, and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedDietPlans, fetchedDiets, fetchedCategories] =
          await Promise.all([
            coursesService.getVisibleCourses(),
            dietService.getAllDiets(),
            dietService.getDietCategories(),
          ]);
        setDietPlans(fetchedDietPlans);
        setDiets(fetchedDiets);
        setCategories(["Wszystkie", ...fetchedCategories]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter diets based on selected category
  const filteredDiets =
    selectedCategory === "Wszystkie"
      ? diets
      : diets.filter((diet) => diet.category === selectedCategory);

  const handleDietCheckout = async (diet: Diet) => {
    // If user is not logged in, redirect to login
    if (!user) {
      window.location.href = "/login";
      return;
    }

    setCheckoutLoading(diet.id);
    try {
      const response = await fetch("/api/stripe/diet-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietId: diet.id,
          dietTitle: diet.title,
          dietPrice: diet.price,
          userEmail: user?.email || "",
          userId: user?.id || null,
          dietData: {
            duration: diet.duration,
            difficulty: diet.difficulty,
            calories: diet.calories,
            meals: diet.meals,
            category: diet.category,
            nutritionistName: diet.nutritionistName,
            nutritionistCredentials: diet.nutritionistCredentials,
            benefits: diet.benefits,
            targetAudience: diet.targetAudience,
            mealPlanStructure: diet.mealPlanStructure,
            shoppingList: diet.shoppingList,
            preparationTips: diet.preparationTips,
            progressTracking: diet.progressTracking,
            maintenancePhase: diet.maintenancePhase,
            scientificReferences: diet.scientificReferences,
            clinicalStudies: diet.clinicalStudies,
            averageWeightLoss: diet.averageWeightLoss,
            averageTimeToResults: diet.averageTimeToResults,
            successRate: diet.successRate,
            faq: diet.faq,
            testimonials: diet.testimonials,
            beforeAfterStories: diet.beforeAfterStories,
            image: diet.image,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        alert(
          "Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie."
        );
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Wystąpił błąd podczas przetwarzania płatności. Spróbuj ponownie.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div id="courses" className="bg-white py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className=" text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
              Plany dietetyczne
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Wybierz plan dietetyczny dopasowany do Twoich celów i rozpocznij
              zdrowe odżywianie
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="courses" className="bg-white py-16 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className=" text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">
            Zdrowie, dieta i rozwój osobisty
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Plany dietetyczne i kursy rozwoju osobistego przygotowane przez
            profesjonalistów
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Diets Grid */}
        {filteredDiets.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Plany dietetyczne
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiets.map((diet, index) => (
                <motion.div
                  key={diet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {diet.image && (
                    <div className="h-48 bg-gray-200 relative">
                      <img
                        src={diet.image}
                        alt={diet.title}
                        className="w-full h-full object-cover"
                      />
                      {diet.isPopular && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Popularne
                        </div>
                      )}
                      {diet.isNew && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                          Nowe
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {diet.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {diet.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {diet.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {diet.followers} obserwujących
                      </div>
                    </div>

                    <div className="grid grid-cols-2 w-full gap-4">
                      <button
                        onClick={() => {
                          setSelectedDiet(diet);
                          setIsModalOpen(true);
                        }}
                        className="w-full bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Zobacz szczegóły
                      </button>
                      <PurchaseButton
                        item={{
                          id: diet.id,
                          title: diet.title,
                          price: diet.price,
                          type: "diet",
                          data: {
                            duration: diet.duration,
                            difficulty: diet.difficulty,
                            category: diet.category,
                            image: diet.image,
                          },
                        }}
                        variant="primary"
                      >
                        Kup teraz
                      </PurchaseButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {dietPlans.length > 0 && (
          <div id="shop">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Kursy rozwoju osobistego
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {dietPlans.map((dietPlan, index) => (
                <motion.div
                  key={dietPlan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <DietPlanCard
                    course={dietPlan}
                    onClick={() => {
                      // Handle diet plan click - could open diet plan details or redirect
                      console.log("Diet plan clicked:", dietPlan.title);
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* No content message */}
        {filteredDiets.length === 0 && dietPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4 flex justify-center">
              <FaUtensils />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Brak dostępnych planów
            </h3>
            <p className="text-gray-500">
              Nie ma jeszcze żadnych planów dietetycznych w tej kategorii.
            </p>
          </div>
        )}
      </div>

      {/* Diet Detail Modal */}
      <DietDetailModal
        diet={selectedDiet}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDiet(null);
        }}
      />
    </div>
  );
}

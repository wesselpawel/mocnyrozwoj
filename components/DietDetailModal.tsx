"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diet } from "@/types";
import { useAuth } from "./AuthContext";
import {
  FaClock,
  FaFire,
  FaUtensils,
  FaCalendar,
  FaChartBar,
  FaExclamationTriangle,
  FaCheck,
  FaLightbulb,
  FaShoppingCart,
  FaClipboardList,
  FaCheckCircle,
  FaQuestionCircle,
} from "react-icons/fa";
import PurchaseButton from "./PurchaseButton";

interface DietDetailModalProps {
  diet: Diet | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DietDetailModal({
  diet,
  isOpen,
  onClose,
}: DietDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  if (!diet) return null;

  const parseJsonArray = (data: string | string[]) => {
    if (Array.isArray(data)) {
      return data;
    }
    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return [];
  };

  const tabs = [
    { id: "overview", label: "Przegląd", icon: <FaClipboardList /> },
    // { id: "nutritionist", label: "Dietetyk", icon: "👨‍⚕️" },
    { id: "benefits", label: "Korzyści", icon: <FaCheckCircle /> },
    { id: "faq", label: "FAQ", icon: <FaQuestionCircle /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2 text-gray-700">
                  <FaCalendar />
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Czas trwania
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {diet.duration}
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2 text-gray-700">
                  <FaFire />
                </div>
                <div className="text-sm font-medium text-gray-600">Kalorie</div>
                <div className="text-lg font-bold text-gray-800">
                  {diet.calories} kcal
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2 text-gray-700">
                  <FaUtensils />
                </div>
                <div className="text-sm font-medium text-gray-600">Posiłki</div>
                <div className="text-lg font-bold text-gray-800">
                  {diet.meals}/dzień
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl mb-2 text-gray-700">
                  <FaChartBar />
                </div>
                <div className="text-sm font-medium text-gray-600">
                  Skuteczność
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {diet.successRate}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-black">
                  Średni czas do efektów
                </h4>
                <p className="text-gray-700">{diet.averageTimeToResults}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-black">
                  Średnia utrata wagi
                </h4>
                <p className="text-gray-700">{diet.averageWeightLoss}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-black">Dla kogo</h4>
              <div className="flex flex-wrap gap-2">
                {parseJsonArray(diet.targetAudience).map(
                  (audience: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {audience}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "nutritionist":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {diet.nutritionistName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black">
                    {diet.nutritionistName}
                  </h3>
                  <p className="text-gray-600">
                    {diet.nutritionistCredentials}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{diet.nutritionistBio}</p>
            </div>
          </div>
        );

      case "benefits":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Korzyści z diety
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parseJsonArray(diet.benefits).map(
                  (benefit: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-green-50 rounded-lg"
                    >
                      <FaCheck className="text-green-600 mr-3" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Przeciwwskazania
              </h3>
              <div className="space-y-2">
                {parseJsonArray(diet.contraindications).map(
                  (contraindication: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-red-50 rounded-lg"
                    >
                      <FaExclamationTriangle className="text-red-600 mr-3 mt-1" />
                      <span className="text-gray-700">{contraindication}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Wskazówki przygotowania
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parseJsonArray(diet.preparationTips).map(
                  (tip: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-blue-50 rounded-lg"
                    >
                      <FaLightbulb className="text-blue-600 mr-3 mt-1" />
                      <span className="text-gray-700">{tip}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        );

      case "faq":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Często zadawane pytania
              </h3>
              <div className="space-y-4">
                {diet.faq.map((faq: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-800">
                      {faq.question}
                    </h4>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Śledzenie postępów
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{diet.progressTracking}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Badania naukowe
              </h3>
              <div className="space-y-3">
                {diet.scientificReferences.map(
                  (reference: string, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm">{reference}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-black">
                Badania kliniczne
              </h3>
              <div className="space-y-3">
                {diet.clinicalStudies.map((study: string, index: number) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm">{study}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{diet.title}</h2>
                  <p className="text-gray-300 mt-1 text-sm">
                    {diet.shortDescription}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                      {diet.difficulty}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 flex-shrink-0">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-gray-800 border-b-2 border-gray-800"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-800">
                      {diet.price} PLN
                    </div>
                    <div className="text-xs text-gray-500">
                      Cena jednorazowa
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-medium text-gray-800">
                      {diet.difficulty}
                    </div>
                    <div className="text-xs text-gray-500">
                      Poziom trudności
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center sm:items-end space-y-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FaCheck className="text-green-500 text-xs" />
                    <span>Bezpieczna płatność</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <FaCheck className="text-green-500 text-xs" />
                    <span>Natychmiastowy dostęp</span>
                  </div>
                  <PurchaseButton
                    item={{
                      id: diet.id,
                      title: diet.title,
                      price: diet.price,
                      type: "diet",
                      data: {
                        duration: diet.duration,
                        difficulty: diet.difficulty,
                        calories: diet.calories,
                        meals: diet.meals,
                        category: diet.category,
                        image: diet.image,
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
                      },
                    }}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm text-sm"
                  >
                    <FaShoppingCart className="text-xs" />
                    Kup teraz
                  </PurchaseButton>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

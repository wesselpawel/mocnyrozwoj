"use client";

import { useState } from "react";
import {
  FaMagic,
  FaExpand,
  FaUserMd,
  FaChartLine,
  FaBook,
  FaComments,
  FaStar,
} from "react-icons/fa";

interface AIGenerationSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  generating: boolean;
  handleGenerateDiet: () => void;
  onGenerateDetailed?: (section: string) => void;
}

export default function AIGenerationSection({
  topic,
  setTopic,
  generating,
  handleGenerateDiet,
  onGenerateDetailed,
}: AIGenerationSectionProps) {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [isGeneratingDetailed, setIsGeneratingDetailed] = useState(false);

  const detailedSections = [
    {
      id: "nutritionist",
      name: "Profil dietetyka",
      icon: FaUserMd,
      description: "Generuj profesjonalne kwalifikacje i bio dietetyka",
    },
    {
      id: "benefits",
      name: "Korzyści zdrowotne",
      icon: FaChartLine,
      description: "Szczegółowe korzyści i przeciwwskazania",
    },
    {
      id: "mealPlan",
      name: "Struktura planu",
      icon: FaBook,
      description: "Struktura posiłków i lista zakupów",
    },
    {
      id: "scientific",
      name: "Podłoże naukowe",
      icon: FaStar,
      description: "Badania kliniczne i odniesienia naukowe",
    },
    {
      id: "testimonials",
      name: "Świadectwa i FAQ",
      icon: FaComments,
      description: "Historie sukcesu i często zadawane pytania",
    },
  ];

  const handleGenerateDetailed = async (sectionId: string) => {
    if (!topic.trim()) {
      alert("Najpierw wprowadź temat diety");
      return;
    }

    setIsGeneratingDetailed(true);
    setSelectedSection(sectionId);

    try {
      if (onGenerateDetailed) {
        await onGenerateDetailed(sectionId);
      }
    } catch {
    } finally {
      setIsGeneratingDetailed(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaMagic className="mr-2 text-green-600" />
        Generowanie AI - Profesjonalna Dieta
      </h2>

      {/* Basic Generation */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Wprowadź temat diety (np. 'dieta śródziemnomorska', 'dieta ketogeniczna', 'dieta wegetariańska')"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
        />
        <button
          onClick={handleGenerateDiet}
          disabled={generating || !topic.trim()}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generowanie...</span>
            </>
          ) : (
            <>
              <FaMagic />
              <span>Wygeneruj podstawową dietę</span>
            </>
          )}
        </button>
      </div>

      {/* Detailed Generation Sections */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <FaExpand className="mr-2 text-blue-600" />
          Rozszerz dietę o szczegółowe sekcje
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detailedSections.map((section) => {
            const IconComponent = section.icon;
            const isSelected = selectedSection === section.id;
            const isGenerating = isGeneratingDetailed && isSelected;

            return (
              <div
                key={section.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() => handleGenerateDetailed(section.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className="mr-2 text-blue-600" />
                    <span className="font-medium text-gray-800">
                      {section.name}
                    </span>
                  </div>
                  {isGenerating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Dieta:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>Podstawowa dieta:</strong> Generuje kompletny plan z
            podstawowymi informacjami
          </li>
          <li>
            • <strong>Szczegółowe sekcje:</strong> Rozszerz dietę o
            profesjonalne elementy
          </li>
          <li>
            • <strong>Ewolucja:</strong> Każda sekcja dodaje więcej szczegółów i
            wiarygodności
          </li>
          <li>
            • <strong>Produkt gotowy do sprzedaży:</strong> Wszystkie elementy
            tworzą profesjonalny plan dietetyczny
          </li>
        </ul>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUpload,
  FaSave,
  FaTimes,
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
  FaCheckCircle,
  FaMagic,
  FaSpinner,
  FaLightbulb,
} from "react-icons/fa";
import { Diet, IQuestion, ITestimonial, IBeforeAfterStory } from "@/types";
import { dietService } from "@/lib/dietService";

export default function AddNewDietPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [generatedDiet, setGeneratedDiet] = useState<Partial<Diet> | null>(
    null
  );

  const [dietData, setDietData] = useState<Partial<Diet>>({
    title: "",
    shortDescription: "",
    description: "",
    duration: "",
    difficulty: "Łatwy",
    rating: 0,
    followers: 0,
    price: 0,
    originalPrice: 0,
    image: "",
    category: "",
    meals: 0,
    calories: 0,
    isPopular: false,
    isNew: false,
    pdfFile: "",
    tags: [],
    questions: [],

    // Professional dietetics fields
    nutritionistName: "",
    nutritionistCredentials: "",
    nutritionistBio: "",

    // Detailed diet information
    dietOverview: "",
    benefits: [],
    contraindications: [],
    targetAudience: [],
    mealPlanStructure: "",
    shoppingList: [],
    preparationTips: [],
    progressTracking: "",
    maintenancePhase: "",

    // Scientific backing
    scientificReferences: [],
    clinicalStudies: [],

    // Success metrics
    averageWeightLoss: "",
    averageTimeToResults: "",
    successRate: "",

    // Additional content
    faq: [],
    testimonials: [],
    beforeAfterStories: [],
  });

  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const categories = [
    "Odchudzanie",
    "Przybieranie na wadze",
    "Mięśnie",
    "Zdrowie",
    "Wegetariańska",
    "Wegańska",
    "Bezglutenowa",
    "Sportowa",
  ];

  const difficulties = ["Łatwy", "Średni", "Trudny"];

  const handleInputChange = (field: keyof Diet, value: Diet[keyof Diet]) => {
    setDietData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrorMessage("Plik jest za duży. Maksymalny rozmiar to 5MB.");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Plik musi być obrazem.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrorMessage("Plik PDF jest za duży. Maksymalny rozmiar to 10MB.");
        return;
      }

      if (file.type !== "application/pdf") {
        setErrorMessage("Plik musi być w formacie PDF.");
        return;
      }

      setUploadedPdf(file);
      setErrorMessage("");
    }
  };

  const handleGenerateDiet = async () => {
    if (!topic.trim()) {
      setErrorMessage("Proszę wprowadzić temat diety");
      return;
    }

    setGenerating(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const generated = await dietService.generateDiet(topic);

      // Parse the generated data
      const parsedDiet = {
        ...generated,
        // The data is already in the correct format from the API
        // No need for additional parsing
      };

      setDietData(parsedDiet);
      setGeneratedDiet(parsedDiet);
      setSuccessMessage(
        "Dieta została wygenerowana pomyślnie! Możesz teraz dodać zdjęcie i plik PDF, a następnie zapisać."
      );
    } catch {
      setErrorMessage("Błąd podczas generowania diety. Spróbuj ponownie.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!generatedDiet) {
      setErrorMessage("Proszę najpierw wygenerować dietę");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      let imageUrl = dietData.image || "";
      let pdfUrl = dietData.pdfFile || "";

      // Upload image if provided
      if (previewImage && !imageUrl.startsWith("http")) {
        const imageFile = await fetch(previewImage).then((r) => r.blob());
        const imageFileObj = new File([imageFile], "diet-image.jpg", {
          type: "image/jpeg",
        });
        imageUrl = await dietService.uploadDietImage(imageFileObj);
      }

      // Upload PDF if provided
      if (uploadedPdf) {
        pdfUrl = await dietService.uploadDietPdf(uploadedPdf);
      }

      // Prepare diet data for database
      const dietDataForDb = {
        ...dietData,
        image: imageUrl,
        pdfFile: pdfUrl,
      };

      // Save to database
      await dietService.addDiet(
        dietDataForDb as Omit<Diet, "id" | "createdAt" | "updatedAt">
      );

      setSuccessMessage("Dieta została pomyślnie dodana!");
      setTimeout(() => {
        router.push("/admin/diet");
      }, 2000);
    } catch {
      setErrorMessage("Wystąpił błąd podczas dodawania diety");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dodaj nową dietę
        </h1>
        <p className="text-gray-600">
          Wprowadź temat diety, a AI wygeneruje kompleksowy plan dietetyczny
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex items-center">
          <FaCheckCircle className="mr-2" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* AI Generation Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <FaMagic className="mr-2 text-blue-500" />
            Generowanie diety AI
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temat diety *
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="np. Dieta śródziemnomorska, Dieta ketogeniczna, Dieta wegetariańska..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={generating}
              />
              <button
                type="button"
                onClick={handleGenerateDiet}
                disabled={generating || !topic.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {generating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Generowanie...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-2" />
                    Generuj dietę
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              AI wygeneruje kompleksowy plan dietetyczny z wszystkimi
              szczegółami
            </p>
          </div>
        </div>

        {/* Generated Diet Preview */}
        {generatedDiet && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Wygenerowana dieta
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tytuł
                </label>
                <input
                  type="text"
                  value={dietData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria
                </label>
                <input
                  type="text"
                  value={dietData.category || ""}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena (PLN)
                </label>
                <input
                  type="number"
                  value={dietData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cena oryginalna (PLN)
                </label>
                <input
                  type="number"
                  value={dietData.originalPrice || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "originalPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Krótki opis
              </label>
              <textarea
                value={dietData.shortDescription || ""}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pełny opis
              </label>
              <textarea
                value={dietData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Additional fields from AI generation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Czas trwania
                </label>
                <input
                  type="text"
                  value={dietData.duration || ""}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poziom trudności
                </label>
                <select
                  value={dietData.difficulty || "Łatwy"}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liczba posiłków
                </label>
                <input
                  type="number"
                  value={dietData.meals || ""}
                  onChange={(e) =>
                    handleInputChange("meals", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalorie
                </label>
                <input
                  type="number"
                  value={dietData.calories || ""}
                  onChange={(e) =>
                    handleInputChange("calories", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {/* Professional Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Informacje o dietetyku
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imię i nazwisko dietetyka
                  </label>
                  <input
                    type="text"
                    value={dietData.nutritionistName || ""}
                    onChange={(e) =>
                      handleInputChange("nutritionistName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kwalifikacje
                  </label>
                  <input
                    type="text"
                    value={dietData.nutritionistCredentials || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "nutritionistCredentials",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biografia dietetyka
                </label>
                <textarea
                  value={dietData.nutritionistBio || ""}
                  onChange={(e) =>
                    handleInputChange("nutritionistBio", e.target.value)
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Metryki sukcesu
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Średnia utrata wagi
                  </label>
                  <input
                    type="text"
                    value={dietData.averageWeightLoss || ""}
                    onChange={(e) =>
                      handleInputChange("averageWeightLoss", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Czas do pierwszych rezultatów
                  </label>
                  <input
                    type="text"
                    value={dietData.averageTimeToResults || ""}
                    onChange={(e) =>
                      handleInputChange("averageTimeToResults", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wskaźnik sukcesu
                  </label>
                  <input
                    type="text"
                    value={dietData.successRate || ""}
                    onChange={(e) =>
                      handleInputChange("successRate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Tags Display */}
            {dietData.tags && dietData.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Tagi
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dietData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits and Contraindications */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {dietData.benefits && dietData.benefits.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Korzyści
                  </h3>
                  <ul className="space-y-2">
                    {dietData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {dietData.contraindications &&
                dietData.contraindications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      Przeciwwskazania
                    </h3>
                    <ul className="space-y-2">
                      {dietData.contraindications.map(
                        (contraindication, index) => (
                          <li key={index} className="flex items-start">
                            <FaExclamationTriangle className="text-red-500 mr-2" />
                            <span className="text-gray-700">
                              {contraindication}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            {/* Target Audience */}
            {dietData.targetAudience && dietData.targetAudience.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Grupa docelowa
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dietData.targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Shopping List */}
            {dietData.shoppingList && dietData.shoppingList.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Lista zakupów
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dietData.shoppingList.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preparation Tips */}
            {dietData.preparationTips &&
              dietData.preparationTips.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Wskazówki przygotowania
                  </h3>
                  <div className="space-y-2">
                    {dietData.preparationTips.map((tip, index) => (
                      <div key={index} className="flex items-start">
                        <FaLightbulb className="text-yellow-500 mr-2" />
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* FAQ Preview */}
            {dietData.questions && dietData.questions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Często zadawane pytania
                </h3>
                <div className="space-y-4">
                  {dietData.questions.slice(0, 3).map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-gray-800 mb-2">
                        {faq.question}
                      </h4>
                      <div className="text-gray-600 text-sm">
                        {faq.answers.map((answer, i) => (
                          <p key={i}>{answer}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                  {dietData.questions.length > 3 && (
                    <p className="text-gray-500 text-sm">
                      + {dietData.questions.length - 3} więcej pytań
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Testimonials Preview */}
            {dietData.testimonials && dietData.testimonials.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Opinie klientów
                </h3>
                <div className="space-y-4">
                  {dietData.testimonials
                    .slice(0, 2)
                    .map((testimonial, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-gray-800">
                            {typeof testimonial === "object" && testimonial.name
                              ? testimonial.name
                              : `Klient ${index + 1}`}
                          </span>
                          <span className="text-green-600 font-medium">
                            {typeof testimonial === "object" &&
                            testimonial.weightLoss
                              ? testimonial.weightLoss
                              : "Pozytywny wynik"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {typeof testimonial === "object" && testimonial.review
                            ? testimonial.review
                            : typeof testimonial === "string"
                            ? testimonial
                            : "Świetna dieta!"}
                        </p>
                      </div>
                    ))}
                  {dietData.testimonials.length > 2 && (
                    <p className="text-gray-500 text-sm">
                      + {dietData.testimonials.length - 2} więcej opinii
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Before/After Stories */}
            {dietData.beforeAfterStories &&
              dietData.beforeAfterStories.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Historie transformacji
                  </h3>
                  <div className="space-y-4">
                    {dietData.beforeAfterStories
                      .slice(0, 2)
                      .map((story, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-gray-800">
                              {typeof story === "object" && story.name
                                ? story.name
                                : `Historia ${index + 1}`}
                            </span>
                            <div className="text-right">
                              <span className="text-red-500 text-sm">
                                Przed:{" "}
                                {typeof story === "object" && story.beforeWeight
                                  ? story.beforeWeight
                                  : "N/A"}
                              </span>
                              <br />
                              <span className="text-green-500 text-sm">
                                Po:{" "}
                                {typeof story === "object" && story.afterWeight
                                  ? story.afterWeight
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {typeof story === "object" && story.story
                              ? story.story
                              : typeof story === "string"
                              ? story
                              : "Inspirująca historia transformacji"}
                          </p>
                        </div>
                      ))}
                    {dietData.beforeAfterStories.length > 2 && (
                      <p className="text-gray-500 text-sm">
                        + {dietData.beforeAfterStories.length - 2} więcej
                        historii
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Media Upload */}
        {generatedDiet && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Media (opcjonalne)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zdjęcie diety
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plik PDF
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {uploadedPdf && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Plik PDF wybrany: {uploadedPdf.name}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {generatedDiet && (
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/diet")}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Zapisz dietę
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FaUpload,
  FaSave,
  FaTimes,
  FaEye,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Diet, IQuestion } from "@/types";
import { dietService } from "@/lib/dietService";
import AIGenerationSection from "../../add/components/AIGenerationSection";

export default function EditDietPage() {
  const router = useRouter();
  const params = useParams();
  const dietId = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");

  const [dietData, setDietData] = useState<Partial<Diet>>({
    title: "",
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
  });

  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [newTag, setNewTag] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState<string[]>([""]);

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

  useEffect(() => {
    loadDietData();
  }, [dietId]);

  const loadDietData = async () => {
    try {
      setIsLoadingData(true);
      const diet = await dietService.getDietById(dietId);
      if (diet) {
        setDietData(diet);
        if (diet.image) {
          setPreviewImage(diet.image);
        }
      } else {
        setErrorMessage("Dieta nie została znaleziona");
      }
    } catch {
      setErrorMessage("Błąd podczas ładowania danych diety");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleInputChange = (field: keyof Diet, value: Diet[keyof Diet]) => {
    setDietData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setDietData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setUploadedPdf(file);
      setDietData((prev) => ({ ...prev, pdfFile: file.name }));
    } else {
      setErrorMessage("Proszę wybrać plik PDF");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !dietData.tags?.includes(newTag.trim())) {
      setDietData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDietData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleAddAnswer = () => {
    setNewAnswers([...newAnswers, ""]);
  };

  const handleRemoveAnswer = (index: number) => {
    setNewAnswers(newAnswers.filter((_, i) => i !== index));
  };

  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...newAnswers];
    updatedAnswers[index] = value;
    setNewAnswers(updatedAnswers);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswers.some((answer) => answer.trim())) {
      const question: IQuestion = {
        question: newQuestion.trim(),
        answers: newAnswers.filter((answer) => answer.trim()),
      };

      setDietData((prev) => ({
        ...prev,
        questions: [...(prev.questions || []), question],
      }));

      setNewQuestion("");
      setNewAnswers([""]);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setDietData((prev) => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleGenerateDiet = async () => {
    if (!topic.trim()) {
      setErrorMessage("Proszę wprowadzić temat diety");
      return;
    }

    try {
      setGenerating(true);
      setErrorMessage("");
      const generatedDiet = await dietService.generateDiet(topic);

      // Update diet data with generated content
      setDietData(generatedDiet);
      setTopic("");
      setSuccessMessage("Dieta została wygenerowana pomyślnie!");
    } catch {
      setErrorMessage("Błąd podczas generowania diety");
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate required fields
      if (!dietData.title || !dietData.description || !dietData.category) {
        setErrorMessage("Proszę wypełnić wszystkie wymagane pola");
        setIsLoading(false);
        return;
      }

      let imageUrl = dietData.image || "";
      let pdfUrl = dietData.pdfFile || "";

      // Upload image if provided
      if (previewImage && imageUrl && !imageUrl.startsWith("http")) {
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
        title: dietData.title || "",
        description: dietData.description || "",
        duration: dietData.duration || "",
        difficulty: dietData.difficulty || "Łatwy",
        rating: dietData.rating || 0,
        followers: dietData.followers || 0,
        price: dietData.price || 0,
        originalPrice: dietData.originalPrice || 0,
        image: imageUrl,
        category: dietData.category || "",
        meals: dietData.meals || 0,
        calories: dietData.calories || 0,
        isPopular: dietData.isPopular || false,
        isNew: dietData.isNew || false,
        pdfFile: pdfUrl,
        tags: dietData.tags || [],
        questions: dietData.questions || [],
      };

      // Update in database
      await dietService.updateDiet(dietId, dietDataForDb);

      setSuccessMessage("Dieta została pomyślnie zaktualizowana!");
      setTimeout(() => {
        router.push("/admin/diet");
      }, 2000);
    } catch {
      setErrorMessage("Wystąpił błąd podczas aktualizacji diety");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="p-6 lg:p-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edytuj dietę</h1>
        <p className="text-gray-600">
          Zmodyfikuj plan dietetyczny i jego zawartość
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* AI Generation Section */}
        <AIGenerationSection
          topic={topic}
          setTopic={setTopic}
          generating={generating}
          handleGenerateDiet={handleGenerateDiet}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Podstawowe informacje
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tytuł diety *
                  </label>
                  <input
                    type="text"
                    value={dietData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="np. Plan odchudzający 30 dni"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis diety *
                  </label>
                  <textarea
                    value={dietData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Opisz szczegółowo plan dietetyczny i jego korzyści"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoria *
                  </label>
                  <select
                    value={dietData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  >
                    <option value="">Wybierz kategorię</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Poziom trudności
                    </label>
                    <select
                      value={dietData.difficulty}
                      onChange={(e) =>
                        handleInputChange("difficulty", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                      Czas trwania
                    </label>
                    <input
                      type="text"
                      value={dietData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="np. 30 dni"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Informacje żywieniowe
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liczba posiłków
                  </label>
                  <input
                    type="number"
                    value={dietData.meals}
                    onChange={(e) =>
                      handleInputChange("meals", Number(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="5"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kalorie dziennie
                  </label>
                  <input
                    type="number"
                    value={dietData.calories}
                    onChange={(e) =>
                      handleInputChange("calories", Number(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="2000"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Cennik</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena (PLN) *
                  </label>
                  <input
                    type="number"
                    value={dietData.price}
                    onChange={(e) =>
                      handleInputChange("price", Number(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="99"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena oryginalna (PLN)
                  </label>
                  <input
                    type="number"
                    value={dietData.originalPrice}
                    onChange={(e) =>
                      handleInputChange("originalPrice", Number(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="149"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Media and Settings */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Zdjęcie diety
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wybierz zdjęcie
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage("");
                        setDietData((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Plik PDF diety
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wybierz plik PDF
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                {uploadedPdf && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaEye className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium">
                        {uploadedPdf.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedPdf(null);
                        setDietData((prev) => ({ ...prev, pdfFile: "" }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tagi</h2>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Dodaj tag"
                    className="flex-1 p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    <FaPlus />
                  </button>
                </div>

                {dietData.tags && dietData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dietData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <FaTimes />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Pytania i odpowiedzi
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pytanie
                  </label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Dodaj pytanie"
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Odpowiedzi
                  </label>
                  {newAnswers.map((answer, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                        placeholder={`Odpowiedź ${index + 1}`}
                        className="flex-1 p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      {newAnswers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAnswer(index)}
                          className="px-3 py-3 text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddAnswer}
                    className="text-purple-600 hover:text-purple-800 text-sm"
                  >
                    + Dodaj odpowiedź
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Dodaj pytanie
                </button>

                {dietData.questions && dietData.questions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-700">
                      Dodane pytania:
                    </h4>
                    {dietData.questions.map((question, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <strong className="text-sm">
                            {question.question}
                          </strong>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                        <ul className="text-sm text-gray-600">
                          {question?.answers?.map((answer, answerIndex) => (
                            <li key={answerIndex}>• {answer}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Dodatkowe ustawienia
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ocena (0-5)
                    </label>
                    <input
                      type="number"
                      value={dietData.rating}
                      onChange={(e) =>
                        handleInputChange("rating", Number(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="4.8"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liczba obserwujących
                    </label>
                    <input
                      type="number"
                      value={dietData.followers}
                      onChange={(e) =>
                        handleInputChange("followers", Number(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="1247"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dietData.isPopular}
                      onChange={(e) =>
                        handleInputChange("isPopular", e.target.checked)
                      }
                      className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Oznacz jako popularną
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dietData.isNew}
                      onChange={(e) =>
                        handleInputChange("isNew", e.target.checked)
                      }
                      className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Oznacz jako nową
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/diet")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-md text-white font-medium transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Zapisywanie...
              </div>
            ) : (
              <div className="flex items-center">
                <FaSave className="mr-2" />
                Zaktualizuj dietę
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

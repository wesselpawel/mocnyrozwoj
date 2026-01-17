"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUpload, FaSave, FaTimes, FaEye } from "react-icons/fa";
import { Course } from "@/types";
import { coursesService } from "@/lib/coursesService";

export default function AddCoursePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    description: "",
    duration: "",
    level: "Początkujący",
    rating: 0,
    students: 0,
    price: 0,
    originalPrice: 0,
    image: "",
    category: "",
    lessons: 0,
    isPopular: false,
    isNew: false,
    pdfFile: "",
  });

  const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  const categories = [
    "Rozwój osobisty",
    "Psychologia",
    "Produktywność",
    "Komunikacja",
    "Motywacja",
    "Liderstwo",
    "Sprzedaż",
    "Marketing",
  ];

  const levels = ["Początkujący", "Średniozaawansowany", "Zaawansowany"];

  const handleInputChange = (field: keyof Course, value: any) => {
    setCourseData((prev) => ({
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
        setCourseData((prev) => ({
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
      // In a real app, you would upload this to Firebase Storage
      // For now, we'll just store the file name
      setCourseData((prev) => ({ ...prev, pdfFile: file.name }));
    } else {
      setErrorMessage("Proszę wybrać plik PDF");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate required fields
      if (
        !courseData.title ||
        !courseData.description ||
        !courseData.category
      ) {
        setErrorMessage("Proszę wypełnić wszystkie wymagane pola");
        setIsLoading(false);
        return;
      }

      let imageUrl = courseData.image || "";
      let pdfUrl = courseData.pdfFile || "";

      // Upload image if provided
      if (previewImage && imageUrl && !imageUrl.startsWith("http")) {
        const imageFile = await fetch(previewImage).then((r) => r.blob());
        const imageFileObj = new File([imageFile], "course-image.jpg", {
          type: "image/jpeg",
        });
        imageUrl = await coursesService.uploadCourseImage(imageFileObj);
      }

      // Upload PDF if provided
      if (uploadedPdf) {
        pdfUrl = await coursesService.uploadCoursePdf(uploadedPdf);
      }

      // Prepare course data for database
      const courseDataForDb = {
        title: courseData.title || "",
        description: courseData.description || "",
        duration: courseData.duration || "",
        level: courseData.level || "Początkujący",
        rating: courseData.rating || 0,
        students: courseData.students || 0,
        price: courseData.price || 0,
        originalPrice: courseData.originalPrice || 0,
        image: imageUrl,
        category: courseData.category || "",
        lessons: courseData.lessons || 0,
        isPopular: courseData.isPopular || false,
        isNew: courseData.isNew || false,
        pdfFile: pdfUrl,
      };

      // Save to database
      await coursesService.addCourse(courseDataForDb);

      setSuccessMessage("Kurs został pomyślnie dodany!");
      setTimeout(() => {
        router.push("/admin/courses/list");
      }, 2000);
    } catch (error) {
      setErrorMessage("Wystąpił błąd podczas dodawania kursu");
      console.error("Error adding course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Dodaj nowy kurs
        </h1>
        <p className="text-gray-600">
          Utwórz nowy kurs rozwojowy z wszystkimi niezbędnymi informacjami
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
                    Tytuł kursu *
                  </label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="np. Podstawy rozwoju osobistego"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Opis kursu *
                  </label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Opisz szczegółowo czego nauczy się uczestnik kursu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategoria *
                  </label>
                  <select
                    value={courseData.category}
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
                      value={courseData.level}
                      onChange={(e) =>
                        handleInputChange("level", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>
                          {level}
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
                      value={courseData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="np. 4 godziny"
                    />
                  </div>
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
                    value={courseData.price}
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
                    value={courseData.originalPrice}
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
                Zdjęcie kursu
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
                        setCourseData((prev) => ({ ...prev, image: "" }));
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
                Plik PDF kursu
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
                        setCourseData((prev) => ({ ...prev, pdfFile: "" }));
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
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
                      Liczba lekcji
                    </label>
                    <input
                      type="number"
                      value={courseData.lessons}
                      onChange={(e) =>
                        handleInputChange("lessons", Number(e.target.value))
                      }
                      className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                      placeholder="12"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ocena (0-5)
                    </label>
                    <input
                      type="number"
                      value={courseData.rating}
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liczba studentów
                  </label>
                  <input
                    type="number"
                    value={courseData.students}
                    onChange={(e) =>
                      handleInputChange("students", Number(e.target.value))
                    }
                    className="w-full p-3 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="1247"
                    min="0"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={courseData.isPopular}
                      onChange={(e) =>
                        handleInputChange("isPopular", e.target.checked)
                      }
                      className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Oznacz jako popularny
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={courseData.isNew}
                      onChange={(e) =>
                        handleInputChange("isNew", e.target.checked)
                      }
                      className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Oznacz jako nowy
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
            onClick={() => router.push("/admin/courses/list")}
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
                Zapisz kurs
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch } from "react-icons/fa";
import { Course } from "@/types";
import { coursesService } from "@/lib/coursesService";

export default function CoursesListPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Wszystkie");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Fetch courses from database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await coursesService.getAllCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const categories = [
    "Wszystkie",
    "Rozwój osobisty",
    "Psychologia",
    "Produktywność",
    "Komunikacja",
    "Motywacja",
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Wszystkie" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (courseId: string) => {
    try {
      await coursesService.deleteCourse(courseId);
      setCourses(courses.filter((course) => course.id !== courseId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Początkujący":
        return "bg-green-100 text-green-800";
      case "Średniozaawansowany":
        return "bg-yellow-100 text-yellow-800";
      case "Zaawansowany":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Wszystkie kursy</h1>
          <button
            onClick={() => router.push("/admin/courses/add")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Dodaj kurs
          </button>
        </div>
        <p className="text-gray-600">
          Zarządzaj wszystkimi kursami rozwojowymi
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Szukaj
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Szukaj kursów..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <span className="text-sm text-gray-600">
              Znaleziono {filteredCourses.length} kursów
            </span>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Brak kursów
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCategory !== "Wszystkie"
              ? "Nie znaleziono kursów spełniających kryteria wyszukiwania."
              : "Nie ma jeszcze żadnych kursów. Dodaj pierwszy kurs!"}
          </p>
          {!searchTerm && selectedCategory === "Wszystkie" && (
            <button
              onClick={() => router.push("/admin/courses/add")}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Dodaj pierwszy kurs
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poziom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-lg font-bold text-purple-600">
                            {course.title.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.description.substring(0, 50)}...
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {course.duration} • {course.lessons} lekcji
                            </span>
                            {course.isPopular && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Popularny
                              </span>
                            )}
                            {course.isNew && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Nowy
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                          course.level
                        )}`}
                      >
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.price} PLN
                      </div>
                      {course.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">
                          {course.originalPrice} PLN
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-sm font-medium text-gray-500">
                            {course.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({course.students} studentów)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/admin/courses/edit/${course.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title="Edytuj kurs"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/admin/courses/view/${course.id}`)
                          }
                          className="text-green-600 hover:text-green-900"
                          title="Podgląd kursu"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Usuń kurs"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Potwierdź usunięcie
            </h3>
            <p className="text-gray-600 mb-6">
              Czy na pewno chcesz usunąć ten kurs? Ta operacja nie może być
              cofnięta.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

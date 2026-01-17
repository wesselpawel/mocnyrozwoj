"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendar, FaFire, FaUtensils } from "react-icons/fa";
import { Diet } from "@/types";
import { dietService } from "@/lib/dietService";

export default function AdminDietPage() {
  const [diets, setDiets] = useState<Diet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDiets();
  }, []);

  const loadDiets = async () => {
    try {
      setIsLoading(true);
      const dietsData = await dietService.getAllDiets();
      setDiets(dietsData);
    } catch (err) {
      setError("Błąd podczas ładowania diet");
      console.error("Error loading diets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tę dietę?")) {
      try {
        await dietService.deleteDiet(id);
        setDiets(diets.filter(diet => diet.id !== id));
      } catch (err) {
        setError("Błąd podczas usuwania diety");
        console.error("Error deleting diet:", err);
      }
    }
  };

  if (isLoading) {
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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Zarządzanie dietami</h1>
          <Link
            href="/admin/diet/add"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Dodaj dietę
          </Link>
        </div>
        <p className="text-gray-600">
          Zarządzaj planami dietetycznymi i ich zawartością
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {diets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4 flex justify-center">
            <FaUtensils />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Brak diet
          </h3>
          <p className="text-gray-500 mb-6">
            Nie ma jeszcze żadnych diet. Dodaj pierwszą dietę!
          </p>
          <Link
            href="/admin/diet/add"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors inline-flex items-center"
          >
            <FaPlus className="mr-2" />
            Dodaj pierwszą dietę
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diets.map((diet) => (
            <div
              key={diet.id}
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
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {diet.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaFire />
                    {diet.calories} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUtensils />
                    {diet.meals} posiłków
                  </span>
                </div>
                
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
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-purple-600">
                    {diet.price} PLN
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={`/admin/diet/edit/${diet.id}`}
                      className="text-blue-500 hover:text-blue-700 p-2"
                      title="Edytuj"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(diet.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Usuń"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { dietService } from "@/lib/dietService";
import { Diet } from "@/types";
import DietDetailContent from "@/components/DietDetailContent";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [diet, setDiet] = useState<Diet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiet = async () => {
      if (!slug) return;
      try {
        const data = await dietService.getDietBySlug(slug);
        setDiet(data);
      } catch {
        setDiet(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDiet();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (!diet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Produkt nie znaleziony
        </h1>
        <p className="text-gray-600 mb-6">
          Nie udało się znaleźć tego produktu. Sprawdź adres lub wróć do listy.
        </p>
        <Link
          href="/#dieta"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Wróć do produktów
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <DietDetailContent diet={diet} variant="page" />
    </div>
  );
}

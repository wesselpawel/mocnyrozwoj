"use client";

import { useEffect, useState } from "react";
import AdminGenerateDietButton from "./AdminGenerateDietButton";
import ProgrammaticDietContent from "./ProgrammaticDietContent";
import type { ProgrammaticDietContent as DietContentType } from "@/types/programmaticDiet";

type Props = {
  slug: string;
  calories: number;
  goal: "mass" | "reduction" | "maintenance";
  mealCount: number;
};

export default function ProgrammaticDietWrapper({
  slug,
  calories,
  goal,
  mealCount,
}: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [dietContent, setDietContent] = useState<DietContentType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchContent = async () => {
      try {
        const [adminRes, contentRes] = await Promise.all([
          fetch("/api/admin/login", { method: "GET" }),
          fetch(`/api/admin/generate-programmatic-diet?slug=${encodeURIComponent(slug)}`),
        ]);

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setIsAdmin(adminData.isLoggedIn === true);
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          if (contentData.content) {
            setDietContent(contentData.content);
          }
        }
      } catch {
        // Silently fail - not critical
      } finally {
        setIsLoaded(true);
      }
    };

    checkAdminAndFetchContent();
  }, [slug]);

  // Always render the same structure on server and client
  // Content is conditionally shown based on loaded state
  return (
    <div>
      {isLoaded && isAdmin && !dietContent && (
        <AdminGenerateDietButton
          slug={slug}
          calories={calories}
          goal={goal}
          mealCount={mealCount}
          onGenerated={setDietContent}
        />
      )}
      
      {isLoaded && isAdmin && dietContent && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm flex items-center gap-2">
            <span>✓</span>
            Przepisy zostały już wygenerowane
          </p>
        </div>
      )}

      {isLoaded && dietContent && <ProgrammaticDietContent content={dietContent} />}
    </div>
  );
}

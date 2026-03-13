"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { blogService, BlogPost, DietDayPlan, DietGenerationInput } from "@/lib/blogService";
import PageHeader from "../../new/components/PageHeader";
import AIGenerationSection from "../../new/components/AIGenerationSection";
import BasicInformationSection from "../../new/components/BasicInformationSection";
import SEOInformationSection from "../../new/components/SEOInformationSection";
import ContentSectionsManager from "../../new/components/ContentSectionsManager";
import FormActions from "../../new/components/FormActions";
import DietDayGeneratorSection from "../../new/components/DietDayGeneratorSection";
import { ContentSection } from "../../new/types";
import {
  createSectionsFromPost,
  mapSectionsToLegacyContentFields,
} from "../../new/contentFields";

const CATEGORIES_WITH_DIET_DAY_GENERATION = new Set([
  "Diety",
  "Przykładowe dni diety",
  "Konkretny cel dietetyczny",
]);

const DEFAULT_DIET_INPUT: DietGenerationInput = {
  calories: 2000,
  mealsPerDay: 3,
  mealVariants: [3, 4, 5],
  dietName: "",
  dietGoal: "",
  unwantedProducts: "",
  gender: "inna",
};

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingDietDays, setGeneratingDietDays] = useState(false);
  const [topic, setTopic] = useState("");
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [dietGenerationInput, setDietGenerationInput] =
    useState<DietGenerationInput>(DEFAULT_DIET_INPUT);
  const [dietDays, setDietDays] = useState<DietDayPlan[]>([]);
  const [post, setPost] = useState<Partial<BlogPost>>({});
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await blogService.getBlogPostById(id);
        setPost(fetchedPost ?? {});
        setSections(createSectionsFromPost(fetchedPost));
        if (fetchedPost?.dietGenerationInput) {
          setDietGenerationInput({
            ...DEFAULT_DIET_INPUT,
            ...fetchedPost.dietGenerationInput,
          });
        }
        if (Array.isArray(fetchedPost?.dietDays)) {
          setDietDays(fetchedPost.dietDays);
        }
      } catch (error) {
        alert("Nie udało się załadować posta");
      } finally {
        setLoading(false);
        setInitialLoaded(true);
      }
    };
    if (id && !initialLoaded) fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSavePost = async () => {
    if (!post.title || !post.shortDesc || !post.url) {
      alert("Proszę wypełnić wszystkie wymagane pola");
      return;
    }
    const postData = {
      ...post,
      ...mapSectionsToLegacyContentFields(sections),
      dietGenerationInput,
      dietDays,
    };
    try {
      setLoading(true);
      await blogService.updateBlogPost(id, postData as BlogPost);
      router.push("/admin/blog");
    } catch (error) {
      alert("Błąd podczas zapisywania posta");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BlogPost, value: string) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateDietDays = async () => {
    if (!CATEGORIES_WITH_DIET_DAY_GENERATION.has(post.category || "")) {
      return;
    }

    if (!dietGenerationInput.dietName.trim() || !dietGenerationInput.dietGoal.trim()) {
      alert("Uzupełnij nazwę diety i cel diety.");
      return;
    }

    try {
      setGeneratingDietDays(true);
      const response = await fetch("/api/admin/generate-diet-days", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: post.category,
          ...dietGenerationInput,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { days?: DietDayPlan[]; error?: string }
        | null;

      if (!response.ok || !payload?.days) {
        alert(payload?.error || "Nie udało się wygenerować dni diety.");
        return;
      }

      setDietDays(payload.days);
    } catch {
      alert("Nie udało się wygenerować dni diety.");
    } finally {
      setGeneratingDietDays(false);
    }
  };

  const updateSection = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    setSections(newSections);
  };

  if (!initialLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ładowanie posta...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="!text-black min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <PageHeader />

          {/* Optional: AI Generation Section */}
          <AIGenerationSection
            topic={topic}
            setTopic={setTopic}
            generating={generating}
            handleGeneratePost={async () => {}}
          />

          {/* Post Form */}
          <form className="space-y-6">
            <BasicInformationSection
              post={post}
              handleInputChange={handleInputChange}
            />

            <SEOInformationSection
              post={post}
              handleInputChange={handleInputChange}
            />

            {CATEGORIES_WITH_DIET_DAY_GENERATION.has(post.category || "") && (
              <DietDayGeneratorSection
                value={dietGenerationInput}
                days={dietDays}
                loading={generatingDietDays}
                onChange={(updates) =>
                  setDietGenerationInput((prev) => ({ ...prev, ...updates }))
                }
                onGenerate={handleGenerateDietDays}
              />
            )}

            <ContentSectionsManager
              sections={sections}
              updateSection={updateSection}
            />

            <FormActions loading={loading} handleSavePost={handleSavePost} />
          </form>
        </div>
      </div>
    </div>
  );
}

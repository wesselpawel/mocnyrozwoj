"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blogService, BlogPost, DietDayPlan, DietGenerationInput } from "@/lib/blogService";
import { ContentSection } from "./types";
import {
  createEmptySections,
  mapSectionsToLegacyContentFields,
} from "./contentFields";
import PageHeader from "./components/PageHeader";
import AIGenerationSection from "./components/AIGenerationSection";
import BasicInformationSection from "./components/BasicInformationSection";
import SEOInformationSection from "./components/SEOInformationSection";
import ContentSectionsManager from "./components/ContentSectionsManager";
import FormActions from "./components/FormActions";
import DietDayGeneratorSection from "./components/DietDayGeneratorSection";

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

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingDietDays, setGeneratingDietDays] = useState(false);
  const [topic, setTopic] = useState("");
  const [sections, setSections] = useState<ContentSection[]>(createEmptySections());
  const [dietGenerationInput, setDietGenerationInput] =
    useState<DietGenerationInput>(DEFAULT_DIET_INPUT);
  const [dietDays, setDietDays] = useState<DietDayPlan[]>([]);
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    shortDesc: "",
    googleTitle: "",
    googleDescription: "",
    googleKeywords: "",
    url: "",
    urlLabel: "",
    category: "Diety",
    tags: "",
  });

  const [savingDraft, setSavingDraft] = useState(false);

  const handleSaveDraft = async () => {
    const draftData: Partial<BlogPost> = {
      ...post,
      ...mapSectionsToLegacyContentFields(sections),
      dietGenerationInput,
      dietDays,
    };
    try {
      setSavingDraft(true);
      await blogService.saveDraft(draftData);
      alert("Szkic zapisany.");
    } catch {
      alert("Błąd podczas zapisywania szkicu posta");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      alert("Proszę wprowadzić temat posta");
      return;
    }

    try {
      setGenerating(true);
      const generatedPost = await blogService.generateBlogPost(topic, {
        title: post.title || "",
        category: post.category || "",
        shortDesc: post.shortDesc || "",
      });
      setPost((prev) => ({ ...prev, ...generatedPost }));
      setTopic("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Błąd podczas generowania posta";
      alert(message);
    } finally {
      setGenerating(false);
    }
  };

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
      await blogService.addBlogPost(
        postData as Omit<BlogPost, "id" | "createdAt" | "updatedAt">
      );
      router.push("/admin/blog");
    } catch {
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

  return (
    <div className="!text-black min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <PageHeader />

          <AIGenerationSection
            topic={topic}
            setTopic={setTopic}
            generating={generating}
            handleGeneratePost={handleGeneratePost}
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

            <FormActions
              loading={loading}
              savingDraft={savingDraft}
              handleSavePost={handleSavePost}
              handleSaveDraft={handleSaveDraft}
            />
          </form>
        </div>
      </div>
    </div>
  );
}

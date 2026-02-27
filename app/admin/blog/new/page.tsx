"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { blogService, BlogPost } from "@/lib/blogService";
import { ContentSection } from "./types";
import PageHeader from "./components/PageHeader";
import AIGenerationSection from "./components/AIGenerationSection";
import BasicInformationSection from "./components/BasicInformationSection";
import SEOInformationSection from "./components/SEOInformationSection";
import ContentSectionsManager from "./components/ContentSectionsManager";
import FormActions from "./components/FormActions";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [sections, setSections] = useState<ContentSection[]>([
    { id: "1", title: "Treść posta", content: "" },
  ]);
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    shortDesc: "",
    googleTitle: "",
    googleDescription: "",
    googleKeywords: "",
    url: "",
    urlLabel: "",
    category: "Rozwój osobisty",
    tags: "",
  });

  const handleGeneratePost = async () => {
    if (!topic.trim()) {
      alert("Proszę wprowadzić temat posta");
      return;
    }

    try {
      setGenerating(true);
      const generatedPost = await blogService.generateBlogPost(topic);
      setPost(generatedPost);

      // Update post data with generated content (but not sections)
      setPost(generatedPost);
      setTopic("");
    } catch {
      alert("Błąd podczas generowania posta");
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePost = async () => {
    if (!post.title || !post.shortDesc || !post.url) {
      alert("Proszę wypełnić wszystkie wymagane pola");
      return;
    }

    // Convert section back to the expected format
    const postData = {
      ...post,
      text1Title: "Treść posta",
      text1Desc: sections[0]?.content || "",
      text2Title: "",
      text2Desc: "",
      text3Title: "",
      text3Desc: "",
      text4Title: "",
      text4Desc: "",
      text5Title: "",
      text5Desc: "",
      text6Title: "",
      text6Desc: "",
      text7Title: "",
      text7Desc: "",
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

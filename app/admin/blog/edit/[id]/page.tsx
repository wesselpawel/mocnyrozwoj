"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { blogService, BlogPost } from "@/lib/blogService";
import PageHeader from "../../new/components/PageHeader";
import AIGenerationSection from "../../new/components/AIGenerationSection";
import BasicInformationSection from "../../new/components/BasicInformationSection";
import SEOInformationSection from "../../new/components/SEOInformationSection";
import ContentSectionsManager from "../../new/components/ContentSectionsManager";
import FormActions from "../../new/components/FormActions";
import { ContentSection } from "../../new/types";

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [sections, setSections] = useState<ContentSection[]>([
    { id: "1", title: "Treść posta", content: "" },
  ]);
  const [post, setPost] = useState<Partial<BlogPost>>({});
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost: any = await blogService.getBlogPostById(id);
        setPost(fetchedPost);
        setSections([
          {
            id: "1",
            title: "Treść posta",
            content: fetchedPost.text1Desc || "",
          },
        ]);
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

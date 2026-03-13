import {
  addDocument,
  getDocuments,
  getDocument,
  removeDocument,
  updateDocument,
  uploadFile,
} from "@/firebase";

const COLLECTION_NAME = "blog";

export interface DietGenerationInput {
  calories: number;
  mealsPerDay: number;
  mealVariants?: number[];
  dietName: string;
  dietGoal: string;
  unwantedProducts: string;
  gender: "kobieta" | "mezczyzna" | "inna";
}

export interface DietDayMeal {
  mealNumber: number;
  mealName: string;
  time: string;
  calories: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  ingredients: string[];
  preparationSteps: string[];
}

export interface DietDayPlan {
  dayLabel: string;
  mealsPerDay: number;
  totalCalories: number;
  meals: DietDayMeal[];
  notes: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  shortDesc: string;
  googleTitle: string;
  googleDescription: string;
  googleKeywords: string;
  url: string;
  urlLabel: string;
  category: string;
  tags: string;
  primaryImage?: string;
  text1Title?: string;
  text1Desc?: string;
  text2Title?: string;
  text2Desc?: string;
  text3Title?: string;
  text3Desc?: string;
  text4Title?: string;
  text4Desc?: string;
  text5Title?: string;
  text5Desc?: string;
  text6Title?: string;
  text6Desc?: string;
  text7Title?: string;
  text7Desc?: string;
  dietGenerationInput?: DietGenerationInput;
  dietDays?: DietDayPlan[];
  createdAt: string;
  updatedAt: string;
}

export const blogService = {
  // Get all blog posts from the database
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await getDocuments(COLLECTION_NAME);
    return posts as BlogPost[];
  },

  // Get a single blog post by ID
  async getBlogPostById(id: string): Promise<BlogPost | null> {
    const post = await getDocument(COLLECTION_NAME, id);
    return post as BlogPost | null;
  },

  // Get a blog post by URL slug
  async getBlogPostByUrl(url: string): Promise<BlogPost | null> {
    const posts = await getDocuments(COLLECTION_NAME);
    const post = (posts as BlogPost[]).find((p) => p.url === url);
    return post as BlogPost | null;
  },

  // Add a new blog post
  async addBlogPost(
    postData: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const post: BlogPost = {
      ...postData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await addDocument(COLLECTION_NAME, id, post);
    return id;
  },

  // Update a blog post
  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<void> {
    const now = new Date().toISOString();
    const updateData = {
      ...updates,
      updatedAt: now,
    };

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);

    await updateDocument(keys, values, COLLECTION_NAME, id);
  },

  // Delete a blog post
  async deleteBlogPost(id: string): Promise<void> {
    await removeDocument(COLLECTION_NAME, id);
  },

  // Save a draft of a blog post
  async saveDraft(post: Partial<BlogPost>): Promise<void> {
    await addDocument(COLLECTION_NAME, Date.now().toString(), post);
  },
  async getDrafts(): Promise<Partial<BlogPost>[]> {
    const drafts = await getDocuments(COLLECTION_NAME);
    return drafts as Partial<BlogPost>[];
  },

  // Generate a new blog post using the API
  async generateBlogPost(
    topic: string,
    context?: {
      title?: string;
      category?: string;
      shortDesc?: string;
    },
  ): Promise<Omit<BlogPost, "id" | "createdAt" | "updatedAt">> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/generateBlogPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          title: context?.title || "",
          category: context?.category || "",
          shortDesc: context?.shortDesc || "",
        }),
      });

      const generatedData = await response.json();

      // Return generated data without adding to database
      return {
        title: generatedData.title || "",
        shortDesc: generatedData.shortDesc || "",
        googleTitle: generatedData.googleTitle || "",
        googleDescription: generatedData.googleDescription || "",
        googleKeywords: generatedData.googleKeywords || "",
        url: generatedData.url || "",
        urlLabel: generatedData.urlLabel || "",
        category: generatedData.category || "Diety",
        tags: generatedData.tags || "",
        text1Title: generatedData.text1Title || "Sekcja 1",
        text1Desc: generatedData.text1Desc || "",
        text2Title: generatedData.text2Title || "Sekcja 2",
        text2Desc: generatedData.text2Desc || "",
        text3Title: generatedData.text3Title || "Sekcja 3",
        text3Desc: generatedData.text3Desc || "",
        text4Title: generatedData.text4Title || "Sekcja 4",
        text4Desc: generatedData.text4Desc || "",
        text5Title: generatedData.text5Title || "Sekcja 5",
        text5Desc: generatedData.text5Desc || "",
        text6Title: generatedData.text6Title || "Sekcja 6",
        text6Desc: generatedData.text6Desc || "",
        text7Title: generatedData.text7Title || "Sekcja 7",
        text7Desc: generatedData.text7Desc || "",
      };
    } catch (error) {
      throw error;
    }
  },
};

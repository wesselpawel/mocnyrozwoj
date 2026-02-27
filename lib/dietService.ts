import {
  addDocument,
  updateDocument,
  removeDocument,
  getDocuments,
  storage,
} from "@/firebase/index";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Diet } from "@/types";
import { v4 as uuid } from "uuid";

export const dietService = {
  // Add a new diet
  async addDiet(
    dietData: Omit<Diet, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    const id = uuid();
    const now = new Date().toISOString();

    await addDocument("diets", id, {
      ...dietData,
      id,
      createdAt: now,
      updatedAt: now,
    });
  },

  // Update an existing diet
  async updateDiet(id: string, dietData: Partial<Diet>): Promise<void> {
    const now = new Date().toISOString();
    const updateData = {
      ...dietData,
      updatedAt: now,
    };

    const keys = Object.keys(updateData);
    const values = Object.values(updateData);

    await updateDocument(keys, values, "diets", id);
  },

  // Delete a diet
  async deleteDiet(id: string): Promise<void> {
    await removeDocument("diets", id);
  },

  // Get all diets
  async getAllDiets(): Promise<Diet[]> {
    const diets = await getDocuments("diets");
    return diets as Diet[];
  },

  // Get unique categories from diets
  async getDietCategories(): Promise<string[]> {
    const diets = await getDocuments("diets");
    const categories = (diets as Diet[]).map((diet) => diet.category);
    const uniqueCategories = [...new Set(categories)].filter(Boolean);
    return uniqueCategories;
  },

  // Get a single diet by ID
  async getDietById(id: string): Promise<Diet | null> {
    const diets = (await getDocuments("diets")) as Diet[];
    const diet = diets.find((d) => d.id === id);
    return diet || null;
  },

  // Upload diet image
  async uploadDietImage(file: File): Promise<string> {
    const randId = uuid();
    const imageRef = ref(storage, `diets/${randId}`);

    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);

    return url;
  },

  // Upload diet PDF
  async uploadDietPdf(file: File): Promise<string> {
    const randId = uuid();
    const pdfRef = ref(storage, `diets/pdfs/${randId}`);

    await uploadBytes(pdfRef, file);
    const url = await getDownloadURL(pdfRef);

    return url;
  },

  // Generate a new diet using the API
  async generateDiet(
    topic: string,
  ): Promise<Omit<Diet, "id" | "createdAt" | "updatedAt" | "pdfFile">> {
    try {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/generateDiet`,
      );
      url.searchParams.set("topic", topic);

      // Only add secret key in production
      if (process.env.NODE_ENV === "production" && process.env.API_SECRET_KEY) {
        url.searchParams.set("tubylytylkofigi", process.env.API_SECRET_KEY);
      }

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const generatedData = await response.json();

      // Check if the response contains the expected data structure
      if (
        !generatedData.choices ||
        !generatedData.choices[0] ||
        !generatedData.choices[0].text
      ) {
        throw new Error("Invalid response format from API");
      }

      // Parse the JSON response from the AI
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(generatedData.choices[0].text.trim());
      } catch {
        throw new Error("Failed to parse AI response");
      }

      // Convert tags array to array (it's already an array in the response)
      const tagsArray = Array.isArray(parsedResponse.tags)
        ? parsedResponse.tags
        : [];

      // Parse JSON strings to arrays/objects - handle both string and array formats
      const questions = Array.isArray(parsedResponse.questions)
        ? parsedResponse.questions
        : [];

      const benefits = Array.isArray(parsedResponse.benefits)
        ? parsedResponse.benefits
        : [];

      const contraindications = Array.isArray(parsedResponse.contraindications)
        ? parsedResponse.contraindications
        : [];

      const targetAudience = Array.isArray(parsedResponse.targetAudience)
        ? parsedResponse.targetAudience
        : [];

      const shoppingList = Array.isArray(parsedResponse.shoppingList)
        ? parsedResponse.shoppingList
        : [];

      const preparationTips = Array.isArray(parsedResponse.preparationTips)
        ? parsedResponse.preparationTips
        : [];

      const scientificReferences = Array.isArray(
        parsedResponse.scientificReferences,
      )
        ? parsedResponse.scientificReferences
        : [];

      const clinicalStudies = Array.isArray(parsedResponse.clinicalStudies)
        ? parsedResponse.clinicalStudies
        : [];

      const faq = Array.isArray(parsedResponse.faq) ? parsedResponse.faq : [];

      const testimonials = Array.isArray(parsedResponse.testimonials)
        ? parsedResponse.testimonials
        : [];

      const beforeAfterStories = Array.isArray(
        parsedResponse.beforeAfterStories,
      )
        ? parsedResponse.beforeAfterStories
        : [];

      // Parse numeric values
      const price =
        typeof parsedResponse.price === "string"
          ? parseInt(parsedResponse.price.replace(/[^\d]/g, ""))
          : parseInt(parsedResponse.price) || 299;

      const originalPrice =
        typeof parsedResponse.originalPrice === "string"
          ? parseInt(parsedResponse.originalPrice.replace(/[^\d]/g, ""))
          : parseInt(parsedResponse.originalPrice) || 399;

      const meals =
        typeof parsedResponse.meals === "string"
          ? parseInt(parsedResponse.meals.replace(/[^\d]/g, ""))
          : parseInt(parsedResponse.meals) || 5;

      const calories =
        typeof parsedResponse.calories === "string"
          ? parseInt(parsedResponse.calories.replace(/[^\d]/g, ""))
          : parseInt(parsedResponse.calories) || 1800;

      // Return generated data without adding to database
      return {
        title: parsedResponse.title || "",
        shortDescription: parsedResponse.shortDescription || "",
        description: parsedResponse.description || "",
        category: parsedResponse.category || "Zdrowa dieta",
        duration: parsedResponse.duration || "8 tygodni",
        difficulty: parsedResponse.difficulty || "Średni",
        rating: 0,
        followers: 0,
        price: price,
        originalPrice: originalPrice,
        image: "",
        meals: meals,
        calories: calories,
        isPopular: false,
        isNew: false,
        tags: tagsArray,
        questions: questions,

        // Professional dietetics fields
        nutritionistName: parsedResponse.nutritionistName || "",
        nutritionistCredentials: parsedResponse.nutritionistCredentials || "",
        nutritionistBio: parsedResponse.nutritionistBio || "",

        // Detailed diet information
        dietOverview: parsedResponse.dietOverview || "",
        benefits: benefits,
        contraindications: contraindications,
        targetAudience: targetAudience,
        mealPlanStructure: parsedResponse.mealPlanStructure || "",
        shoppingList: shoppingList,
        preparationTips: preparationTips,
        progressTracking: parsedResponse.progressTracking || "",
        maintenancePhase: parsedResponse.maintenancePhase || "",

        // Scientific backing
        scientificReferences: scientificReferences,
        clinicalStudies: clinicalStudies,

        // Success metrics
        averageWeightLoss: parsedResponse.averageWeightLoss || "",
        averageTimeToResults: parsedResponse.averageTimeToResults || "",
        successRate: parsedResponse.successRate || "",

        // Additional content
        faq: faq,
        testimonials: testimonials,
        beforeAfterStories: beforeAfterStories,
      };
    } catch (error) {
      throw error;
    }
  },

  // Generate detailed diet sections
  async generateDetailedDietSection(
    topic: string,
    section: string,
    currentDiet?: Partial<Diet>,
  ): Promise<Partial<Diet>> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/generateDietDetailed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            section,
            currentDiet,
          }),
        },
      );

      const generatedData = await response.json();

      // Check if the response contains an error
      if (generatedData.error) {
        throw new Error(generatedData.error);
      }

      // Parse JSON strings to arrays/objects based on section
      const parsedData: Record<string, unknown> = {};

      switch (section) {
        case "nutritionist":
          parsedData.nutritionistName = generatedData.nutritionistName || "";
          parsedData.nutritionistCredentials =
            generatedData.nutritionistCredentials || "";
          parsedData.nutritionistBio = generatedData.nutritionistBio || "";
          break;

        case "benefits":
          // Handle benefits data - check if it's already an array or needs parsing
          try {
            parsedData.benefits = Array.isArray(generatedData.benefits)
              ? generatedData.benefits
              : typeof generatedData.benefits === "string"
                ? JSON.parse(generatedData.benefits)
                : [];
          } catch {
            parsedData.benefits = [];
          }

          try {
            parsedData.contraindications = Array.isArray(
              generatedData.contraindications,
            )
              ? generatedData.contraindications
              : typeof generatedData.contraindications === "string"
                ? JSON.parse(generatedData.contraindications)
                : [];
          } catch {
            parsedData.contraindications = [];
          }

          try {
            parsedData.targetAudience = Array.isArray(
              generatedData.targetAudience,
            )
              ? generatedData.targetAudience
              : typeof generatedData.targetAudience === "string"
                ? JSON.parse(generatedData.targetAudience)
                : [];
          } catch {
            parsedData.targetAudience = [];
          }
          break;

        case "mealPlan":
          parsedData.mealPlanStructure = generatedData.mealPlanStructure || "";
          try {
            parsedData.shoppingList = Array.isArray(generatedData.shoppingList)
              ? generatedData.shoppingList
              : typeof generatedData.shoppingList === "string"
                ? JSON.parse(generatedData.shoppingList)
                : [];
          } catch {
            parsedData.shoppingList = [];
          }
          try {
            parsedData.preparationTips = Array.isArray(
              generatedData.preparationTips,
            )
              ? generatedData.preparationTips
              : typeof generatedData.preparationTips === "string"
                ? JSON.parse(generatedData.preparationTips)
                : [];
          } catch {
            parsedData.preparationTips = [];
          }
          break;

        case "scientific":
          try {
            parsedData.scientificReferences = Array.isArray(
              generatedData.scientificReferences,
            )
              ? generatedData.scientificReferences
              : typeof generatedData.scientificReferences === "string"
                ? JSON.parse(generatedData.scientificReferences)
                : [];
          } catch {
            parsedData.scientificReferences = [];
          }
          try {
            parsedData.clinicalStudies = Array.isArray(
              generatedData.clinicalStudies,
            )
              ? generatedData.clinicalStudies
              : typeof generatedData.clinicalStudies === "string"
                ? JSON.parse(generatedData.clinicalStudies)
                : [];
          } catch {
            parsedData.clinicalStudies = [];
          }
          parsedData.averageWeightLoss = generatedData.averageWeightLoss || "";
          parsedData.averageTimeToResults =
            generatedData.averageTimeToResults || "";
          parsedData.successRate = generatedData.successRate || "";
          break;

        case "testimonials":
          try {
            parsedData.testimonials = Array.isArray(generatedData.testimonials)
              ? generatedData.testimonials
              : typeof generatedData.testimonials === "string"
                ? JSON.parse(generatedData.testimonials)
                : [];
          } catch {
            parsedData.testimonials = [];
          }
          try {
            parsedData.beforeAfterStories = Array.isArray(
              generatedData.beforeAfterStories,
            )
              ? generatedData.beforeAfterStories
              : typeof generatedData.beforeAfterStories === "string"
                ? JSON.parse(generatedData.beforeAfterStories)
                : [];
          } catch {
            parsedData.beforeAfterStories = [];
          }
          try {
            parsedData.faq = Array.isArray(generatedData.faq)
              ? generatedData.faq
              : typeof generatedData.faq === "string"
                ? JSON.parse(generatedData.faq)
                : [];
          } catch {
            parsedData.faq = [];
          }
          break;
      }

      return parsedData as Partial<Diet>;
    } catch (error) {
      throw error;
    }
  },
};

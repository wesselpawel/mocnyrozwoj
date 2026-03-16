import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  getAdminSessionCookieName,
  isValidAdminSessionToken,
} from "@/lib/adminAuth";
import { addDocument, uploadFile } from "@/firebase";
import type {
  ProgrammaticDietDay,
  ShoppingListItem,
  ProgrammaticDietContent,
  ProgrammaticMeal,
} from "@/types/programmaticDiet";
import type { MealType, DietGoal, RecipeEntry, RecipeIngredient, RecipeNameForms } from "@/types/recipe";
import { generateRecipeSlug, generateRecipeSEO, GOAL_LABELS as RECIPE_GOAL_LABELS } from "@/types/recipe";

async function generateMealImage(
  openai: OpenAI,
  mealName: string,
  ingredients: string[]
): Promise<string | null> {
  try {
    const ingredientsList = ingredients.slice(0, 5).join(", ");
    const prompt = `Professional food photography of "${mealName}" dish. Ingredients: ${ingredientsList}. Beautifully plated on a white ceramic plate, top-down view, natural lighting, restaurant quality presentation, appetizing, high-end food styling, shallow depth of field, clean background.`;

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "256x256",
    });

    return response.data?.[0]?.url || null;
  } catch (error) {
    console.error("Error generating meal image:", error);
    return null;
  }
}

async function downloadAndUploadImage(
  imageUrl: string,
  fileName: string
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const uploadedUrl = await uploadFile(uint8Array, `meals/${fileName}`);
    return uploadedUrl;
  } catch (error) {
    console.error("Error downloading/uploading image:", error);
    return null;
  }
}

const GOAL_LABELS: Record<string, string> = {
  mass: "budowanie masy mięśniowej",
  reduction: "redukcja tkanki tłuszczowej",
  maintenance: "utrzymanie wagi",
};

const MEAL_TYPE_MAP: Record<number, Record<number, MealType>> = {
  3: { 1: "Śniadanie", 2: "Obiad", 3: "Kolacja" },
  4: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Kolacja" },
  5: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Podwieczorek", 5: "Kolacja" },
  6: { 1: "Śniadanie", 2: "Drugie śniadanie", 3: "Obiad", 4: "Podwieczorek", 5: "Kolacja", 6: "Przekąska" },
};

const DIET_DAY_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    dietDay: {
      type: "object",
      additionalProperties: false,
      properties: {
        dayLabel: { type: "string" },
        mealsPerDay: { type: "number" },
        totalCalories: { type: "number" },
        meals: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              mealNumber: { type: "number" },
              mealName: { type: "string" },
              mealNameForms: {
                type: "object",
                additionalProperties: false,
                properties: {
                  base: { type: "string", description: "Mianownik (nominative): Jajecznica z pomidorem" },
                  genitive: { type: "string", description: "Dopełniacz (genitive): Jajecznicy z pomidorem - używane po: przepis na, porcja" },
                  accusative: { type: "string", description: "Biernik (accusative): Jajecznicę z pomidorem - używane po: zjeść, przygotować" },
                  short: { type: "string", description: "Krótka forma: Jajecznica z pomidorem" },
                },
                required: ["base", "genitive", "accusative", "short"],
              },
              time: { type: "string" },
              calories: { type: "number" },
              proteinG: { type: "number" },
              fatG: { type: "number" },
              carbsG: { type: "number" },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "string" },
                    calories: { type: "number" },
                    category: { type: "string" },
                  },
                  required: ["name", "quantity", "calories", "category"],
                },
              },
              preparationSteps: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "mealNumber",
              "mealName",
              "mealNameForms",
              "time",
              "calories",
              "proteinG",
              "fatG",
              "carbsG",
              "ingredients",
              "preparationSteps",
            ],
          },
        },
        notes: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["dayLabel", "mealsPerDay", "totalCalories", "meals", "notes"],
    },
    shoppingList: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          name: { type: "string" },
          quantity: { type: "string" },
          category: { type: "string" },
        },
        required: ["name", "quantity", "category"],
      },
    },
  },
  required: ["dietDay", "shoppingList"],
} as const;

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(getAdminSessionCookieName())?.value;
  const isSessionValid = await isValidAdminSessionToken(cookie);
  if (!isSessionValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is missing" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    const calories =
      typeof body?.calories === "number" ? body.calories : parseInt(body?.calories) || 2000;
    const goal = ["mass", "reduction", "maintenance"].includes(body?.goal)
      ? (body.goal as "mass" | "reduction" | "maintenance")
      : "mass";
    const mealCount =
      typeof body?.mealCount === "number"
        ? Math.min(6, Math.max(3, body.mealCount))
        : 4;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const goalLabel = GOAL_LABELS[goal];
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.responses.create({
      model: "gpt-4.1-2025-04-14",
      input: [
        {
          role: "system",
          content: `Jesteś doświadczonym dietetykiem. Tworzysz praktyczny, realistyczny plan posiłków dla polskiego odbiorcy.
Odpowiadasz wyłącznie po polsku i wyłącznie JSON zgodny ze schematem.
Tworzysz przepisy z dokładnymi gramaturami i krokami przygotowania.
WAŻNE: Dla każdego składnika podaj dokładną kaloryczność w kcal.
Lista zakupów powinna zawierać wszystkie składniki z przepisów, pogrupowane według kategorii.
WAŻNE: Dla każdego posiłku podaj mealNameForms z polskimi odmianami nazwy (mianownik, dopełniacz, biernik, forma krótka).`,
        },
        {
          role: "user",
          content: `Wygeneruj kompletny dzień diety z przepisami i listą zakupów.

Kalorie dziennie: ${calories} kcal
Liczba posiłków: ${mealCount}
Cel diety: ${goalLabel}

Wymagania:
- Stwórz ${mealCount} posiłków sumujących się do około ${calories} kcal (tolerancja +/- 50 kcal)
- Dla celu "${goalLabel}" dobierz odpowiednie proporcje makroskładników
- Każdy posiłek musi mieć:
  - mealName: pełna nazwa posiłku (np. "Jajecznica z pomidorem i chlebem żytnim")
  - mealNameForms: obiekt z polskimi odmianami nazwy posiłku:
    * base: mianownik (kto? co?) - np. "Jajecznica z pomidorem i chlebem żytnim"
    * genitive: dopełniacz (kogo? czego?) - np. "Jajecznicy z pomidorem i chlebem żytnim" (po: "przepis na", "porcja")
    * accusative: biernik (kogo? co?) - np. "Jajecznicę z pomidorem i chlebem żytnim" (po: "zjeść", "przygotować")
    * short: skrócona forma do tytułów - np. "Jajecznica z pomidorem"
  - ingredients jako tablica obiektów z polami: name (nazwa produktu), quantity (np. "100g", "2 kromki"), calories (liczba kcal dla tej porcji), category (kategoria produktu)
  - Szczegółowe kroki przygotowania (minimum 3-5 kroków)
  - Realistyczne czasy posiłków (np. "7:00", "10:00", "13:00", "16:00", "19:00")
- WAŻNE: Suma kalorii składników każdego posiłku musi się zgadzać z calories posiłku
- Lista zakupów powinna zawierać wszystkie składniki z ilościami
- Kategorie: "Mięso i ryby", "Nabiał", "Warzywa", "Owoce", "Pieczywo i zboża", "Tłuszcze", "Przyprawy i dodatki"
- Używaj produktów łatwo dostępnych w polskich sklepach
- W notes dodaj 2-3 praktyczne wskazówki dotyczące przygotowania posiłków`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "diet_content",
          schema: DIET_DAY_SCHEMA,
        },
      },
    });

    const payload = JSON.parse(response.output_text) as {
      dietDay: ProgrammaticDietDay;
      shoppingList: ShoppingListItem[];
    };

    if (!payload.dietDay || !payload.shoppingList) {
      return NextResponse.json(
        { error: "Model nie zwrócił poprawnych danych." },
        { status: 502 }
      );
    }

    const generatedAt = new Date().toISOString();
    const mealTypeMap = MEAL_TYPE_MAP[mealCount] || MEAL_TYPE_MAP[4];

    // Generate images for each meal in parallel
    const mealsWithImages: ProgrammaticMeal[] = await Promise.all(
      payload.dietDay.meals.map(async (meal) => {
        const ingredientNames = (meal.ingredients as RecipeIngredient[]).map((i) => i.name);
        const imageUrl = await generateMealImage(openai, meal.mealName, ingredientNames);
        
        let finalImageUrl: string | undefined;
        if (imageUrl) {
          const fileName = `${slug}-meal-${meal.mealNumber}-${Date.now()}.png`;
          const uploadedUrl = await downloadAndUploadImage(imageUrl, fileName);
          finalImageUrl = uploadedUrl || undefined;
        }

        return {
          ...meal,
          imageUrl: finalImageUrl,
        };
      })
    );

    const dietDayWithImages: ProgrammaticDietDay = {
      ...payload.dietDay,
      meals: mealsWithImages,
    };

    const content: ProgrammaticDietContent = {
      slug,
      calories,
      goal,
      mealCount,
      dietDay: dietDayWithImages,
      shoppingList: payload.shoppingList,
      generatedAt,
      generatedBy: "admin",
    };

    await addDocument("programmaticDiets", slug, content);

    // Save each meal as a separate recipe for programmatic SEO
    const savedRecipes: RecipeEntry[] = [];

    for (const meal of mealsWithImages) {
      const mealType = mealTypeMap[meal.mealNumber] || "Przekąska";
      const recipeSlug = generateRecipeSlug(mealType, meal.calories, goal, meal.mealName);
      const seo = generateRecipeSEO(mealType, meal.calories, goal, meal.mealName);

      const nameForms: RecipeNameForms | undefined = meal.mealNameForms ? {
        base: meal.mealNameForms.base,
        genitive: meal.mealNameForms.genitive,
        accusative: meal.mealNameForms.accusative,
        short: meal.mealNameForms.short,
      } : undefined;

      const recipe: RecipeEntry = {
        slug: recipeSlug,
        mealType,
        mealNumber: meal.mealNumber,
        name: meal.mealName,
        nameForms,
        time: meal.time,
        calories: meal.calories,
        proteinG: meal.proteinG,
        fatG: meal.fatG,
        carbsG: meal.carbsG,
        goal,
        goalLabel: RECIPE_GOAL_LABELS[goal],
        ingredients: meal.ingredients as RecipeIngredient[],
        preparationSteps: meal.preparationSteps,
        shoppingList: meal.ingredients as RecipeIngredient[],
        seo,
        sourceSlug: slug,
        generatedAt,
        imageUrl: meal.imageUrl,
      };

      try {
        await addDocument("recipes", recipeSlug, recipe);
        savedRecipes.push(recipe);
      } catch (err) {
        console.error(`Failed to save recipe ${recipeSlug}:`, err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      content,
      recipes: savedRecipes,
      recipesCount: savedRecipes.length,
    });
  } catch (error) {
    console.error("Error generating programmatic diet:", error);
    return NextResponse.json(
      { error: "Nie udało się wygenerować zawartości diety." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const { getDocument } = await import("@/firebase");
    let content = await getDocument("programmaticDiets", slug);

    // Backward compatibility: support legacy document IDs created before hub URLs.
    // Old IDs used slug format like "dieta-na-mase-1500-kcal-jadlospis-3-posilki",
    // while new pages use "na-mase/1500-kcal/3-posilki".
    if (!content && slug.startsWith("na-mase/")) {
      const match = slug.match(/^na-mase\/(\d+)-kcal\/(3-posilki|4-posilki|5-posilkow)$/);
      if (match) {
        const calorie = parseInt(match[1], 10);
        const mealSegment = match[2];
        const mealCount = mealSegment.startsWith("3")
          ? 3
          : mealSegment.startsWith("4")
          ? 4
          : 5;
        const { dietParamsToSlug } = await import("@/programmatic/diet/generator");
        const legacySlug = dietParamsToSlug({ calorie, goal: "mass", mealCount });
        content = await getDocument("programmaticDiets", legacySlug);
      }
    }
    if (!content && slug.startsWith("na-redukcje/")) {
      const match = slug.match(/^na-redukcje\/(\d+)-kcal\/(3-posilki|4-posilki|5-posilkow)$/);
      if (match) {
        const calorie = parseInt(match[1], 10);
        const mealSegment = match[2];
        const mealCount = mealSegment.startsWith("3")
          ? 3
          : mealSegment.startsWith("4")
          ? 4
          : 5;
        const { dietParamsToSlug } = await import("@/programmatic/diet/generator");
        const legacySlug = dietParamsToSlug({ calorie, goal: "reduction", mealCount });
        content = await getDocument("programmaticDiets", legacySlug);
      }
    }
    if (!content && slug.startsWith("na-utrzymanie-wagi/")) {
      const match = slug.match(/^na-utrzymanie-wagi\/(\d+)-kcal\/(3-posilki|4-posilki|5-posilkow)$/);
      if (match) {
        const calorie = parseInt(match[1], 10);
        const mealSegment = match[2];
        const mealCount = mealSegment.startsWith("3")
          ? 3
          : mealSegment.startsWith("4")
          ? 4
          : 5;
        const { dietParamsToSlug } = await import("@/programmatic/diet/generator");
        const legacySlug = dietParamsToSlug({ calorie, goal: "maintenance", mealCount });
        content = await getDocument("programmaticDiets", legacySlug);
      }
    }

    if (!content) {
      return NextResponse.json({ content: null });
    }

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ content: null });
  }
}
